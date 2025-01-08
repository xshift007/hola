import api from './api';

// Simular préstamo (P1)
const simulateLoan = (data) => {
  return api.post('/solicitudes/simular', data);
};

// Crear solicitud de crédito (P3)
const createLoanApplication = (formData) => {
  return api.post('/solicitudes/crear-con-usuario', formData, { // Ajustado a /solicitudes/crear-con-usuario
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener todas las solicitudes (P4 - para evaluación)
const getAllSolicitudes = () => {
  return api.get('/solicitudes'); // Ajustado a /solicitudes
};

// Evaluar una solicitud (P4 - para evaluación)
const evaluateLoan = (idSolicitud) => {
  return api.put(`/solicitudes/${idSolicitud}/evaluar`);
};

// Obtener solicitudes por nombre de usuario (P5 - para seguimiento)
const getSolicitudesByUser = (nombreCompleto) => {
  return api.get(`/solicitudes/usuario/nombre/${nombreCompleto}`); // Ajustado a /solicitudes/usuario/nombre/{nombreCompleto}
};

export default {
  simulateLoan,
  createLoanApplication,
  getAllSolicitudes,
  evaluateLoan,
  getSolicitudesByUser,
};
