// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Asegúrate de que esta URL coincida con tu backend
});

// Añadir un interceptor para establecer 'Content-Type' solo para POST y PUT cuando no es FormData
api.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData;

    if ((config.method === 'post' || config.method === 'put') && !isFormData) {
      config.headers['Content-Type'] = 'application/json';
    } else if (!isFormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
