import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Opportunity description is required'],
    },
    type: {
      type: String,
      enum: ['internship', 'job', 'apprenticeship', 'project'],
      required: true,
      default: 'internship',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Hybrid / New Delhi',
    },
    workMode: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
      default: 'hybrid',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    eligibility: {
      degree: { type: String, default: 'Any Relevant Degree' },
      branches: { type: [String], default: [] },
      allowedYears: { type: [Number], default: [2, 3, 4] },
      minCgpa: { type: Number, default: 6.0 },
      batchAllowed: [String],
    },
    stipendOrCtc: {
      amount: { type: String, default: '₹25,000 / month' },
      currency: { type: String, default: 'INR' },
      type: { type: String, enum: ['stipend', 'ctc', 'unpaid'], default: 'stipend' },
    },
    openings: {
      type: Number,
      default: 3,
      min: 1,
    },
    deadline: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      default: '6 Months',
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
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'archived'],
      default: 'open',
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Opportunity = mongoose.model('Opportunity', opportunitySchema);
