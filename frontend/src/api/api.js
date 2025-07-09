import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Contact API methods
export const contactAPI = {
  // Get all contacts
  getAll: () => api.get('/contacts'),
  
  // Search contacts with filters
  search: (params = {}) => {
    const { q = '', sort_by = 'contact_name', sort_order = 'asc' } = params;
    return api.get('/contacts/search', {
      params: { q, sort_by, sort_order }
    });
  },
  
  // Get single contact
  getById: (id) => api.get(`/contacts/${id}`),
  
  // Create contact
  create: (data) => api.post('/contacts', data),
  
  // Update contact
  update: (id, data) => api.put(`/contacts/${id}`, data),
  
  // Delete contact
  delete: (id) => api.delete(`/contacts/${id}`)
};

// Auth API methods
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData)
};

export default api;
