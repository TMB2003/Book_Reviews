import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  transformRequest: [(data, headers) => {
    // Ensure JSON body is stringified explicitly
    if (data && typeof data === 'object') {
      return JSON.stringify(data);
    }
    return data;
  }],
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Users
export const signup = (data) => api.post('/users/signup', data);
export const login = (data) => api.post('/users/login', data);
export const getMe = () => api.get('/users/me');

// Books
export const listBooks = (params) => api.get('/books', { params });
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.patch(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Reviews
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.patch(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
