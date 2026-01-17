import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log API URL for debugging (remove in production)
console.log('🔗 API Configuration:', {
  URL: API_URL,
  Environment: import.meta.env.MODE
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Better error messages
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.detail || 
                          error.response.data?.message || 
                          `Server error: ${error.response.status}`;
      error.message = errorMessage;
    } else if (error.request) {
      // Request made but no response
      error.message = 'Cannot connect to server. Please check if the backend is running.';
    }

    return Promise.reject(error);
  }
);

// Upload receipt
export const uploadReceipt = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📤 Uploading receipt:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for upload + AI processing
    });
    
    console.log('✅ Receipt uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
};

// Get all receipts
export const getReceipts = async (category = null) => {
  try {
    const params = category ? { category } : {};
    console.log('📤 Fetching receipts', category ? `(category: ${category})` : '(all)');
    
    const response = await api.get('/receipts', { params });
    
    console.log(`✅ Fetched ${response.data.length} receipts`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch receipts:', error.message);
    throw error;
  }
};

// Get single receipt
export const getReceipt = async (id) => {
  try {
    console.log(`📤 Fetching receipt #${id}`);
    
    const response = await api.get(`/receipts/${id}`);
    
    console.log(`✅ Fetched receipt #${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch receipt #${id}:`, error.message);
    throw error;
  }
};

// Delete receipt
export const deleteReceipt = async (id) => {
  try {
    console.log(`📤 Deleting receipt #${id}`);
    
    const response = await api.delete(`/receipts/${id}`);
    
    console.log(`✅ Deleted receipt #${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to delete receipt #${id}:`, error.message);
    throw error;
  }
};

// Get analytics
export const getAnalytics = async () => {
  try {
    console.log('📤 Fetching analytics');
    
    const response = await api.get('/analytics');
    
    console.log('✅ Analytics fetched:', {
      total_receipts: response.data.total_receipts,
      total_spent: response.data.total_spent,
      categories: Object.keys(response.data.by_category || {}).length
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch analytics:', error.message);
    throw error;
  }
};

// Get categories
export const getCategories = async () => {
  try {
    console.log('📤 Fetching categories');
    
    const response = await api.get('/categories');
    
    console.log('✅ Categories fetched:', response.data.categories);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error.message);
    throw error;
  }
};

// Health check (useful for debugging)
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    throw error;
  }
};

export default api;