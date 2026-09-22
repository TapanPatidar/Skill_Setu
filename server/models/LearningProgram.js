import mongoose from 'mongoose';

const learningProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['course', 'certification', 'workshop', 'mentorship'],
      required: true,
      default: 'certification',
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerName: {
      type: String,
      required: true,
      default: 'All India Institute of Ayurveda & Industry Consortium',
    },
    skillsCovered: {
      type: [String],
      default: [],
    },
    domain: {
      type: String,
      required: true,
      default: 'Engineering & Technology',
    },
    subField: {
      type: String,
      default: 'Computer Science & IT',
    },
    sector: {
      type: String,
      default: 'IT Services & Software',
    },
    ayushDomain: {
      type: String,
      default: '',
    },
    durationHours: {
      type: Number,
      default: 40,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    certificateAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const LearningProgram = mongoose.model('LearningProgram', learningProgramSchema);
