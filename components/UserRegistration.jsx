// src/components/UserRegistration.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import userService from '../services/userService';

const UserRegistration = () => {
  const [usuario, setUsuario] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    estadoCivil: '',
    direccion: '',
    numeroTelefono: '',
    correoElectronico: '',
    ingresosMensuales: '',
    deudasActuales: '',
    historialCrediticio: '',
    tipoEmpleo: '',
    antiguedadLaboral: '',
    capacidadAhorro: '',
    tipoUsuario: 'CLIENTE',
  });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioData = {
      ...usuario,
      fechaNacimiento: usuario.fechaNacimiento,
      ingresosMensuales: parseFloat(usuario.ingresosMensuales),
      deudasActuales: parseFloat(usuario.deudasActuales),
      antiguedadLaboral: parseInt(usuario.antiguedadLaboral),
    };

    userService
      .registerUser(usuarioData)
      .then((response) => {
        alert('Usuario registrado con éxito');
        setUsuario({
          nombreCompleto: '',
          fechaNacimiento: '',
          tipoIdentificacion: '',
          numeroIdentificacion: '',
          estadoCivil: '',
          direccion: '',
          numeroTelefono: '',
          correoElectronico: '',
          ingresosMensuales: '',
          deudasActuales: '',
          historialCrediticio: '',
          tipoEmpleo: '',
          antiguedadLaboral: '',
          capacidadAhorro: '',
          tipoUsuario: 'CLIENTE',
        });
      })
      .catch((error) => {
        console.error(error);
        alert('Error al registrar el usuario');
      });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h5">Registro de Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="nombreCompleto"
          label="Nombre Completo"
          fullWidth
          margin="normal"
          value={usuario.nombreCompleto}
          onChange={handleChange}
          required
        />
        <TextField
          name="fechaNacimiento"
          label="Fecha de Nacimiento"
          type="date"
          fullWidth
          margin="normal"
          value={usuario.fechaNacimiento}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          name="tipoIdentificacion"
          label="Tipo de Identificación"
          fullWidth
          margin="normal"
          value={usuario.tipoIdentificacion}
          onChange={handleChange}
          required
        />
        <TextField
          name="numeroIdentificacion"
          label="Número de Identificación"
          fullWidth
          margin="normal"
          value={usuario.numeroIdentificacion}
          onChange={handleChange}
          required
        />
        <TextField
          name="estadoCivil"
          label="Estado Civil"
          fullWidth
          margin="normal"
          value={usuario.estadoCivil}
          onChange={handleChange}
        />
        <TextField
          name="direccion"
          label="Dirección"
          fullWidth
          margin="normal"
          value={usuario.direccion}
          onChange={handleChange}
        />
        <TextField
          name="numeroTelefono"
          label="Número de Teléfono"
          fullWidth
          margin="normal"
          value={usuario.numeroTelefono}
          onChange={handleChange}
          required
        />
        <TextField
          name="correoElectronico"
          label="Correo Electrónico"
          type="email"
          fullWidth
          margin="normal"
          value={usuario.correoElectronico}
          onChange={handleChange}
          required
        />
        <TextField
          name="ingresosMensuales"
          label="Ingresos Mensuales"
          fullWidth
          margin="normal"
          value={usuario.ingresosMensuales}
          onChange={handleChange}
          required
        />
        <TextField
          name="deudasActuales"
          label="Deudas Actuales"
          fullWidth
          margin="normal"
          value={usuario.deudasActuales}
          onChange={handleChange}
          required
        />
        <TextField
          name="historialCrediticio"
          label="Historial Crediticio"
          select
          fullWidth
          margin="normal"
          value={usuario.historialCrediticio}
          onChange={handleChange}
          required
        >
          <MenuItem value="BUENO">Bueno</MenuItem>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="MALO">Malo</MenuItem>
        </TextField>
        <TextField
          name="tipoEmpleo"
          label="Tipo de Empleo"
          fullWidth
          margin="normal"
          value={usuario.tipoEmpleo}
          onChange={handleChange}
        />
        <TextField
          name="antiguedadLaboral"
          label="Antigüedad Laboral (años)"
          fullWidth
          margin="normal"
          value={usuario.antiguedadLaboral}
          onChange={handleChange}
          required
        />
        <TextField
          name="capacidadAhorro"
          label="Capacidad de Ahorro"
          select
          fullWidth
          margin="normal"
          value={usuario.capacidadAhorro}
          onChange={handleChange}
          required
        >
          <MenuItem value="ADECUADA">Adecuada</MenuItem>
          <MenuItem value="INSUFICIENTE">Insuficiente</MenuItem>
        </TextField>
        {/* Agrega más campos si es necesario */}
        <Button type="submit" variant="contained" color="primary">
          Registrarse
        </Button>
      </form>
    </Container>
  );
};

export default UserRegistration;
