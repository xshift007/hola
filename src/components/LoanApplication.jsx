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
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import loanService from '../services/loanService';
import BackButton from './BackButton'; // Importar BackButton
import CheckIcon from '@mui/icons-material/Check';

const LoanApplication = () => {
  const [datos, setDatos] = useState({
    nombreCompleto: '',
    tipoPrestamo: 'PRIMERA_VIVIENDA', // Cambiado al valor del enum
    montoSolicitado: '',
    plazoSolicitado: '',
    tasaInteres: '',
    comprobanteIngresos: null,
    comprobanteAvaluo: null,
  });

  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Inicializar navigate

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
        // Solicitud exitosa, redirigir a "Ver mis solicitudes"
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

  // Definir los requisitos según el tipo de préstamo seleccionado
  const obtenerRequisitos = () => {
    switch (datos.tipoPrestamo) {
      case 'PRIMERA_VIVIENDA':
        return {
          plazo: { min: 30, max: 30 },
          tasa: { min: 3.5, max: 5.0 },
          porcentajeFinanciamiento: 80,
          requisitos: [
            'Comprobante de ingresos',
            'Certificado de avalúo',
            'Historial crediticio',
          ],
        };
      case 'SEGUNDA_VIVIENDA':
        return {
          plazo: { min: 20, max: 20 },
          tasa: { min: 4.0, max: 6.0 },
          porcentajeFinanciamiento: 70,
          requisitos: [
            'Comprobante de ingresos',
            'Certificado de avalúo',
            'Escritura de la primera vivienda',
            'Historial crediticio',
          ],
        };
      case 'PROPIEDADES_COMERCIALES':
        return {
          plazo: { min: 25, max: 25 },
          tasa: { min: 5.0, max: 7.0 },
          porcentajeFinanciamiento: 60,
          requisitos: [
            'Estado financiero del negocio',
            'Comprobante de ingresos',
            'Certificado de avalúo',
            'Plan de negocios',
          ],
        };
      case 'REMODELACION':
        return {
          plazo: { min: 15, max: 15 },
          tasa: { min: 4.5, max: 6.0 },
          porcentajeFinanciamiento: 50,
          requisitos: [
            'Comprobante de ingresos',
            'Presupuesto de la remodelación',
            'Certificado de avalúo actualizado',
          ],
        };
      default:
        return {};
    }
  };

  const requisitos = obtenerRequisitos();

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
          <Grid item xs={12}>
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
              <MenuItem value="PRIMERA_VIVIENDA">Primera Vivienda</MenuItem>
              <MenuItem value="SEGUNDA_VIVIENDA">Segunda Vivienda</MenuItem>
              <MenuItem value="PROPIEDADES_COMERCIALES">Propiedades Comerciales</MenuItem>
              <MenuItem value="REMODELACION">Remodelación</MenuItem>
            </TextField>
          </Grid>

          {/* Mostrar Requisitos Según Tipo de Préstamo Seleccionado */}
          {requisitos.requisitos && (
            <Grid item xs={12}>
              <Box sx={{ border: '1px solid red', padding: '1rem', borderRadius: '4px' }}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Requisitos para {datos.tipoPrestamo.replace('_', ' ')}:
                </Typography>
                <List>
                  {requisitos.requisitos.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          )}

          {/* Monto Solicitado */}
          <Grid item xs={12}>
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
              InputProps={{
                startAdornment: <Typography variant="body1">$&nbsp;</Typography>,
              }}
            />
          </Grid>

          {/* Plazo Solicitado */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="plazoSolicitado"
              label={`Plazo Solicitado (${requisitos.plazo ? `${requisitos.plazo.min} años` : 'años'})`}
              type="number"
              inputProps={{
                min: requisitos.plazo ? requisitos.plazo.min : '1',
                max: requisitos.plazo ? requisitos.plazo.max : '30',
                step: '1',
              }}
              value={datos.plazoSolicitado}
              onChange={handleChange}
              error={Boolean(errores.plazoSolicitado)}
              helperText={errores.plazoSolicitado}
              variant="outlined"
            />
          </Grid>

          {/* Tasa de Interés */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="tasaInteres"
              label={`Tasa de Interés (%) (${requisitos.tasa ? `${requisitos.tasa.min}% - ${requisitos.tasa.max}%` : ''})`}
              type="number"
              inputProps={{ min: requisitos.tasa ? requisitos.tasa.min : '0', step: '0.01' }}
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
              component={Button}
              to="/estado-solicitudes"
              onClick={() => navigate('/estado-solicitudes')} // Redirigir a Mis Solicitudes
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
