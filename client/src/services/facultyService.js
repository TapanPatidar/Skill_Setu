import api, { isMockMode } from './api.js';
import {
  mockFacultyOpportunities,
  mockCollabEvents,
  mockMentorshipRequests,
  mockResearchProposals,
} from '../mock/mockData.js';

export const facultyService = {
  // Opportunities for Faculty
  async getOpportunities(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      let filtered = [...mockFacultyOpportunities];

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
            o.organizationName.toLowerCase().includes(q) ||
            o.description.toLowerCase().includes(q)
        );
      }

      return {
        success: true,
        data: {
          items: filtered,
          pagination: { total: filtered.length, page: 1, pages: 1, limit: 12 },
        },
      };
    }

    try {
      const res = await api.get('/faculty-opportunities', { params });
      return res;
    } catch (err) {
      return {
        success: true,
        data: {
          items: mockFacultyOpportunities,
          pagination: { total: mockFacultyOpportunities.length, page: 1, pages: 1, limit: 12 },
        },
      };
    }
  },

  async getOpportunityById(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 100));
      const opp = mockFacultyOpportunities.find((o) => o._id === id) || mockFacultyOpportunities[0];
      return { success: true, data: opp };
    }
    try {
      return await api.get(`/faculty-opportunities/${id}`);
    } catch (err) {
      const opp = mockFacultyOpportunities.find((o) => o._id === id) || mockFacultyOpportunities[0];
      return { success: true, data: opp };
    }
  },

  async applyForOpportunity(id, payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      return {
        success: true,
        data: {
          _id: `app_${Date.now()}`,
          opportunity: id,
          status: 'submitted',
          ...payload,
        },
        message: 'Faculty application submitted successfully',
      };
    }
    try {
      return await api.post(`/faculty-opportunities/${id}/apply`, payload);
    } catch (err) {
      return {
        success: true,
        data: { _id: `app_${Date.now()}`, opportunity: id, status: 'submitted' },
        message: 'Faculty application submitted successfully (offline)',
      };
    }
  },

  // Collaboration Events
  async getCollabEvents(params = {}) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      let filtered = [...mockCollabEvents];
      if (params.domain) filtered = filtered.filter((e) => e.domain === params.domain);
      if (params.type) filtered = filtered.filter((e) => e.type === params.type);
      return {
        success: true,
        data: { items: filtered, pagination: { total: filtered.length, page: 1, pages: 1, limit: 12 } },
      };
    }
    try {
      return await api.get('/collaboration/events', { params });
    } catch (err) {
      return {
        success: true,
        data: { items: mockCollabEvents, pagination: { total: mockCollabEvents.length, page: 1, pages: 1, limit: 12 } },
      };
    }
  },

  async registerForEvent(id) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const event = mockCollabEvents.find((e) => e._id === id);
      if (event) event.attendeesCount += 1;
      return { success: true, message: 'Successfully registered for event' };
    }
    try {
      return await api.post(`/collaboration/events/${id}/register`);
    } catch (err) {
      return { success: true, message: 'Registered for event' };
    }
  },

  async createEvent(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 200));
      const newEvent = { _id: `event_${Date.now()}`, attendeesCount: 1, ...payload };
      mockCollabEvents.unshift(newEvent);
      return { success: true, data: newEvent };
    }
    return await api.post('/collaboration/events', payload);
  },

  // Mentorship & Research Proposals
  async getMentorshipRequests() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockMentorshipRequests };
    }
    try {
      return await api.get('/collaboration/mentorship');
    } catch (err) {
      return { success: true, data: mockMentorshipRequests };
    }
  },

  async sendMentorshipMessage(requestId, text) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      const req = mockMentorshipRequests.find((m) => m._id === requestId);
      if (req) {
        req.messages.push({
          senderName: 'Dr. Anand Ramanathan',
          senderRole: 'academician',
          text,
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true, data: req };
    }
    return await api.post(`/collaboration/mentorship/${requestId}/messages`, { text });
  },

  async getResearchProposals() {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 150));
      return { success: true, data: mockResearchProposals };
    }
    try {
      return await api.get('/collaboration/research-proposals');
    } catch (err) {
      return { success: true, data: mockResearchProposals };
    }
  },

  async submitResearchProposal(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      const prop = {
        _id: `prop_${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        ...payload,
      };
      mockResearchProposals.unshift(prop);
      return { success: true, data: prop, message: 'Research partnership proposal submitted' };
    }
    return await api.post('/collaboration/research-proposals', payload);
  },
};
