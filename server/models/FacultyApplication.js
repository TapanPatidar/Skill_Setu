import mongoose from 'mongoose';

const facultyApplicationSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacultyOpportunity',
      required: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'institution-approved', 'industry-accepted', 'completed', 'rejected'],
      default: 'submitted',
    },
    proposalSummary: {
      type: String,
      default: '',
    },
    institutionApproval: {
      status: {
        type: String,
        enum: ['pending', 'noc-granted', 'rejected'],
        default: 'pending',
      },
      nocDocUrl: String,
      approvedAt: Date,
      approverName: String,
    },
    expectedOutcomes: [String],
  },
  { timestamps: true }
);

export const FacultyApplication = mongoose.model('FacultyApplication', facultyApplicationSchema);
