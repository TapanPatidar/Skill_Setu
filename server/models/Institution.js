import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Institution name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Institutional code is required'],
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['Ayush National Institute', 'Ayurveda College', 'University', 'Technical Institute', 'Medical College', 'Other'],
      default: 'Ayush National Institute',
    },
    location: {
      city: { type: String, default: 'New Delhi' },
      state: { type: String, default: 'Delhi' },
      country: { type: String, default: 'India' },
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    placementCell: {
      headName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    website: {
      type: String,
      default: '',
    },
    moUsSigned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Institution = mongoose.model('Institution', institutionSchema);
