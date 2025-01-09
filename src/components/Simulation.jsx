// src/components/Simulation.jsx

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
import loanService from '../services/loanService';
import BackButton from './BackButton'; // Importar BackButton
import CheckIcon from '@mui/icons-material/Check';

const Simulation = () => {
  const [datos, setDatos] = useState({
    montoDeseado: '',
    plazo: '',
    tasaInteres: '',
    tipoPrestamo: 'PRIMERA_VIVIENDA', // Cambiado al valor del enum
  });

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setError(null); // Limpiar errores al cambiar datos
    setResultado(null);
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!datos.montoDeseado) {
      nuevosErrores.montoDeseado = 'El monto deseado es requerido';
    } else if (isNaN(datos.montoDeseado) || parseFloat(datos.montoDeseado) <= 0) {
      nuevosErrores.montoDeseado = 'Debe ser un número positivo';
    }

    if (!datos.plazo) {
      nuevosErrores.plazo = 'El plazo es requerido';
    } else if (isNaN(datos.plazo) || parseInt(datos.plazo, 10) < 1 || parseInt(datos.plazo, 10) > 30) {
      nuevosErrores.plazo = 'Debe ser un número entre 1 y 30';
    }

    if (!datos.tasaInteres) {
      nuevosErrores.tasaInteres = 'La tasa de interés es requerida';
    } else if (isNaN(datos.tasaInteres) || parseFloat(datos.tasaInteres) <= 0) {
      nuevosErrores.tasaInteres = 'Debe ser un número positivo';
    }

    if (!datos.tipoPrestamo) {
      nuevosErrores.tipoPrestamo = 'El tipo de préstamo es requerido';
    }

    setError(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    const simulationData = {
      montoDeseado: parseFloat(datos.montoDeseado),
      plazo: parseInt(datos.plazo, 10),
      tasaInteres: parseFloat(datos.tasaInteres),
      tipoPrestamo: datos.tipoPrestamo,
    };

    setLoading(true);
    setError(null);
    setResultado(null);

    loanService
      .simulateLoan(simulationData)
      .then((response) => {
        setResultado(response.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.data) {
          const errorMessages = Object.values(error.response.data).join('\n');
          setError(`Error al simular el crédito:\n${errorMessages}`);
        } else {
          setError('Error al simular el crédito');
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
        Simulación de Crédito Hipotecario
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Monto Solicitado */}
          <Grid item xs={12}>
            <TextField
              name="montoDeseado"
              label="Monto Solicitado"
              fullWidth
              margin="normal"
              value={datos.montoDeseado}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: "0", step: "0.01" }}
              variant="outlined"
              InputProps={{
                startAdornment: <Typography variant="body1">$&nbsp;</Typography>,
              }}
            />
          </Grid>

          {/* Plazo Solicitado */}
          <Grid item xs={12}>
            <TextField
              name="plazo"
              label={`Plazo Solicitado (${requisitos.plazo ? `${requisitos.plazo.min} años` : 'años'})`}
              fullWidth
              margin="normal"
              value={datos.plazo}
              onChange={handleChange}
              required
              type="number"
              inputProps={{
                min: requisitos.plazo ? requisitos.plazo.min : '1',
                max: requisitos.plazo ? requisitos.plazo.max : '30',
                step: '1',
              }}
              variant="outlined"
            />
          </Grid>

          {/* Tasa de Interés */}
          <Grid item xs={12}>
            <TextField
              name="tasaInteres"
              label={`Tasa de Interés (%) (${requisitos.tasa ? `${requisitos.tasa.min}% - ${requisitos.tasa.max}%` : ''})`}
              fullWidth
              margin="normal"
              value={datos.tasaInteres}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: requisitos.tasa ? requisitos.tasa.min : '0', step: '0.01' }}
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
              required
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
        </Grid>

        {/* Botón de Simulación */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Simular'}
        </Button>
      </form>

      {/* Resultados */}
      {resultado && (
        <Alert severity="success" style={{ marginTop: '2rem' }}>
          <Typography variant="h6">Resultados de la Simulación:</Typography>
          <Typography>Cuota Mensual: ${resultado.cuotaMensual.toLocaleString()}</Typography>
          <Typography>Costo Total: ${resultado.totalPagado.toLocaleString()}</Typography>
          <Typography>Total de Intereses: ${resultado.totalIntereses.toLocaleString()}</Typography>
        </Alert>
      )}

      {/* Mensaje de Error */}
      {error && (
        <Alert severity="error" style={{ marginTop: '1rem' }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Simulation;
