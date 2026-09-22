import { Opportunity } from '../models/Opportunity.js';
import { Application } from '../models/Application.js';
import { LearningProgram } from '../models/LearningProgram.js';
import { FacultyOpportunity } from '../models/FacultyOpportunity.js';
import { CollabEvent } from '../models/CollabEvent.js';
import { User } from '../models/User.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc    Get dashboard metrics by role
 * @route   GET /api/dashboard/stats/:role
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const role = req.params.role || (req.user ? req.user.role : 'student');
    let stats = {};

    switch (role) {
      case 'student':
        stats = {
          role: 'student',
          totalApplied: 6,
          skillReadiness: 88,
          activeInternships: 1,
          verifiedSkills: 14,
          statCards: [
            { label: 'Skill Readiness', value: '88%', change: '+12% this month', trend: 'up' },
            { label: 'Active Applications', value: '6', change: '2 in interview stage', trend: 'neutral' },
            { label: 'Verified Competencies', value: '14', change: '4 Ayush & 10 Tech', trend: 'up' },
            { label: 'Learning Credits', value: '42 hrs', change: '2 certs completed', trend: 'up' },
          ],
        };
        break;

      case 'academician':
        stats = {
          role: 'academician',
          mentoredStudents: 28,
          activeFDPs: 2,
          researchProposals: 4,
          industryCollaborations: 5,
          statCards: [
            { label: 'Mentored Students', value: '28', change: '8 placed this term', trend: 'up' },
            { label: 'Active FDPs & Training', value: '2', change: '1 in pharmacognosy', trend: 'neutral' },
            { label: 'Research Proposals', value: '4', change: '2 industry sponsored', trend: 'up' },
            { label: 'Skill Endorsements', value: '37', change: 'Validated credentials', trend: 'up' },
          ],
        };
        break;

      case 'industry':
        stats = {
          role: 'industry',
          activeListings: 5,
          totalCandidates: 142,
          shortlistedCandidates: 18,
          internshipsConducted: 12,
          statCards: [
            { label: 'Active Listings', value: '5', change: '3 internships, 2 jobs', trend: 'neutral' },
            { label: 'Applicant Pipeline', value: '142', change: 'Top match 94%', trend: 'up' },
            { label: 'Shortlisted for Interview', value: '18', change: 'Round 2 scheduled', trend: 'up' },
            { label: 'Faculty Joint Projects', value: '3', change: 'AIIA lab collaboration', trend: 'up' },
          ],
        };
        break;

      case 'institution':
      default:
        stats = {
          role: 'institution',
          placementRate: 91.4,
          totalStudentsEnrolled: 840,
          partnerCompanies: 46,
          activeMoUs: 18,
          statCards: [
            { label: 'Placement & Internship Rate', value: '91.4%', change: '+6.2% vs last year', trend: 'up' },
            { label: 'Enrolled Students', value: '840', change: 'AIIA & partner colleges', trend: 'up' },
            { label: 'Industry Partners', value: '46', change: '12 added this semester', trend: 'up' },
            { label: 'Active MoUs & Collabs', value: '18', change: 'MoA Smart Automation', trend: 'up' },
          ],
        };
        break;
    }

    return sendResponse(res, 200, true, stats, 'Dashboard metrics loaded');
  } catch (error) {
    next(error);
  }
};
