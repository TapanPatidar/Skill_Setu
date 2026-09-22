import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
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
    headOfDepartment: {
      type: String,
      default: '',
    },
    facultyCount: {
      type: Number,
      default: 12,
    },
    studentCount: {
      type: Number,
      default: 180,
    },
    placementRate: {
      type: Number,
      default: 85,
    },
    cohorts: [
      {
        year: Number,
        batch: String,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

departmentSchema.index({ institution: 1, domain: 1 });

export const Department = mongoose.model('Department', departmentSchema);
