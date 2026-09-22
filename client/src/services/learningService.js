import api, { isMockMode } from './api.js';
import { mockLearningPrograms } from '../mock/mockData.js';

export const learningService = {
  async getPrograms(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      let filtered = [...mockLearningPrograms];
      if (params.domain) {
        filtered = filtered.filter((p) => p.domain === params.domain);
      }
      return { success: true, data: filtered };
    }

    try {
      return await api.get('/learning', { params });
    } catch (err) {
      return { success: true, data: mockLearningPrograms };
    }
  },

  async createProgram(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      const newProg = {
        _id: `prog_${Date.now()}`,
        ...payload,
        enrolledCount: 0,
        isEnrolled: false,
        progress: 0,
      };
      mockLearningPrograms.unshift(newProg);
      return { success: true, data: newProg, message: 'Learning program published successfully' };
    }

    return await api.post('/learning', payload);
  },

  async enroll(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      const prog = mockLearningPrograms.find((p) => p._id === id);
      if (prog) {
        prog.isEnrolled = true;
        prog.progress = 10;
        prog.enrolledCount = (prog.enrolledCount || 0) + 1;
      }
      return { success: true, data: prog, message: 'Enrolled in learning track successfully' };
    }

    return await api.post(`/learning/${id}/enroll`);
  },

  async updateProgress(id, progressPercent) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const prog = mockLearningPrograms.find((p) => p._id === id);
      if (prog) {
        prog.progress = progressPercent;
      }
      return { success: true, data: prog };
    }

    return await api.patch(`/learning/${id}/progress`, { progressPercent });
  },
};
