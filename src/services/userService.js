import api from './api';

const registerUser = (usuario) => {
  return api.post('/usuarios/registrar', usuario);
};

export default {
  registerUser,
};
