import mongoose from 'mongoose';

const collabEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    type: {
      type: String,
      enum: ['guest-lecture', 'workshop', 'innovation-challenge', 'live-project', 'case-competition', 'mentorship'],
      required: true,
      default: 'workshop',
      index: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    speakerName: {
      type: String,
      default: '',
    },
    organizationName: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: 'Engineering & Technology',
      index: true,
    },
    subField: {
      type: String,
      default: '',
      index: true,
    },
    sector: {
      type: String,
      default: '',
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 90,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    maxParticipants: {
      type: Number,
      default: 100,
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
    registeredParticipants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String,
        role: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

collabEventSchema.index({ domain: 1, type: 1, status: 1 });
collabEventSchema.index({ scheduledAt: 1 });

export const CollabEvent = mongoose.model('CollabEvent', collabEventSchema);
