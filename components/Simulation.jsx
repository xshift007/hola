// src/components/Simulation.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import loanService from '../services/loanService';

const Simulation = () => {
  const [datos, setDatos] = useState({
    montoDeseado: '',
    plazo: '',
    tasaInteres: '',
    tipoPrestamo: 'HIPOTECARIO', // Valor por defecto
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!datos.montoDeseado || !datos.plazo || !datos.tasaInteres || !datos.tipoPrestamo) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const simulationData = {
      montoDeseado: parseFloat(datos.montoDeseado),
      plazo: parseInt(datos.plazo, 10),
      tasaInteres: parseFloat(datos.tasaInteres),
      tipoPrestamo: datos.tipoPrestamo,
    };

    loanService
      .simulateLoan(simulationData)
      .then((response) => {
        setResultado(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // Mostrar mensajes de error específicos del back-end
          const errorMessages = Object.values(error.response.data).join('\n');
          alert(`Error al simular el crédito:\n${errorMessages}`);
        } else {
          console.error(error);
          alert('Error al simular el crédito');
        }
      });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h5">Simulación de Crédito</Typography> {/* Título actualizado */}
      <form onSubmit={handleSubmit}>
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
        />
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
        />
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
        />
        <TextField
          name="tipoPrestamo"
          label="Tipo de Préstamo"
          select
          fullWidth
          margin="normal"
          value={datos.tipoPrestamo}
          onChange={handleChange}
          required
        >
          <MenuItem value="HIPOTECARIO">Hipotecario</MenuItem>
          <MenuItem value="PERSONAL">Personal</MenuItem>
          <MenuItem value="EMPRESARIAL">Empresarial</MenuItem> {/* Nueva opción agregada */}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Simular
        </Button>
      </form>
      {resultado && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h6">Resultados de la Simulación:</Typography>
          <Typography>Cuota Mensual: {resultado.cuotaMensual}</Typography>
          <Typography>Costo Total: {resultado.totalPagado}</Typography>
          <Typography>Total de Intereses: {resultado.totalIntereses}</Typography>
        </div>
      )}
    </Container>
  );
};

export default Simulation;
