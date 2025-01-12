// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api' // Ajustar según tu configuración
})

// Interceptores pueden añadirse para global error handling
export default api
