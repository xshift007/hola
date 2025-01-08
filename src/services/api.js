// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Asegúrate de que esta URL coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
