import api, { isMockMode } from './api.js';
import { mockNotifications } from '../mock/mockData.js';

export const notificationService = {
  async getNotifications() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockNotifications };
    }

    try {
      return await api.get('/notifications');
    } catch (err) {
      return { success: true, data: mockNotifications };
    }
  },

  async markRead(id) {
    if (isMockMode) {
      const n = mockNotifications.find((item) => item._id === id);
      if (n) n.read = true;
      return { success: true };
    }

    return await api.patch(`/notifications/${id}/read`);
  },

  async markAllRead() {
    if (isMockMode) {
      mockNotifications.forEach((n) => (n.read = true));
      return { success: true };
    }

    return await api.patch('/notifications/read-all');
  },
};
