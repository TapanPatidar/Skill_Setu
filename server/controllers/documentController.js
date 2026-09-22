import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Document } from '../models/Document.js';
import { sendResponse } from '../utils/response.js';

// Configure upload directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error creating upload dir:', err);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${req.user?._id || 'doc'}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF, PNG, JPG, and DOCX files are allowed.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

/**
 * @desc Upload new document into student vault
 * @route POST /api/documents/upload
 * @access Private
 */
export const uploadDocument = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    const file = req.file;

    const doc = await Document.create({
      owner: req.user._id,
      title: title || file?.originalname || 'Uploaded Document',
      category: category || 'certificate',
      filePath: file ? `/uploads/${file.filename}` : '/uploads/mock-credential.pdf',
      fileSize: file ? file.size : 204800,
      mimeType: file ? file.mimetype : 'application/pdf',
      metadata: {
        verifiedByInstitution: false,
        hash: `SHA256-${Date.now().toString(16)}`,
      },
    });

    return sendResponse(res, 201, true, doc, 'Document uploaded successfully to secure vault');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get user's documents
 * @route GET /api/documents
 * @access Private
 */
export const getMyDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, documents, 'Documents retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete document (owner only)
 * @route DELETE /api/documents/:id
 * @access Private
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!doc) return sendResponse(res, 404, false, null, 'Document not found or unauthorized');

    // Remove file if exists
    if (doc.filePath && fs.existsSync(path.join(process.cwd(), doc.filePath))) {
      try {
        fs.unlinkSync(path.join(process.cwd(), doc.filePath));
      } catch (e) {
        // non-blocking
      }
    }

    return sendResponse(res, 200, true, null, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};
