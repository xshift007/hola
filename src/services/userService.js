// src/services/userService.js
import api from './api'

export const registerUser = async (userData) => {
  const response = await api.post('/usuarios/registrar', userData)
  return response.data
}

export const getUserById = async (id) => {
  const response = await api.get(`/usuarios/${id}`)
  return response.data
}

export const getUserByName = async (name) => {
  const response = await api.get(`/usuarios/nombre/${name}`)
  return response.data
}

export const getAllUsers = async () => {
  const response = await api.get('/usuarios')
  return response.data
}
