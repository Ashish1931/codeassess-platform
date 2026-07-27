import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://codeassess-platform-1.onrender.com/api/v1' : '/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
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

// Response Interceptor: Handle Unauthorized 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      if (!window.location.pathname.startsWith('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  googleLogin: (data) => api.post('/auth/google', data),
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getDashboardStats: () => api.get('/users/dashboard'),
};

// Subject Services
export const subjectService = {
  getAllSubjects: () => api.get('/subjects'),
  getSubjectById: (id) => api.get(`/subjects/${id}`),
  createSubject: (data) => api.post('/subjects', data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// Test Services
export const testService = {
  getAllTests: () => api.get('/tests'),
  getTestsBySubject: (subjectId) => api.get(`/tests/subject/${subjectId}`),
  getTestById: (id) => api.get(`/tests/${id}`),
  createTest: (data) => api.post('/tests', data),
  updateTest: (id, data) => api.put(`/tests/${id}`, data),
  updateTestStatus: (id, status) => api.patch(`/tests/${id}/status?status=${status}`),
  deleteTest: (id) => api.delete(`/tests/${id}`),
};

// Question Services
export const questionService = {
  getQuestionsByTest: (testId) => api.get(`/questions/test/${testId}`),
  getQuestionById: (id) => api.get(`/questions/${id}`),
  createQuestion: (data) => api.post('/questions', data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
  toggleBookmark: (id) => api.post(`/questions/${id}/bookmark`),
  getBookmarks: () => api.get('/questions/bookmarks'),
};

// Exam Services
export const examService = {
  startExam: (testId) => api.post(`/exams/start/${testId}`),
  submitExam: (data) => api.post('/exams/submit', data),
  getResultByAttemptId: (attemptId) => api.get(`/exams/result/${attemptId}`),
};

// Leaderboard Services
export const leaderboardService = {
  getGlobalLeaderboard: () => api.get('/leaderboard/global'),
  getTestLeaderboard: (testId) => api.get(`/leaderboard/test/${testId}`),
};

// Admin Services
export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllStudents: () => api.get('/admin/students'),
};

export default api;
