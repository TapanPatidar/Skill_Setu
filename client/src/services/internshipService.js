import api, { isMockMode } from './api.js';
import { mockInternship } from '../mock/mockData.js';

export const internshipService = {
  async getMyInternships() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: [mockInternship] };
    }

    try {
      return await api.get('/internships/mine');
    } catch (err) {
      return { success: true, data: [mockInternship] };
    }
  },

  async updateProgress(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      if (payload.weeklyLog) {
        mockInternship.weeklyLogs.push({
          weekNumber: mockInternship.weeklyLogs.length + 1,
          summary: payload.weeklyLog.summary,
          tasksCompleted: payload.weeklyLog.tasksCompleted || [],
          hoursLogged: payload.weeklyLog.hoursLogged || 40,
          mentorVerified: false,
          submittedAt: new Date().toISOString(),
        });
      }
      if (payload.milestoneUpdate) {
        const ms = mockInternship.milestones.find((m) => m._id === payload.milestoneUpdate.milestoneId);
        if (ms) {
          if (payload.milestoneUpdate.status) ms.status = payload.milestoneUpdate.status;
          if (payload.milestoneUpdate.deliverableUrl) ms.deliverableUrl = payload.milestoneUpdate.deliverableUrl;
        }
      }
      return { success: true, data: mockInternship, message: 'Internship progress updated successfully' };
    }

    return await api.patch('/internships/mine', payload);
  },

  async postFeedback(id, payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      mockInternship.mentorFeedback.push({
        author: 'Industry Mentor',
        role: 'Industry Mentor',
        rating: payload.rating || 5,
        remarks: payload.remarks || 'Great progress!',
        date: new Date().toISOString(),
      });
      return { success: true, data: mockInternship, message: 'Mentor feedback submitted successfully' };
    }

    return await api.post(`/internships/${id}/feedback`, payload);
  },

  async completeInternship(id, payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 350));
      mockInternship.status = 'completed';
      mockInternship.completion = {
        isCompleted: true,
        finalGrade: payload.finalGrade || 'Outstanding (A+)',
        certificateIssued: true,
        certificateUrl: 'https://skillsetu.in/certificates/verify/INT-NEXGEN-01',
        completionDate: new Date().toISOString(),
      };
      return { success: true, data: mockInternship, message: 'Internship completed and verified certificate issued!' };
    }

    return await api.post(`/internships/${id}/complete`, payload);
  },
};
