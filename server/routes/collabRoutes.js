import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { CollabEvent } from '../models/CollabEvent.js';
import { MentorshipRequest } from '../models/MentorshipRequest.js';
import { ResearchProposal } from '../models/ResearchProposal.js';
import { sendResponse } from '../utils/response.js';
import { paginate } from '../utils/paginate.js';

const router = express.Router();

/* ==========================================================================
   1. COLLAB EVENTS (Guest lectures, workshops, hackathons, live projects)
   ========================================================================== */

/**
 * @route   GET /api/collaboration/events
 * @desc    List collab events with filters
 */
router.get('/events', async (req, res, next) => {
  try {
    const { domain, type, status = 'upcoming', page = 1, limit = 12 } = req.query;
    const query = {};
    if (domain) query.domain = domain;
    if (type) query.type = type;
    if (status) query.status = status;

    const result = await paginate(CollabEvent, query, {
      page,
      limit,
      populate: 'host',
      sort: { scheduledAt: 1 },
    });

    return sendResponse(res, 200, true, result, 'Collaboration events retrieved');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/collaboration/events
 * @desc    Create a collaboration event
 * @access  Private (Academician, Industry, Institution)
 */
router.post('/events', protect, authorize('academician', 'industry', 'institution'), async (req, res, next) => {
  try {
    const event = await CollabEvent.create({
      ...req.body,
      host: req.user._id,
      organizationName: req.user.profile?.companyName || req.user.institution?.name || req.user.name,
    });

    return sendResponse(res, 201, true, event, 'Collaboration event created');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/collaboration/events/:id/register
 * @desc    Register for a collaboration event
 * @access  Private
 */
router.post('/events/:id/register', protect, async (req, res, next) => {
  try {
    const event = await CollabEvent.findById(req.params.id);
    if (!event) {
      return sendResponse(res, 404, false, null, 'Event not found');
    }

    const alreadyRegistered = event.registeredParticipants?.some(
      (p) => p.user?.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return sendResponse(res, 400, false, null, 'You are already registered for this event');
    }

    event.registeredParticipants.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      registeredAt: new Date(),
    });
    event.attendeesCount = event.registeredParticipants.length;
    await event.save();

    return sendResponse(res, 200, true, event, 'Successfully registered for event');
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   2. MENTORSHIP REQUESTS (Student / Faculty -> Industry Mentor)
   ========================================================================== */

/**
 * @route   GET /api/collaboration/mentorship
 * @desc    Get mentorship requests involving the logged-in user
 * @access  Private
 */
router.get('/mentorship', protect, async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({
      $or: [{ requester: req.user._id }, { mentor: req.user._id }],
    })
      .populate('requester', 'name email avatar role primaryDomain profile')
      .populate('mentor', 'name email avatar role primaryDomain profile')
      .sort({ updatedAt: -1 });

    return sendResponse(res, 200, true, requests, 'Mentorship requests retrieved');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/collaboration/mentorship
 * @desc    Submit a mentorship request
 * @access  Private
 */
router.post('/mentorship', protect, async (req, res, next) => {
  try {
    const { mentorId, domain, subField, topic, initialMessage } = req.body;

    const request = await MentorshipRequest.create({
      requester: req.user._id,
      requesterRole: req.user.role === 'academician' ? 'academician' : 'student',
      mentor: mentorId,
      domain: domain || req.user.primaryDomain,
      subField: subField || '',
      topic,
      initialMessage,
      status: 'pending',
      messages: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          senderRole: req.user.role,
          text: initialMessage,
          createdAt: new Date(),
        },
      ],
    });

    return sendResponse(res, 201, true, request, 'Mentorship request submitted');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PATCH /api/collaboration/mentorship/:id/status
 * @desc    Accept or decline mentorship request
 * @access  Private (Mentor)
 */
router.patch('/mentorship/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await MentorshipRequest.findOne({
      _id: req.params.id,
      mentor: req.user._id,
    });

    if (!request) {
      return sendResponse(res, 404, false, null, 'Mentorship request not found');
    }

    request.status = status;
    await request.save();

    return sendResponse(res, 200, true, request, `Mentorship request ${status}`);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/collaboration/mentorship/:id/messages
 * @desc    Send message in mentorship thread
 * @access  Private
 */
router.post('/mentorship/:id/messages', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    const request = await MentorshipRequest.findOne({
      _id: req.params.id,
      $or: [{ requester: req.user._id }, { mentor: req.user._id }],
    });

    if (!request) {
      return sendResponse(res, 404, false, null, 'Request not found');
    }

    request.messages.push({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text,
      createdAt: new Date(),
    });
    await request.save();

    return sendResponse(res, 201, true, request, 'Message sent successfully');
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   3. RESEARCH PROPOSALS (Academician -> Industry)
   ========================================================================== */

/**
 * @route   GET /api/collaboration/research-proposals
 * @desc    Get research proposals for user
 * @access  Private
 */
router.get('/research-proposals', protect, async (req, res, next) => {
  try {
    const proposals = await ResearchProposal.find({
      $or: [{ proposer: req.user._id }, { industryPartner: req.user._id }],
    })
      .populate('proposer', 'name email avatar profile')
      .populate('industryPartner', 'name email avatar profile')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, proposals, 'Research proposals retrieved');
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/collaboration/research-proposals
 * @desc    Submit research proposal
 * @access  Private (Academician)
 */
router.post('/research-proposals', protect, authorize('academician'), async (req, res, next) => {
  try {
    const proposal = await ResearchProposal.create({
      ...req.body,
      proposer: req.user._id,
      status: 'submitted',
    });

    return sendResponse(res, 201, true, proposal, 'Research partnership proposal submitted');
  } catch (err) {
    next(err);
  }
});

export default router;
