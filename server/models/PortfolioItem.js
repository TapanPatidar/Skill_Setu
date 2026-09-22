import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Portfolio item title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Project', 'Certification', 'Achievement', 'Publication', 'Patent', 'Clinical Case Study', 'Research Paper', 'Internship Experience'],
      default: 'Project',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    behanceUrl: {
      type: String,
      default: '',
    },
    externalLink: {
      type: String,
      default: '',
    },
    tags: [String],
    skills: [String],
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedRole: {
      type: String,
      enum: ['academician', 'industry', 'institution', 'admin'],
      default: 'academician',
    },
    verifiedAt: Date,
  },
  { timestamps: true }
);

export const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
