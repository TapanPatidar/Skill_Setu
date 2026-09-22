import mongoose from 'mongoose';

const facultyOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['faculty-internship', 'fdp', 'industrial-training', 'consultancy', 'research-project'],
      required: true,
      default: 'fdp',
    },
    hostOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      default: 'Engineering & Technology',
      index: true,
    },
    subField: {
      type: String,
      default: '',
      index: true,
    },
    sector: {
      type: String,
      default: '',
      index: true,
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
      default: 'hybrid',
    },
    location: {
      type: String,
      default: 'Pan-India',
    },
    eligibility: {
      minExperienceYears: { type: Number, default: 2 },
      departmentsAllowed: [String],
    },
    duration: {
      type: String,
      default: '2 Weeks / Modular',
    },
    fundingOrHonorarium: {
      amount: String,
      details: String,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'in-review'],
      default: 'open',
      index: true,
    },
  },
  { timestamps: true }
);

facultyOpportunitySchema.index({ domain: 1, type: 1, status: 1 });
facultyOpportunitySchema.index({ createdAt: -1 });

export const FacultyOpportunity = mongoose.model('FacultyOpportunity', facultyOpportunitySchema);
