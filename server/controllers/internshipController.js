import { InternshipRecord } from '../models/InternshipRecord.js';
import { Notification } from '../models/Notification.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc Get current student's or industry mentor's internships
 * @route GET /api/internships/mine
 * @access Private
 */
export const getMyInternships = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query = { student: req.user._id };
    } else if (req.user.role === 'industry') {
      query = { industryMentor: req.user._id };
    } else {
      query = {};
    }

    const internships = await InternshipRecord.find(query)
      .populate('opportunity')
      .populate('student', 'name email avatar profile primaryDomain subField')
      .populate('industryMentor', 'name email profile')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, internships, 'Internship records retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update internship milestones or append weekly log
 * @route PATCH /api/internships/mine
 * @access Private (Student)
 */
export const updateInternshipProgress = async (req, res, next) => {
  try {
    const { internshipId, weeklyLog, milestoneUpdate } = req.body;
    const internship = await InternshipRecord.findById(internshipId);

    if (!internship) return sendResponse(res, 404, false, null, 'Internship record not found');

    if (weeklyLog) {
      internship.weeklyLogs.push({
        weekNumber: weeklyLog.weekNumber || internship.weeklyLogs.length + 1,
        summary: weeklyLog.summary,
        tasksCompleted: weeklyLog.tasksCompleted || [],
        hoursLogged: weeklyLog.hoursLogged || 40,
        submittedAt: new Date(),
        mentorVerified: false,
      });
    }

    if (milestoneUpdate && milestoneUpdate.milestoneId) {
      const ms = internship.milestones.id(milestoneUpdate.milestoneId);
      if (ms) {
        if (milestoneUpdate.status) ms.status = milestoneUpdate.status;
        if (milestoneUpdate.deliverableUrl) ms.deliverableUrl = milestoneUpdate.deliverableUrl;
        if (milestoneUpdate.status === 'completed') ms.completedDate = new Date();
      }
    }

    await internship.save();

    // Notify industry mentor
    if (internship.industryMentor) {
      await Notification.create({
        recipient: internship.industryMentor,
        title: 'Intern Weekly Log Submitted',
        message: `${req.user.name} submitted Week ${weeklyLog?.weekNumber || ''} progress log.`,
        type: 'system',
        link: `/dashboard/internship-management?id=${internship._id}`,
      });
    }

    return sendResponse(res, 200, true, internship, 'Internship progress updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Industry Mentor posts feedback & rating on intern progress
 * @route POST /api/internships/:id/feedback
 * @access Private (Industry)
 */
export const postMentorFeedback = async (req, res, next) => {
  try {
    const { rating, remarks } = req.body;
    const internship = await InternshipRecord.findById(req.params.id);

    if (!internship) return sendResponse(res, 404, false, null, 'Internship record not found');

    internship.mentorFeedback.push({
      author: req.user._id,
      role: 'Industry Mentor',
      rating: rating || 5,
      remarks: remarks || '',
      date: new Date(),
    });

    await internship.save();

    // Notify student
    await Notification.create({
      recipient: internship.student,
      title: 'Mentor Feedback Received',
      message: `Your industry mentor shared performance remarks: "${remarks.slice(0, 60)}..."`,
      type: 'system',
      link: '/dashboard/my-internship',
    });

    return sendResponse(res, 200, true, internship, 'Mentor feedback posted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Finalize & sign-off completion of internship
 * @route POST /api/internships/:id/complete
 * @access Private (Industry)
 */
export const completeInternship = async (req, res, next) => {
  try {
    const { finalGrade, certificateUrl } = req.body;
    const internship = await InternshipRecord.findById(req.params.id);

    if (!internship) return sendResponse(res, 404, false, null, 'Internship record not found');

    internship.completion = {
      isCompleted: true,
      finalGrade: finalGrade || 'Outstanding (A+)',
      certificateIssued: true,
      certificateUrl: certificateUrl || `https://skillsetu.in/certificates/verify/INT-${internship._id.toString().slice(-6).toUpperCase()}`,
      completionDate: new Date(),
    };

    await internship.save();

    await Notification.create({
      recipient: internship.student,
      title: '🎓 Internship Completed & Certified!',
      message: `Congratulations! Your internship has been marked completed with grade: ${finalGrade || 'A+'}. Your verified digital credential is now ready.`,
      type: 'approval',
      link: '/dashboard/my-internship',
    });

    return sendResponse(res, 200, true, internship, 'Internship completion recorded and certificate issued');
  } catch (error) {
    next(error);
  }
};
