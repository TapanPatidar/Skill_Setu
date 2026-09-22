import api, { isMockMode } from './api.js';
import { mockOpportunities, mockCandidates } from '../mock/mockData.js';

export const opportunityService = {
  async getOpportunities(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      let filtered = [...mockOpportunities];

      if (params.domain) {
        filtered = filtered.filter((o) => o.domain === params.domain);
      }
      if (params.type) {
        filtered = filtered.filter((o) => o.type === params.type);
      }
      if (params.workMode) {
        filtered = filtered.filter((o) => o.workMode === params.workMode);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o.title.toLowerCase().includes(q) ||
            o.companyName.toLowerCase().includes(q) ||
            o.requiredSkills.some((s) => s.toLowerCase().includes(q))
        );
      }

      return {
        success: true,
        data: {
          opportunities: filtered,
          pagination: { total: filtered.length, page: 1, pages: 1, limit: 12 },
        },
      };
    }

    try {
      const res = await api.get('/opportunities', { params });
      return res;
    } catch (err) {
      return {
        success: true,
        data: {
          opportunities: mockOpportunities,
          pagination: { total: mockOpportunities.length, page: 1, pages: 1, limit: 12 },
        },
      };
    }
  },

  async getOpportunityById(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      const opp = mockOpportunities.find((o) => o._id === id) || mockOpportunities[0];
      return { success: true, data: opp };
    }

    try {
      return await api.get(`/opportunities/${id}`);
    } catch (err) {
      const opp = mockOpportunities.find((o) => o._id === id) || mockOpportunities[0];
      return { success: true, data: opp };
    }
  },

  async createOpportunity(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      const newOpp = {
        _id: `opp_${Date.now()}`,
        ...payload,
        matchScore: 88,
        matchedSkills: payload.requiredSkills?.slice(0, 3) || [],
        missingSkills: payload.requiredSkills?.slice(3) || [],
        applicantsCount: 0,
        status: 'open',
      };
      mockOpportunities.unshift(newOpp);
      return { success: true, data: newOpp, message: 'Opportunity posted successfully' };
    }

    return await api.post('/opportunities', payload);
  },

  async updateOpportunity(id, payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const idx = mockOpportunities.findIndex((o) => o._id === id);
      if (idx !== -1) {
        mockOpportunities[idx] = { ...mockOpportunities[idx], ...payload };
      }
      return { success: true, data: mockOpportunities[idx] };
    }

    return await api.patch(`/opportunities/${id}`, payload);
  },

  async getMyOpportunities() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: mockOpportunities.slice(0, 3) };
    }

    return await api.get('/opportunities/mine');
  },

  async getCandidates(opportunityId) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      const opp = mockOpportunities.find((o) => o._id === opportunityId) || mockOpportunities[0];
      return {
        success: true,
        data: {
          opportunity: opp,
          candidates: mockCandidates,
        },
      };
    }

    try {
      return await api.get(`/opportunities/${opportunityId}/candidates`);
    } catch (err) {
      return {
        success: true,
        data: {
          opportunity: mockOpportunities[0],
          candidates: mockCandidates,
        },
      };
    }
  },
};
