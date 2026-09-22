import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Check if mock mode is explicitly requested or defaulted
export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillsetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration or 401s gracefully
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillsetu_token');
      localStorage.removeItem('skillsetu_user');
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export default api;
