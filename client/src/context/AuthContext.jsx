import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { mockUsers } from '../mock/mockData.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('skillsetu_token');
      const storedUser = localStorage.getItem('skillsetu_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to demo student on initial load for instant preview usability
        const defaultUser = mockUsers.student;
        const defaultToken = 'mock_default_student_token';
        setUser(defaultUser);
        setToken(defaultToken);
        localStorage.setItem('skillsetu_user', JSON.stringify(defaultUser));
        localStorage.setItem('skillsetu_token', defaultToken);
      }
    } catch (err) {
      console.error('Error initializing auth state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { user: loggedInUser, token: authToken } = response.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('skillsetu_user', JSON.stringify(loggedInUser));
      localStorage.setItem('skillsetu_token', authToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role) => {
    setLoading(true);
    try {
      const response = await authService.loginAsDemo(role);
      const { user: demoUser, token: demoToken } = response.data;
      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('skillsetu_user', JSON.stringify(demoUser));
      localStorage.setItem('skillsetu_token', demoToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      const { user: registeredUser, token: authToken } = response.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('skillsetu_user', JSON.stringify(registeredUser));
      localStorage.setItem('skillsetu_token', authToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillsetu_user');
    localStorage.removeItem('skillsetu_token');
  };

  const switchDemoRole = async (targetRole) => {
    await loginAsDemo(targetRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        token,
        isAuthenticated: !!user,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
