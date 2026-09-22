import mongoose from 'mongoose';

const skillAssessmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'Comprehensive Skill & Domain Competency Assessment',
    },
    domain: {
      type: String,
      default: 'Engineering & Technology',
    },
    subField: {
      type: String,
      default: 'Computer Science & IT',
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    aptitudeScore: {
      type: Number,
      default: 0,
    },
    softSkillsScore: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'Technical & Aptitude Assessment',
    },
    answers: [
      {
        questionId: String,
        questionText: String,
        selectedOption: String,
        isCorrect: Boolean,
        scoreEarned: Number,
      },
    ],
    scoresByCategory: [
      {
        category: String,
        scorePercent: Number,
        proficiencyLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Intermediate',
        },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'verified'],
      default: 'completed',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const SkillAssessment = mongoose.model('SkillAssessment', skillAssessmentSchema);
