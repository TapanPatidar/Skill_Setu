import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { FacultyOpportunity } from '../models/FacultyOpportunity.js';
import { FacultyApplication } from '../models/FacultyApplication.js';
import { sendResponse } from '../utils/response.js';
import { paginate } from '../utils/paginate.js';

const router = express.Router();

/**
 * @route   GET /api/faculty-opportunities
 * @desc    Get all faculty opportunities with filters
 * @access  Public / Protected
 */
router.get('/', async (req, res, next) => {
  try {
    const { domain, subField, type, workMode, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'open' };

    if (domain) query.domain = domain;
    if (subField) query.subField = subField;
    if (type) query.type = type;
    if (workMode) query.workMode = workMode;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
      ];
    }

    const result = await paginate(FacultyOpportunity, query, {
      page,
      limit,
      populate: 'hostOrganization',
    });

    return sendResponse(res, 200, true, result, 'Faculty opportunities retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/faculty-opportunities/mine
 * @desc    Get logged in faculty's applications
 * @access  Private (Academician)
 */
router.get('/mine', protect, authorize('academician'), async (req, res, next) => {
  try {
    const applications = await FacultyApplication.find({ faculty: req.user._id })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, applications, 'My faculty applications retrieved');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/faculty-opportunities/:id
 * @desc    Get single faculty opportunity
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const opp = await FacultyOpportunity.findById(req.params.id).populate('hostOrganization');
    if (!opp) {
      return sendResponse(res, 404, false, null, 'Opportunity not found');
    }
    return sendResponse(res, 200, true, opp, 'Faculty opportunity details');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/faculty-opportunities
 * @desc    Create faculty opportunity (Industry / Institution)
 * @access  Private (Industry / Institution)
 */
router.post('/', protect, authorize('industry', 'institution'), async (req, res, next) => {
  try {
    const newOpp = await FacultyOpportunity.create({
      ...req.body,
      hostOrganization: req.user._id,
      organizationName: req.user.profile?.companyName || req.user.institution?.name || req.user.name,
    });

    return sendResponse(res, 201, true, newOpp, 'Faculty opportunity published successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/faculty-opportunities/:id/apply
 * @desc    Apply for faculty opportunity
 * @access  Private (Academician)
 */
router.post('/:id/apply', protect, authorize('academician'), async (req, res, next) => {
  try {
    const opp = await FacultyOpportunity.findById(req.params.id);
    if (!opp) {
      return sendResponse(res, 404, false, null, 'Opportunity not found');
    }

    const existing = await FacultyApplication.findOne({
      faculty: req.user._id,
      opportunity: opp._id,
    });

    if (existing) {
      return sendResponse(res, 400, false, null, 'You have already applied for this opportunity');
    }

    const application = await FacultyApplication.create({
      faculty: req.user._id,
      opportunity: opp._id,
      proposalSummary: req.body.proposalSummary || '',
      expectedOutcomes: req.body.expectedOutcomes || [],
      status: 'submitted',
      institutionApproval: {
        status: 'pending',
        nocDocUrl: req.body.nocDocUrl || '',
      },
    });

    await FacultyOpportunity.findByIdAndUpdate(opp._id, { $inc: { applicantsCount: 1 } });

    return sendResponse(res, 201, true, application, 'Application submitted successfully');
  } catch (err) {
    next(err);
  }
});

export default router;
