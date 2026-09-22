import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requesterRole: {
      type: String,
      enum: ['student', 'academician'],
      default: 'student',
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mentorRole: {
      type: String,
      enum: ['industry', 'academician'],
      default: 'industry',
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    subField: {
      type: String,
      default: '',
    },
    topic: {
      type: String,
      required: true,
    },
    initialMessage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
      index: true,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        senderName: String,
        senderRole: String,
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

mentorshipRequestSchema.index({ requester: 1, mentor: 1, status: 1 });
mentorshipRequestSchema.index({ createdAt: -1 });

export const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
