import api, { isMockMode } from './api.js';
import { mockStatsByRole } from '../mock/mockData.js';

export const dashboardService = {
  /**
   * Fetch dashboard stats for a given role
   * @param {'student' | 'academician' | 'industry' | 'institution'} role
   */
  async getStats(role = 'student') {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const stats = mockStatsByRole[role] || mockStatsByRole.student;
      return { success: true, data: stats, message: 'Stats loaded from mock store' };
    }

    try {
      return await api.get(`/dashboard/stats/${role}`);
    } catch (err) {
      console.warn('Live dashboard API unreachable, returning mock metrics:', err.message);
      const stats = mockStatsByRole[role] || mockStatsByRole.student;
      return { success: true, data: stats, message: 'Stats loaded (Fallback)' };
    }
  },
};
