// src/components/UserRegistration.jsx
import React, { useState } from 'react';
import { 
  Container, TextField, Button, Typography, MenuItem, 
  Alert, CircularProgress, Grid 
} from '@mui/material';
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

  const [errores, setErrores] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: '' }); // Limpiar error al modificar campo
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!usuario.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es requerido';
    }

    if (!usuario.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!usuario.tipoIdentificacion) {
      nuevosErrores.tipoIdentificacion = 'El tipo de identificación es requerido';
    }

    if (!usuario.numeroIdentificacion.trim()) {
      nuevosErrores.numeroIdentificacion = 'El número de identificación es requerido';
    }

    if (!usuario.numeroTelefono.trim()) {
      nuevosErrores.numeroTelefono = 'El número de teléfono es requerido';
    }

    if (!usuario.correoElectronico.trim()) {
      nuevosErrores.correoElectronico = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(usuario.correoElectronico)) {
      nuevosErrores.correoElectronico = 'Formato de correo electrónico inválido';
    }

    if (!usuario.ingresosMensuales) {
      nuevosErrores.ingresosMensuales = 'Los ingresos mensuales son requeridos';
    } else if (isNaN(usuario.ingresosMensuales) || parseFloat(usuario.ingresosMensuales) < 0) {
      nuevosErrores.ingresosMensuales = 'Debe ser un número positivo';
    }

    if (!usuario.deudasActuales) {
      nuevosErrores.deudasActuales = 'Las deudas actuales son requeridas';
    } else if (isNaN(usuario.deudasActuales) || parseFloat(usuario.deudasActuales) < 0) {
      nuevosErrores.deudasActuales = 'Debe ser un número positivo';
    }

    if (!usuario.historialCrediticio) {
      nuevosErrores.historialCrediticio = 'El historial crediticio es requerido';
    }

    if (!usuario.antiguedadLaboral) {
      nuevosErrores.antiguedadLaboral = 'La antigüedad laboral es requerida';
    } else if (
      isNaN(usuario.antiguedadLaboral) ||
      parseInt(usuario.antiguedadLaboral, 10) < 0
    ) {
      nuevosErrores.antiguedadLaboral = 'Debe ser un número positivo';
    }

    if (!usuario.capacidadAhorro) {
      nuevosErrores.capacidadAhorro = 'La capacidad de ahorro es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    userService.registerUser(usuario)
      .then(response => {
        setSuccess('Usuario registrado con éxito');
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
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Error al registrar el usuario');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Registro de Usuario
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre Completo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="nombreCompleto"
              label="Nombre Completo"
              value={usuario.nombreCompleto}
              onChange={handleChange}
              error={Boolean(errores.nombreCompleto)}
              helperText={errores.nombreCompleto}
              variant="outlined"
            />
          </Grid>

          {/* Fecha de Nacimiento */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              value={usuario.fechaNacimiento}
              onChange={handleChange}
              error={Boolean(errores.fechaNacimiento)}
              helperText={errores.fechaNacimiento}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>

          {/* Tipo de Identificación */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="tipoIdentificacion"
              label="Tipo de Identificación"
              value={usuario.tipoIdentificacion}
              onChange={handleChange}
              error={Boolean(errores.tipoIdentificacion)}
              helperText={errores.tipoIdentificacion}
              variant="outlined"
            >
              <MenuItem value="CEDULA_CIUDADANIA">Cédula de Ciudadanía</MenuItem>
              <MenuItem value="CEDULA_EXTRANJERIA">Cédula de Extranjería</MenuItem>
              <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
              {/* Añadir más opciones si es necesario */}
            </TextField>
          </Grid>

          {/* Número de Identificación */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="numeroIdentificacion"
              label="Número de Identificación"
              value={usuario.numeroIdentificacion}
              onChange={handleChange}
              error={Boolean(errores.numeroIdentificacion)}
              helperText={errores.numeroIdentificacion}
              variant="outlined"
            />
          </Grid>

          {/* Estado Civil */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="estadoCivil"
              label="Estado Civil"
              value={usuario.estadoCivil}
              onChange={handleChange}
              error={Boolean(errores.estadoCivil)}
              helperText={errores.estadoCivil}
              variant="outlined"
            >
              <MenuItem value="SOLTERO">Soltero</MenuItem>
              <MenuItem value="CASADO">Casado</MenuItem>
              <MenuItem value="DIVORCIADO">Divorciado</MenuItem>
              <MenuItem value="VIUDO">Viudo</MenuItem>
              {/* Añadir más opciones si es necesario */}
            </TextField>
          </Grid>

          {/* Dirección */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="direccion"
              label="Dirección"
              value={usuario.direccion}
              onChange={handleChange}
              error={Boolean(errores.direccion)}
              helperText={errores.direccion}
              variant="outlined"
            />
          </Grid>

          {/* Número de Teléfono */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="numeroTelefono"
              label="Número de Teléfono"
              value={usuario.numeroTelefono}
              onChange={handleChange}
              error={Boolean(errores.numeroTelefono)}
              helperText={errores.numeroTelefono}
              variant="outlined"
              type="tel"
              inputProps={{ pattern: '[0-9]{10}' }} // Validación básica para 10 dígitos
            />
          </Grid>

          {/* Correo Electrónico */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="correoElectronico"
              label="Correo Electrónico"
              type="email"
              value={usuario.correoElectronico}
              onChange={handleChange}
              error={Boolean(errores.correoElectronico)}
              helperText={errores.correoElectronico}
              variant="outlined"
            />
          </Grid>

          {/* Ingresos Mensuales */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="ingresosMensuales"
              label="Ingresos Mensuales"
              type="number"
              value={usuario.ingresosMensuales}
              onChange={handleChange}
              error={Boolean(errores.ingresosMensuales)}
              helperText={errores.ingresosMensuales}
              variant="outlined"
              inputProps={{ min: '0', step: '0.01' }}
            />
          </Grid>

          {/* Deudas Actuales */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="deudasActuales"
              label="Deudas Actuales"
              type="number"
              value={usuario.deudasActuales}
              onChange={handleChange}
              error={Boolean(errores.deudasActuales)}
              helperText={errores.deudasActuales}
              variant="outlined"
              inputProps={{ min: '0', step: '0.01' }}
            />
          </Grid>

          {/* Historial Crediticio */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="historialCrediticio"
              label="Historial Crediticio"
              value={usuario.historialCrediticio}
              onChange={handleChange}
              error={Boolean(errores.historialCrediticio)}
              helperText={errores.historialCrediticio}
              variant="outlined"
            >
              <MenuItem value="BUENO">Bueno</MenuItem>
              <MenuItem value="REGULAR">Regular</MenuItem>
              <MenuItem value="MALO">Malo</MenuItem>
            </TextField>
          </Grid>

          {/* Tipo de Empleo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="tipoEmpleo"
              label="Tipo de Empleo"
              value={usuario.tipoEmpleo}
              onChange={handleChange}
              error={Boolean(errores.tipoEmpleo)}
              helperText={errores.tipoEmpleo}
              variant="outlined"
            />
          </Grid>

          {/* Antigüedad Laboral */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="antiguedadLaboral"
              label="Antigüedad Laboral (años)"
              type="number"
              value={usuario.antiguedadLaboral}
              onChange={handleChange}
              error={Boolean(errores.antiguedadLaboral)}
              helperText={errores.antiguedadLaboral}
              variant="outlined"
              inputProps={{ min: '0', step: '1' }}
            />
          </Grid>

          {/* Capacidad de Ahorro */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="capacidadAhorro"
              label="Capacidad de Ahorro"
              value={usuario.capacidadAhorro}
              onChange={handleChange}
              error={Boolean(errores.capacidadAhorro)}
              helperText={errores.capacidadAhorro}
              variant="outlined"
            >
              <MenuItem value="ADECUADA">Adecuada</MenuItem>
              <MenuItem value="INSUFICIENTE">Insuficiente</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Mensajes de Error y Éxito */}
        {error && (
          <Alert severity="error" style={{ marginTop: '1rem' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" style={{ marginTop: '1rem' }}>
            {success}
          </Alert>
        )}

        {/* Botón de Envío */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
        </Button>
      </form>
    </Container>
  );
};

export default UserRegistration;
