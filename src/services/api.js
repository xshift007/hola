// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api' // Ajustar según tu configuración
})

// Podrías añadir interceptores para manejar errores globalmente
export default api
