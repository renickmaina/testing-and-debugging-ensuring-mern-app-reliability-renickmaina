//services/api.jsx
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bugService = {
  // Get all bugs
  getAllBugs: async () => {
    const response = await api.get('/bugs');
    // Ensure we always return an array
    return Array.isArray(response) ? response : [];
  },

  // Get bug by ID
  getBugById: async (id) => {
    const response = await api.get(`/bugs/${id}`);
    return response;
  },

  // Create new bug
  createBug: async (bugData) => {
    const response = await api.post('/bugs', bugData);
    return response;
  },

  // Update bug
  updateBug: async (id, bugData) => {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response;
  },

  // Delete bug
  deleteBug: async (id) => {
    const response = await api.delete(`/bugs/${id}`);
    return response;
  },
};

export default api;