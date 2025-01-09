// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Añadir un interceptor para establecer 'Content-Type' solo para POST y PUT
api.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'put') {
    config.headers['Content-Type'] = 'application/json';
  } else {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
