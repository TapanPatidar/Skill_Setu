import mongoose from 'mongoose';

const researchProposalSchema = new mongoose.Schema(
  {
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    industryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Research proposal title is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    subField: {
      type: String,
      default: '',
      index: true,
    },
    abstract: {
      type: String,
      required: [true, 'Abstract and methodology summary is required'],
    },
    proposedDuration: {
      type: String,
      default: '6 Months',
    },
    budget: {
      type: String,
      default: '₹ 5,00,000',
    },
    deliverables: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'in-review', 'accepted', 'rejected'],
      default: 'submitted',
      index: true,
    },
    industryFeedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

researchProposalSchema.index({ proposer: 1, industryPartner: 1, status: 1 });
researchProposalSchema.index({ createdAt: -1 });

export const ResearchProposal = mongoose.model('ResearchProposal', researchProposalSchema);
