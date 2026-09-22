import api, { isMockMode } from './api.js';
import { mockApplications } from '../mock/mockData.js';

export const applicationService = {
  async submitApplication(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 350));
      const newApp = {
        _id: `app_${Date.now()}`,
        ...payload,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: 'applied',
            changedAt: new Date().toISOString(),
            note: 'Application submitted with chosen resume',
          },
        ],
      };
      mockApplications.unshift(newApp);
      return { success: true, data: newApp, message: 'Application submitted successfully!' };
    }

    return await api.post('/applications', payload);
  },

  async getMyApplications() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockApplications };
    }

    try {
      return await api.get('/applications/mine');
    } catch (err) {
      return { success: true, data: mockApplications };
    }
  },

  async getOpportunityApplications(oppId) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockApplications };
    }

    return await api.get(`/applications/opportunity/${oppId}`);
  },

  async updateApplicationStatus(id, payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      const app = mockApplications.find((a) => a._id === id);
      if (app) {
        app.status = payload.status;
        app.statusHistory.push({
          status: payload.status,
          changedAt: new Date().toISOString(),
          note: payload.note || `Status updated to ${payload.status}`,
        });
        if (payload.interviewSchedule) {
          app.interviewSchedule = payload.interviewSchedule;
        }
      }
      return { success: true, data: app, message: `Status updated to ${payload.status}` };
    }

    return await api.patch(`/applications/${id}/status`, payload);
  },
};
