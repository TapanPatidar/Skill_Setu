import express from 'express';
import {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  uploadMiddleware,
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', protect, uploadMiddleware.single('file'), uploadDocument);
router.get('/', protect, getMyDocuments);
router.delete('/:id', protect, deleteDocument);

export default router;
