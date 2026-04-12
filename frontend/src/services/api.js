import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
  retry: 2,
  retryDelay: 1200,
});

api.interceptors.request.use(
  (config) => {
    config.headers['X-Client-Time'] = new Date().toISOString();
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;
    await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 1000));
    return api(config);
  }
);

const getMetrics = () => api.get('/metrics');
const getPoolStatus = () => api.get('/pool-status');
const updateConfig = (payload) => api.put('/config', payload);
const getLogs = () => api.get('/logs');

export default {
  getMetrics,
  getPoolStatus,
  updateConfig,
  getLogs,
};
