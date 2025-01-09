// src/services/userService.js
import api from './api';

// Registrar un nuevo usuario
const registerUser = (usuario) => {
  return api.post('/usuarios/registrar', usuario);
};

export default {
  registerUser,
};
