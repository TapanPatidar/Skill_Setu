import api, { isMockMode } from './api.js';
import { mockPortfolioItems, mockUsers } from '../mock/mockData.js';

export const portfolioService = {
  async getMyPortfolio() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockPortfolioItems };
    }

    try {
      return await api.get('/portfolio');
    } catch (err) {
      return { success: true, data: mockPortfolioItems };
    }
  },

  async getPublicPortfolio(userId) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        success: true,
        data: {
          user: mockUsers.student,
          items: mockPortfolioItems,
        },
      };
    }

    try {
      return await api.get(`/portfolio/${userId}/public`);
    } catch (err) {
      return {
        success: true,
        data: {
          user: mockUsers.student,
          items: mockPortfolioItems,
        },
      };
    }
  },

  async addPortfolioItem(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      const newItem = {
        _id: `port_${Date.now()}`,
        ...payload,
        verified: false,
        createdAt: new Date().toISOString(),
      };
      mockPortfolioItems.unshift(newItem);
      return { success: true, data: newItem, message: 'Portfolio item added successfully' };
    }

    return await api.post('/portfolio', payload);
  },

  async deletePortfolioItem(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const idx = mockPortfolioItems.findIndex((p) => p._id === id);
      if (idx !== -1) mockPortfolioItems.splice(idx, 1);
      return { success: true, message: 'Item deleted' };
    }

    return await api.delete(`/portfolio/${id}`);
  },

  async verifyPortfolioItem(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      const item = mockPortfolioItems.find((p) => p._id === id);
      if (item) {
        item.verified = true;
        item.verifiedRole = 'industry';
        item.verifiedBy = { name: 'Vikramaditya Singhania' };
        item.verifiedAt = new Date().toISOString();
      }
      return { success: true, data: item, message: 'Portfolio item verified successfully' };
    }

    return await api.patch(`/portfolio/${id}/verify`);
  },
};
