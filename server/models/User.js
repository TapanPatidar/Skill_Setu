import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @typedef {Object} UserDocument
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'student' | 'academician' | 'industry' | 'institution'} role
 * @property {mongoose.Schema.Types.ObjectId} [institution]
 * @property {Object} profile
 * @property {string[]} skills
 * @property {string[]} interests
 * @property {string} [avatar]
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'academician', 'industry', 'institution'],
      required: [true, 'Role is required'],
      default: 'student',
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    // Domain taxonomy fields
    primaryDomain: {
      type: String,
      default: 'Engineering & Technology',
    },
    secondaryDomains: {
      type: [String],
      default: [],
    },
    subField: {
      type: String,
      default: 'Computer Science & IT',
    },
    year: {
      type: Number,
      default: 3,
    },
    semester: {
      type: Number,
      default: 6,
    },
    course: {
      type: String,
      default: 'B.Tech',
    },
    degree: {
      type: String,
      default: 'Bachelor of Technology',
    },
    profile: {
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      // Student specific
      enrollmentNumber: { type: String, default: '' },
      batch: { type: String, default: '' },
      cgpa: { type: Number, default: 0 },
      degree: { type: String, default: '' },
      department: { type: String, default: '' },
      ayushSpecialization: { type: String, default: '' },
      targetRole: { type: String, default: '' },
      // Faculty specific
      designation: { type: String, default: '' },
      researchAreas: { type: [String], default: [] },
      publicationsCount: { type: Number, default: 0 },
      // Industry specific
      companyName: { type: String, default: '' },
      companyWebsite: { type: String, default: '' },
      industrySector: { type: String, default: '' },
      sector: { type: String, default: 'IT Services & Software' },
      companySize: { type: String, default: '50-200' },
      locations: { type: [String], default: ['Bangalore', 'Remote'] },
      hiringDomains: { type: [String], default: ['Engineering & Technology', 'Management & Business'] },
      // Institution specific
      officialDesignation: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
