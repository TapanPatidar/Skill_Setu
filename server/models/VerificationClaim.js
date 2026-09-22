import mongoose from 'mongoose';

const verificationClaimSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    claimType: {
      type: String,
      enum: ['skill', 'certificate', 'internship-noc', 'project'],
      required: true,
      default: 'certificate',
      index: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    skillName: {
      type: String,
      default: '',
    },
    certificateTitle: {
      type: String,
      default: '',
    },
    issuingOrg: {
      type: String,
      default: '',
    },
    credentialId: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    studentNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewerNotes: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

verificationClaimSchema.index({ institution: 1, status: 1 });
verificationClaimSchema.index({ createdAt: -1 });

export const VerificationClaim = mongoose.model('VerificationClaim', verificationClaimSchema);
