import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productAPI = {
  getAll: async () => (await api.get('/admin/products')).data,
  getById: async (id) => (await api.get(`/admin/products/${id}`)).data,
  create: async (data) => (await api.post('/admin/products', data)).data,
  update: async (id, data) => (await api.put(`/admin/products/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/admin/products/${id}`)).data,
};

export const productVariantAPI = {
  getByProduct: async (productId) => (await api.get(`/admin/products/${productId}/variants`)).data,
  create: async (productId, data) => (await api.post(`/admin/products/${productId}/variants`, data)).data,
  update: async (variantId, data) => (await api.put(`/admin/products/variants/${variantId}`, data)).data,
  delete: async (variantId) => (await api.delete(`/admin/products/variants/${variantId}`)).data,
};

export const categoryAPI = {
  getAll: async () => (await api.get('/admin/categories')).data,
  create: async (data) => (await api.post('/admin/categories', data)).data,
  update: async (id, data) => (await api.put(`/admin/categories/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/admin/categories/${id}`)).data,
};

export const orderAPI = {
  getAll: async () => (await api.get('/admin/orders')).data,
  getById: async (id) => (await api.get(`/admin/orders/${id}`)).data,
  updateStatus: async (id, status) => (await api.put(`/admin/orders/${id}/status`, { status })).data,
  delete: async (id) => (await api.delete(`/admin/orders/${id}`)).data,
};

export const userAPI = {
  getAll: async () => (await api.get('/admin/users')).data,
  getById: async (id) => (await api.get(`/admin/users/${id}`)).data,
  update: async (id, data) => (await api.put(`/admin/users/${id}`, data)).data,
  toggleLock: async (id) => (await api.put(`/admin/users/${id}/lock`)).data,
  delete: async (id) => (await api.delete(`/admin/users/${id}`)).data,
};

export const statsAPI = {
  getDashboard: async () => (await api.get('/admin/stats')).data,
  getReport: async () => (await api.get('/admin/stats/report')).data,
};

export const notificationAPI = {
  // User endpoints
  getAll: async () => (await api.get('/user/notifications')).data,
  getUnreadCount: async () => (await api.get('/user/notifications/unread-count')).data,
  markAsRead: async (id) => (await api.put(`/user/notifications/${id}/read`)).data,
  markAllAsRead: async () => (await api.put('/user/notifications/read-all')).data,
  // Admin endpoints
  sendPromo: async (title, content) => (await api.post('/admin/notifications/promo', { title, content })).data,
  sendSystem: async (title, content) => (await api.post('/admin/notifications/system', { title, content })).data,
  getAllAdmin: async () => (await api.get('/admin/notifications')).data,
};

export default api;
