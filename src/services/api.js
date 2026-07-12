import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulsemeter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pulsemeter_token');
      localStorage.removeItem('pulsemeter_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

// Dashboard API
export const dashboardAPI = {
  getKpiData: () => api.get('/dashboard/kpi'),
  getConsumptionData: () => api.get('/dashboard/consumption'),
  getCategoryData: () => api.get('/dashboard/categories'),
  getEnergyFlowData: () => api.get('/dashboard/energy-flow'),
  getAlerts: () => api.get('/dashboard/alerts'),
};

export default api;
