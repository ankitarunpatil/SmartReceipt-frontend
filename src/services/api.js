import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload receipt
export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get all receipts
export const getReceipts = async (category = null) => {
  const params = category ? { category } : {};
  const response = await api.get('/receipts', { params });
  return response.data;
};

// Get single receipt
export const getReceipt = async (id) => {
  const response = await api.get(`/receipts/${id}`);
  return response.data;
};

// Delete receipt
export const deleteReceipt = async (id) => {
  const response = await api.delete(`/receipts/${id}`);
  return response.data;
};

// Get analytics
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

// Get categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export default api;