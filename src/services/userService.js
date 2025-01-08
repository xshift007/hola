// src/services/loanService.js
import api from './api';

// Simular préstamo
const simulateLoan = (simulationData) => {
  return api.post('/solicitudes/simular', simulationData);
};

// Crear solicitud de crédito
const createLoanApplication = (formData) => {
  return api.post('/solicitudes/crear-con-usuario', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener todas las solicitudes (para evaluación)
const getAllSolicitudes = () => {
  return api.get('/solicitudes');
};

// Evaluar una solicitud
const evaluateLoan = (idSolicitud) => {
  return api.put(`/solicitudes/${idSolicitud}/evaluar`);
};

// Obtener solicitudes por nombre de usuario (para seguimiento)
const getSolicitudesByUser = (nombreCompleto) => {
  return api.get(`/solicitudes/usuario/nombre/${nombreCompleto}`);
};

// Eliminar una solicitud
const deleteLoan = (idSolicitud) => {
  return api.delete(`/solicitudes/${idSolicitud}`);
};

export default {
  simulateLoan,
  createLoanApplication,
  getAllSolicitudes,
  evaluateLoan,
  getSolicitudesByUser,
  deleteLoan,
};
