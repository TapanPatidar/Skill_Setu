import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    verifiedSkills: [
      {
        skillName: String,
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Intermediate',
        },
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        verifiedAt: Date,
        badgeUrl: String,
      },
    ],
    targetRoles: [String],
    readinessScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    skillGaps: [
      {
        skillName: String,
        currentProficiency: Number,
        requiredProficiency: Number,
        severity: {
          type: String,
          enum: ['critical', 'moderate', 'low'],
          default: 'moderate',
        },
        category: String,
        recommendedProgram: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LearningProgram',
        },
      },
    ],
    benchmarks: [
      {
        subject: String,
        studentScore: Number,
        industryBenchmark: Number,
        fullMark: { type: Number, default: 100 },
      },
    ],
    endorsements: [
      {
        endorser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        skillName: String,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const SkillProfile = mongoose.model('SkillProfile', skillProfileSchema);
