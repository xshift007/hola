// src/components/LoanApplication.jsx
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import loanService from '../services/loanService';
import BackButton from './BackButton'; // Importar BackButton

const LoanApplication = () => {
  const [datos, setDatos] = useState({
    nombreCompleto: '',
    tipoPrestamo: 'HIPOTECARIO',
    montoSolicitado: '',
    plazoSolicitado: '',
    tasaInteres: '',
    comprobanteIngresos: null,
    comprobanteAvaluo: null,
  });

  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'comprobanteIngresos' || name === 'comprobanteAvaluo') {
      setDatos((prevDatos) => ({
        ...prevDatos,
        [name]: files[0],
      }));
      setErrores((prevErrores) => ({
        ...prevErrores,
        [name]: '',
      }));
    } else {
      setDatos((prevDatos) => ({
        ...prevDatos,
        [name]: value,
      }));
      setErrores((prevErrores) => ({
        ...prevErrores,
        [name]: '',
      }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!datos.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre completo es requerido';
    }

    if (!datos.tipoPrestamo) {
      nuevosErrores.tipoPrestamo = 'El tipo de préstamo es requerido';
    }

    if (!datos.montoSolicitado) {
      nuevosErrores.montoSolicitado = 'El monto es requerido';
    } else if (isNaN(datos.montoSolicitado) || parseFloat(datos.montoSolicitado) <= 0) {
      nuevosErrores.montoSolicitado = 'Debe ser un número positivo';
    }

    if (!datos.plazoSolicitado) {
      nuevosErrores.plazoSolicitado = 'El plazo es requerido';
    } else if (
      isNaN(datos.plazoSolicitado) ||
      parseInt(datos.plazoSolicitado, 10) < 1 ||
      parseInt(datos.plazoSolicitado, 10) > 30
    ) {
      nuevosErrores.plazoSolicitado = 'Debe ser un número entre 1 y 30';
    }

    if (!datos.tasaInteres) {
      nuevosErrores.tasaInteres = 'La tasa de interés es requerida';
    } else if (isNaN(datos.tasaInteres) || parseFloat(datos.tasaInteres) <= 0) {
      nuevosErrores.tasaInteres = 'Debe ser un número positivo';
    }

    if (!datos.comprobanteIngresos) {
      nuevosErrores.comprobanteIngresos = 'El comprobante de ingresos es requerido';
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(datos.comprobanteIngresos.type)) {
        nuevosErrores.comprobanteIngresos = 'Formato de archivo inválido';
      }
      if (datos.comprobanteIngresos.size > 5242880) { // 5MB
        nuevosErrores.comprobanteIngresos = 'El archivo es muy grande';
      }
    }

    if (!datos.comprobanteAvaluo) {
      nuevosErrores.comprobanteAvaluo = 'El comprobante de avalúo es requerido';
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(datos.comprobanteAvaluo.type)) {
        nuevosErrores.comprobanteAvaluo = 'Formato de archivo inválido';
      }
      if (datos.comprobanteAvaluo.size > 5242880) { // 5MB
        nuevosErrores.comprobanteAvaluo = 'El archivo es muy grande';
      }
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

    const formData = new FormData();
    formData.append('nombreCompleto', datos.nombreCompleto.trim());
    formData.append('tipoPrestamo', datos.tipoPrestamo);
    formData.append('montoSolicitado', parseFloat(datos.montoSolicitado));
    formData.append('plazoSolicitado', parseInt(datos.plazoSolicitado, 10));
    formData.append('tasaInteres', parseFloat(datos.tasaInteres));
    formData.append('comprobanteIngresos', datos.comprobanteIngresos);
    formData.append('comprobanteAvaluo', datos.comprobanteAvaluo);

    loanService.createLoanApplication(formData)
      .then(response => {
        // Solicitud exitosa, redirigir a "Ver Mis Solicitudes"
        navigate('/estado-solicitudes');
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Error al crear la solicitud de crédito');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <BackButton />
      <Typography variant="h5" gutterBottom>
        Solicitud de Crédito Hipotecario
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          {/* Nombre Completo */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="nombreCompleto"
              label="Nombre Completo"
              value={datos.nombreCompleto}
              onChange={handleChange}
              error={Boolean(errores.nombreCompleto)}
              helperText={errores.nombreCompleto}
              variant="outlined"
            />
          </Grid>

          {/* Tipo de Préstamo */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              name="tipoPrestamo"
              label="Tipo de Préstamo"
              value={datos.tipoPrestamo}
              onChange={handleChange}
              error={Boolean(errores.tipoPrestamo)}
              helperText={errores.tipoPrestamo}
              variant="outlined"
            >
              <MenuItem value="HIPOTECARIO">Hipotecario</MenuItem>
              <MenuItem value="PERSONAL">Personal</MenuItem>
              {/* Añadir más opciones si es necesario */}
            </TextField>
          </Grid>

          {/* Monto Solicitado */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="montoSolicitado"
              label="Monto Solicitado"
              type="number"
              inputProps={{ min: '0', step: '0.01' }}
              value={datos.montoSolicitado}
              onChange={handleChange}
              error={Boolean(errores.montoSolicitado)}
              helperText={errores.montoSolicitado}
              variant="outlined"
            />
          </Grid>

          {/* Plazo Solicitado */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="plazoSolicitado"
              label="Plazo Solicitado (años)"
              type="number"
              inputProps={{ min: '1', max: '30', step: '1' }}
              value={datos.plazoSolicitado}
              onChange={handleChange}
              error={Boolean(errores.plazoSolicitado)}
              helperText={errores.plazoSolicitado}
              variant="outlined"
            />
          </Grid>

          {/* Tasa de Interés */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="tasaInteres"
              label="Tasa de Interés (%)"
              type="number"
              inputProps={{ min: '0', step: '0.01' }}
              value={datos.tasaInteres}
              onChange={handleChange}
              error={Boolean(errores.tasaInteres)}
              helperText={errores.tasaInteres}
              variant="outlined"
            />
          </Grid>

          {/* Comprobante de Ingresos */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Subir Comprobante de Ingresos
              <input
                type="file"
                hidden
                name="comprobanteIngresos"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
              />
            </Button>
            {datos.comprobanteIngresos && (
              <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
                Archivo: {datos.comprobanteIngresos.name}
              </Typography>
            )}
            {errores.comprobanteIngresos && (
              <Alert severity="error" style={{ marginTop: '0.5rem' }}>
                {errores.comprobanteIngresos}
              </Alert>
            )}
          </Grid>

          {/* Comprobante de Avalúo */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Subir Comprobante de Avalúo
              <input
                type="file"
                hidden
                name="comprobanteAvaluo"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
              />
            </Button>
            {datos.comprobanteAvaluo && (
              <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
                Archivo: {datos.comprobanteAvaluo.name}
              </Typography>
            )}
            {errores.comprobanteAvaluo && (
              <Alert severity="error" style={{ marginTop: '0.5rem' }}>
                {errores.comprobanteAvaluo}
              </Alert>
            )}
          </Grid>
        </Grid>

        {/* Mensaje de Error */}
        {error && (
          <Alert severity="error" style={{ marginTop: '1rem' }}>
            {error}
          </Alert>
        )}

        {/* Botones de Envío y Cancelación */}
        <Grid container spacing={2} style={{ marginTop: '1rem' }}>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Solicitar Crédito'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/estado-solicitudes')}
              fullWidth
            >
              Ver Mis Solicitudes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoanApplication;
