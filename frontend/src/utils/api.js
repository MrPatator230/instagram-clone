import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ferrosocial_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ferrosocial_token');
      localStorage.removeItem('ferrosocial_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Posts API calls
export const postsAPI = {
  getFeed: (page = 1, limit = 10) => api.get(`/posts/feed?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  getUserPosts: (username, page = 1, limit = 12) => 
    api.get(`/posts/user/${username}?page=${page}&limit=${limit}`),
};

// Comments API calls
export const commentsAPI = {
  getComments: (postId, page = 1, limit = 20) => 
    api.get(`/comments/post/${postId}?page=${page}&limit=${limit}`),
  addComment: (postId, content) => api.post(`/comments/post/${postId}`, { content }),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

export default api;