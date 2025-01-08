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
} from '@mui/material';
import loanService from '../services/loanService';
import BackButton from './BackButton'; // Importar BackButton

const Simulation = () => {
  const [datos, setDatos] = useState({
    montoDeseado: '',
    plazo: '',
    tasaInteres: '',
    tipoPrestamo: 'HIPOTECARIO',
  });

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!datos.montoDeseado || !datos.plazo || !datos.tasaInteres || !datos.tipoPrestamo) {
      setError('Por favor, completa todos los campos requeridos.');
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
            />
          </Grid>

          {/* Plazo Solicitado */}
          <Grid item xs={12}>
            <TextField
              name="plazo"
              label="Plazo Solicitado (años)"
              fullWidth
              margin="normal"
              value={datos.plazo}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: "1", max: "30", step: "1" }}
              variant="outlined"
            />
          </Grid>

          {/* Tasa de Interés */}
          <Grid item xs={12}>
            <TextField
              name="tasaInteres"
              label="Tasa de Interés (%)"
              fullWidth
              margin="normal"
              value={datos.tasaInteres}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: "0", step: "0.01" }}
              variant="outlined"
            />
          </Grid>

          {/* Tipo de Préstamo */}
          <Grid item xs={12}>
            <TextField
              name="tipoPrestamo"
              label="Tipo de Préstamo"
              select
              fullWidth
              margin="normal"
              value={datos.tipoPrestamo}
              onChange={handleChange}
              required
              variant="outlined"
            >
              <MenuItem value="HIPOTECARIO">Hipotecario</MenuItem>
              <MenuItem value="PERSONAL">Personal</MenuItem>
              <MenuItem value="EMPRESARIAL">Empresarial</MenuItem>
              {/* Añadir más opciones si es necesario */}
            </TextField>
          </Grid>
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
