import { Application } from '../models/Application.js';
import { Opportunity } from '../models/Opportunity.js';
import { Notification } from '../models/Notification.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Submit new application for an opportunity
 * @route POST /api/applications
 * @access Private (Student)
 */
export const submitApplication = async (req, res, next) => {
  try {
    const { opportunityId, resumeDocument, resumeUrl, coverLetter } = req.body;
    const studentId = req.user._id;

    const opp = await Opportunity.findById(opportunityId);
    if (!opp) return sendResponse(res, 404, false, null, 'Opportunity not found');

    const existing = await Application.findOne({ student: studentId, opportunity: opportunityId });
    if (existing) {
      return sendResponse(res, 400, false, null, 'You have already applied to this opportunity');
    }

    const application = await Application.create({
      student: studentId,
      opportunity: opportunityId,
      resumeDocument: resumeDocument || null,
      resumeUrl: resumeUrl || '',
      coverLetter: coverLetter || '',
      status: 'applied',
      statusHistory: [
        {
          status: 'applied',
          changedAt: new Date(),
          note: 'Application submitted successfully',
          updatedBy: studentId,
        },
      ],
    });

    // Increment applicantsCount on Opportunity
    opp.applicantsCount = (opp.applicantsCount || 0) + 1;
    await opp.save();

    // Create Notification for Opportunity owner
    await Notification.create({
      recipient: opp.company,
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${opp.title}"`,
      type: 'application',
      link: `/dashboard/pipeline?oppId=${opp._id}`,
    });

    return sendResponse(res, 201, true, application, 'Application submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get student's own applications
 * @route GET /api/applications/mine
 * @access Private (Student)
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('opportunity')
      .populate('resumeDocument')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, applications, 'Your applications retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get applications for an opportunity (Industry)
 * @route GET /api/applications/opportunity/:id
 * @access Private (Industry)
 */
export const getOpportunityApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ opportunity: req.params.id })
      .populate('student', 'name email avatar skills primaryDomain subField profile year')
      .populate('resumeDocument')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, applications, 'Opportunity applications retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update application status (shortlisted, interview, offered, rejected)
 * @route PATCH /api/applications/:id/status
 * @access Private (Industry)
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, interviewSchedule } = req.body;
    const application = await Application.findById(req.params.id).populate('opportunity');

    if (!application) return sendResponse(res, 404, false, null, 'Application not found');

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    if (interviewSchedule) {
      application.interviewSchedule = interviewSchedule;
    }

    await application.save();

    // Create Notification for the student
    await Notification.create({
      recipient: application.student,
      title: `Application Update: ${application.opportunity?.title || 'Opportunity'}`,
      message: `Your application status has been updated to "${status.toUpperCase()}". ${note || ''}`,
      type: 'application',
      link: '/dashboard/applications',
    });

    return sendResponse(res, 200, true, application, `Application status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
