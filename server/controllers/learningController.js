import { LearningProgram } from '../models/LearningProgram.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Get learning programs with filtering by domain, subField, skill
 * @route GET /api/learning
 * @access Public
 */
export const getLearningPrograms = async (req, res, next) => {
  try {
    const { domain, subField, skill, search } = req.query;
    let query = { status: 'active' };

    if (domain) query.domain = domain;
    if (subField) query.subField = subField;
    if (skill) query.skillsCovered = { $in: [new RegExp(skill, 'i')] };

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { providerName: new RegExp(search, 'i') },
        { skillsCovered: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const programs = await LearningProgram.find(query).sort({ createdAt: -1 });

    // If student is logged in, attach enrollment status
    let userEnrollments = [];
    if (req.user && req.user.role === 'student') {
      userEnrollments = await Enrollment.find({ student: req.user._id });
    }

    const enriched = programs.map((p) => {
      const pObj = p.toObject();
      const enrollment = userEnrollments.find((e) => e.program.toString() === p._id.toString());
      pObj.isEnrolled = !!enrollment;
      pObj.progress = enrollment ? enrollment.progressPercent : 0;
      return pObj;
    });

    return sendResponse(res, 200, true, enriched, 'Learning programs retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create learning program (Industry or Institution)
 * @route POST /api/learning
 * @access Private (Industry, Institution)
 */
export const createLearningProgram = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const providerName = user.profile?.companyName || user.name;

    const program = await LearningProgram.create({
      ...req.body,
      provider: req.user._id,
      providerName,
    });

    return sendResponse(res, 201, true, program, 'Learning program created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Enroll in learning program (Student)
 * @route POST /api/learning/:id/enroll
 * @access Private (Student)
 */
export const enrollInProgram = async (req, res, next) => {
  try {
    const programId = req.params.id;
    const studentId = req.user._id;

    const program = await LearningProgram.findById(programId);
    if (!program) return sendResponse(res, 404, false, null, 'Program not found');

    let enrollment = await Enrollment.findOne({ student: studentId, program: programId });
    if (enrollment) {
      return sendResponse(res, 400, false, null, 'Already enrolled in this program');
    }

    enrollment = await Enrollment.create({
      student: studentId,
      program: programId,
      progressPercent: 10,
      status: 'enrolled',
    });

    program.enrolledCount = (program.enrolledCount || 0) + 1;
    await program.save();

    return sendResponse(res, 201, true, enrollment, 'Successfully enrolled in learning program');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update enrollment progress
 * @route PATCH /api/learning/:id/progress
 * @access Private (Student)
 */
export const updateProgress = async (req, res, next) => {
  try {
    const { progressPercent } = req.body;
    const programId = req.params.id;

    const enrollment = await Enrollment.findOne({ student: req.user._id, program: programId });
    if (!enrollment) return sendResponse(res, 404, false, null, 'Enrollment not found');

    enrollment.progressPercent = Math.min(100, Math.max(0, progressPercent));
    if (enrollment.progressPercent === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    return sendResponse(res, 200, true, enrollment, 'Progress updated successfully');
  } catch (error) {
    next(error);
  }
};
