import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected'],
      default: 'applied',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected'],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    skillMatchPercentage: {
      type: Number,
      default: 85,
    },
    eligibilityScore: {
      type: Number,
      default: 90,
    },
    interviewSchedule: {
      scheduledDate: Date,
      meetingLink: String,
      instructions: String,
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
