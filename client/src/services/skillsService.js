import api, { isMockMode } from './api.js';
import { mockSkillProfile, mockUsers } from '../mock/mockData.js';

export const skillsService = {
  async getProfile() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          profile: mockSkillProfile,
          user: mockUsers.student,
        },
      };
    }

    try {
      return await api.get('/skills/profile');
    } catch (err) {
      return {
        success: true,
        data: {
          profile: mockSkillProfile,
          user: mockUsers.student,
        },
      };
    }
  },

  async getGaps() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          gaps: mockSkillProfile.skillGaps,
          targetRole: mockUsers.student.profile.targetRole,
          domain: mockUsers.student.primaryDomain,
          subField: mockUsers.student.subField,
        },
      };
    }

    try {
      return await api.get('/skills/gaps');
    } catch (err) {
      return {
        success: true,
        data: {
          gaps: mockSkillProfile.skillGaps,
          targetRole: mockUsers.student.profile.targetRole,
          domain: mockUsers.student.primaryDomain,
          subField: mockUsers.student.subField,
        },
      };
    }
  },

  async getRecommendations() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        success: true,
        data: {
          targetRoles: [
            {
              role: 'Full-Stack Software Engineer',
              domain: 'Engineering & Technology',
              subField: 'Computer Science & IT',
              matchPercentage: 94,
              missingSkills: [],
            },
            {
              role: 'Cloud DevOps Solutions Architect',
              domain: 'Engineering & Technology',
              subField: 'Computer Science & IT',
              matchPercentage: 86,
              missingSkills: ['Kubernetes', 'Terraform'],
            },
            {
              role: 'Fintech Full-Stack Systems Specialist (Adjacent Opportunity)',
              domain: 'Commerce & Finance',
              subField: 'Banking & Fintech',
              matchPercentage: 79,
              missingSkills: ['Fintech APIs & Payments'],
              isAdjacent: true,
            },
            {
              role: 'Health Informatics Systems Engineer (Adjacent Opportunity)',
              domain: 'Healthcare & Ayush',
              subField: 'Health Informatics & Digital Health',
              matchPercentage: 74,
              missingSkills: ['ABDM Standards', 'DICOM/HL7'],
              isAdjacent: true,
            },
          ],
          careerPath: {
            currentLevel: 'Year 3 Scholar',
            targetRole: 'Full-Stack Software Engineer',
            milestones: [
              { step: 1, title: 'Foundational Diagnostics & Skill Mapping', status: 'completed' },
              { step: 2, title: 'Close Priority Skill Gaps (Critical Level: gRPC)', status: 'in-progress' },
              { step: 3, title: 'Industry-Accredited Micro-Credential Enrollment', status: 'in-progress' },
              { step: 4, title: 'Corporate Cloud Engineering Internship', status: 'in-progress' },
              { step: 5, title: 'Final Placement & Verifiable Portfolio Audit', status: 'upcoming' },
            ],
          },
        },
      };
    }

    try {
      return await api.get('/skills/recommendations');
    } catch (err) {
      return skillsService.getRecommendations();
    }
  },
};
