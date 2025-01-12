// src/services/loanService.js
import api from './api'

// Crear solicitud con archivos
export const createLoanApplication = async (formData) => {
  const response = await api.post('/solicitudes/crear-con-usuario', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const getAllLoans = async () => {
  const response = await api.get('/solicitudes')
  return response.data
}

export const getLoanById = async (id) => {
  const response = await api.get(`/solicitudes/${id}`)
  return response.data
}

export const getLoansByUserName = async (userName) => {
  const response = await api.get(`/solicitudes/usuario/nombre/${userName}`)
  return response.data
}

export const evaluateLoan = async (id) => {
  const response = await api.put(`/solicitudes/${id}/evaluar`)
  return response.data 
}

export const changeLoanStatus = async (id, newStatus) => {
  const response = await api.put(`/solicitudes/${id}/cambiar-estado?nuevoEstado=${newStatus}`)
  return response.data
}

export const simulateLoan = async (simulationData) => {
  const response = await api.post('/solicitudes/simular', simulationData)
  return response.data
}
