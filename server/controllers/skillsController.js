import { SkillProfile } from '../models/SkillProfile.js';
import { User } from '../models/User.js';
import { LearningProgram } from '../models/LearningProgram.js';
import { sendResponse } from '../utils/response.js';
import { calculateSkillGaps, getRecommendationsAndCareerPath } from '../services/matchingService.js';

/**
 * @desc Get current student's skill profile & benchmarks
 * @route GET /api/skills/profile
 * @access Private (Student)
 */
export const getStudentSkillProfile = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const user = await User.findById(studentId);

    let profile = await SkillProfile.findOne({ student: studentId }).populate('skillGaps.recommendedProgram');

    if (!profile && user) {
      // Initialize default profile
      const gaps = calculateSkillGaps(user);
      profile = await SkillProfile.create({
        student: studentId,
        readinessScore: 78,
        skillGaps: gaps,
        benchmarks: [
          { subject: 'Technical Core', studentScore: 82, industryBenchmark: 75, fullMark: 100 },
          { subject: 'Analytical Aptitude', studentScore: 78, industryBenchmark: 70, fullMark: 100 },
          { subject: 'Professional Soft Skills', studentScore: 85, industryBenchmark: 80, fullMark: 100 },
          { subject: 'Tools & Architecture', studentScore: 74, industryBenchmark: 75, fullMark: 100 },
          { subject: 'Industry Standards/Compliance', studentScore: 68, industryBenchmark: 65, fullMark: 100 },
        ],
        verifiedSkills: (user.skills || []).map((skillName) => ({
          skillName,
          level: 'Intermediate',
          verifiedAt: new Date(),
        })),
      });
    }

    return sendResponse(res, 200, true, { profile, user }, 'Skill profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get prioritized skill gaps against target role
 * @route GET /api/skills/gaps
 * @access Private (Student)
 */
export const getSkillGaps = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const user = await User.findById(studentId);
    if (!user) return sendResponse(res, 404, false, null, 'User not found');

    const gaps = calculateSkillGaps(user);

    // Attach suggested programs for top gaps
    const programs = await LearningProgram.find({
      $or: [{ domain: user.primaryDomain }, { skillsCovered: { $in: gaps.map((g) => g.skillName) } }],
    }).limit(6);

    const enrichedGaps = gaps.map((gap, i) => ({
      ...gap,
      suggestedProgram: programs[i % programs.length] || null,
    }));

    return sendResponse(
      res,
      200,
      true,
      {
        gaps: enrichedGaps,
        targetRole: user.profile?.targetRole || 'Full-Stack Developer / Domain Specialist',
        domain: user.primaryDomain,
        subField: user.subField,
      },
      'Skill gaps analyzed successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get career recommendations & learning pathways
 * @route GET /api/skills/recommendations
 * @access Private (Student)
 */
export const getCareerRecommendations = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const user = await User.findById(studentId);
    if (!user) return sendResponse(res, 404, false, null, 'User not found');

    const recommendations = getRecommendationsAndCareerPath(user);

    // Find tailored learning programs
    const programs = await LearningProgram.find({
      $or: [{ domain: user.primaryDomain }, { skillsCovered: { $in: user.skills } }],
    }).limit(8);

    return sendResponse(
      res,
      200,
      true,
      {
        ...recommendations,
        recommendedPrograms: programs,
      },
      'Career guidance & recommendations generated successfully'
    );
  } catch (error) {
    next(error);
  }
};
