import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
    },
    category: {
      type: String,
      enum: ['resume', 'certificate', 'internship-report', 'academic-record', 'portfolio-work', 'noc', 'mou', 'research-paper', 'verification'],
      required: true,
      default: 'certificate',
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: Number,
    mimeType: String,
    metadata: {
      verifiedByInstitution: { type: Boolean, default: false },
      verifiedAt: Date,
      hash: String,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
