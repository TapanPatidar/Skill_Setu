import { Opportunity } from '../models/Opportunity.js';
import { Application } from '../models/Application.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';
import { calculateOpportunityMatch } from '../services/matchingService.js';

/**
 * @desc Get all opportunities with rich filters, pagination and student matchScore
 * @route GET /api/opportunities
 * @access Public / Private
 */
export const getOpportunities = async (req, res, next) => {
  try {
    const {
      domain,
      subField,
      sector,
      type,
      workMode,
      skills,
      location,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    let query = { status: 'open' };

    if (domain) query.domain = domain;
    if (subField) query.subField = subField;
    if (sector) query.sector = sector;
    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (location) query.location = new RegExp(location, 'i');

    if (skills) {
      const skillsArr = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
      query.requiredSkills = { $in: skillsArr };
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
        { domain: new RegExp(search, 'i') },
        { subField: new RegExp(search, 'i') },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Opportunity.countDocuments(query);
    const rawOpps = await Opportunity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // If authenticated student, calculate personalized match score
    let student = null;
    if (req.user && req.user.role === 'student') {
      student = await User.findById(req.user._id);
    }

    const opportunities = rawOpps.map((opp) => {
      const oppObj = opp.toObject();
      if (student) {
        const matchData = calculateOpportunityMatch(student, oppObj);
        return { ...oppObj, ...matchData };
      }
      return { ...oppObj, matchScore: 78, matchedSkills: [], missingSkills: [] };
    });

    return sendResponse(
      res,
      200,
      true,
      {
        opportunities,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / parseInt(limit, 10)),
          limit: parseInt(limit, 10),
        },
      },
      'Opportunities retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single opportunity by ID
 * @route GET /api/opportunities/:id
 * @access Public
 */
export const getOpportunityById = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('company', 'name email profile');
    if (!opp) return sendResponse(res, 404, false, null, 'Opportunity not found');

    const oppObj = opp.toObject();
    if (req.user && req.user.role === 'student') {
      const student = await User.findById(req.user._id);
      if (student) {
        const matchData = calculateOpportunityMatch(student, oppObj);
        Object.assign(oppObj, matchData);
      }
    }

    return sendResponse(res, 200, true, oppObj, 'Opportunity details');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new opportunity (Industry only)
 * @route POST /api/opportunities
 * @access Private (Industry)
 */
export const createOpportunity = async (req, res, next) => {
  try {
    if (req.user.role !== 'industry' && req.user.role !== 'institution') {
      return sendResponse(res, 403, false, null, 'Only industry recruiters can post opportunities');
    }

    const user = await User.findById(req.user._id);
    const companyName = user.profile?.companyName || user.name;

    const opportunity = await Opportunity.create({
      ...req.body,
      company: req.user._id,
      companyName,
    });

    return sendResponse(res, 201, true, opportunity, 'Opportunity posted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update opportunity (Owner only)
 * @route PATCH /api/opportunities/:id
 * @access Private (Industry)
 */
export const updateOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return sendResponse(res, 404, false, null, 'Opportunity not found');

    if (opp.company.toString() !== req.user._id.toString() && req.user.role !== 'institution') {
      return sendResponse(res, 403, false, null, 'Unauthorized to edit this opportunity');
    }

    const updated = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendResponse(res, 200, true, updated, 'Opportunity updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get industry user's own posted opportunities
 * @route GET /api/opportunities/mine
 * @access Private (Industry)
 */
export const getMyOpportunities = async (req, res, next) => {
  try {
    const opps = await Opportunity.find({ company: req.user._id }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, opps, 'Your posted opportunities');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get ranked candidates for a specific opportunity
 * @route GET /api/opportunities/:id/candidates
 * @access Private (Industry)
 */
export const getOpportunityCandidates = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return sendResponse(res, 404, false, null, 'Opportunity not found');

    if (opp.company.toString() !== req.user._id.toString() && req.user.role !== 'institution') {
      return sendResponse(res, 403, false, null, 'Unauthorized to view candidates for this posting');
    }

    const applications = await Application.find({ opportunity: req.params.id })
      .populate('student', 'name email avatar skills profile year semester primaryDomain subField')
      .populate('resumeDocument')
      .sort({ createdAt: -1 });

    const rankedCandidates = applications.map((app) => {
      const student = app.student;
      let matchScore = 80;
      let matchedSkills = [];
      let missingSkills = [];

      if (student) {
        const matchData = calculateOpportunityMatch(student, opp);
        matchScore = matchData.matchScore;
        matchedSkills = matchData.matchedSkills;
        missingSkills = matchData.missingSkills;
      }

      // Check eligibility constraints
      const minCgpa = opp.eligibility?.minCgpa || 6.0;
      const studentCgpa = student?.profile?.cgpa || 7.5;
      const cgpaEligible = studentCgpa >= minCgpa;

      const allowedYears = opp.eligibility?.allowedYears || [2, 3, 4];
      const studentYear = student?.year || 3;
      const yearEligible = allowedYears.includes(studentYear);

      const eligibilityStatus = cgpaEligible && yearEligible ? 'Eligible' : 'Review Required';

      return {
        applicationId: app._id,
        student,
        status: app.status,
        statusHistory: app.statusHistory,
        matchScore,
        matchedSkills,
        missingSkills,
        eligibilityStatus,
        studentCgpa,
        studentYear,
        appliedAt: app.createdAt,
        resumeDocument: app.resumeDocument,
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter,
      };
    });

    // Sort by match score descending
    rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return sendResponse(res, 200, true, { opportunity: opp, candidates: rankedCandidates }, 'Candidates ranked successfully');
  } catch (error) {
    next(error);
  }
};
