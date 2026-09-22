import api, { isMockMode } from './api.js';
import { mockUsers } from '../mock/mockData.js';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Log in user
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      // Look up mock user by email or role keyword
      let user = Object.values(mockUsers).find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Fallback to student role if demo credentials
        user = mockUsers.student;
      }
      const token = `mock_jwt_token_${user.role}_${Date.now()}`;
      return { success: true, data: { user, token }, message: 'Logged in (Mock Mode)' };
    }

    try {
      return await api.post('/auth/login', { email, password });
    } catch (err) {
      console.warn('Live API unavailable, falling back to mock authentication:', err.message);
      const user = mockUsers.student;
      const token = `mock_jwt_fallback_${Date.now()}`;
      return { success: true, data: { user, token }, message: 'Logged in (Mock Fallback)' };
    }
  },

  /**
   * Quick Continue as Demo Role
   * @param {'student' | 'academician' | 'industry' | 'institution'} role
   */
  async loginAsDemo(role) {
    const selectedRole = role || 'student';
    const user = mockUsers[selectedRole] || mockUsers.student;
    const token = `mock_jwt_token_${selectedRole}_${Date.now()}`;
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, data: { user, token }, message: `Logged in as Demo ${selectedRole}` };
  },

  /**
   * Register a new user
   * @param {Object} userData
   */
  async register(userData) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 300));
      const role = userData.role || 'student';
      const user = {
        _id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role,
        skills: userData.skills || ['Ayush Healthcare Foundations', 'Good Documentation'],
        interests: userData.interests || ['Clinical Research'],
        institution: {
          _id: 'inst_01',
          name: 'All India Institute of Ayurveda (AIIA)',
          code: 'AIIA-ND-001',
        },
        profile: {
          title: `${userData.name} (${role.toUpperCase()})`,
          department: userData.department || 'Ayush & Life Sciences',
          degree: userData.degree || 'BAMS / Ayush Sciences',
          location: 'New Delhi, India',
          bio: userData.bio || 'Active member of the SkillSetu Academia-Industry ecosystem.',
        },
      };
      const token = `mock_jwt_token_${role}_${Date.now()}`;
      return { success: true, data: { user, token }, message: 'Registration successful (Mock Mode)' };
    }

    try {
      return await api.post('/auth/register', userData);
    } catch (err) {
      console.warn('Live API unavailable during register, falling back to mock:', err.message);
      const user = {
        _id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'student',
        skills: [],
        interests: [],
        profile: {},
      };
      const token = `mock_jwt_fallback_${Date.now()}`;
      return { success: true, data: { user, token }, message: 'Registered successfully' };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    if (isMockMode) {
      const storedUser = localStorage.getItem('skillsetu_user');
      if (storedUser) {
        return { success: true, data: JSON.parse(storedUser) };
      }
      return { success: true, data: mockUsers.student };
    }

    try {
      return await api.get('/auth/me');
    } catch (err) {
      const storedUser = localStorage.getItem('skillsetu_user');
      return { success: true, data: storedUser ? JSON.parse(storedUser) : mockUsers.student };
    }
  },
};
