import mongoose from 'mongoose';

const internshipRecordSchema = new mongoose.Schema(
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
    industryMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    academicGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completedDate: Date,
        status: {
          type: String,
          enum: ['pending', 'submitted', 'approved', 'delayed'],
          default: 'pending',
        },
        deliverableUrl: String,
      },
    ],
    weeklyLogs: [
      {
        weekNumber: Number,
        summary: String,
        tasksCompleted: [String],
        hoursLogged: Number,
        submittedAt: { type: Date, default: Date.now },
        mentorVerified: { type: Boolean, default: false },
      },
    ],
    mentorFeedback: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: String,
        rating: Number,
        remarks: String,
        date: { type: Date, default: Date.now },
      },
    ],
    completion: {
      isCompleted: { type: Boolean, default: false },
      finalGrade: String,
      certificateIssued: { type: Boolean, default: false },
      certificateUrl: String,
      completionDate: Date,
    },
  },
  { timestamps: true }
);

export const InternshipRecord = mongoose.model('InternshipRecord', internshipRecordSchema);
