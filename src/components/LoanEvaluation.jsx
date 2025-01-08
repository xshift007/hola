// src/components/LoanEvaluation.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import loanService from '../services/loanService';
import BackButton from './BackButton'; // Importar BackButton

const LoanEvaluation = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluando, setEvaluando] = useState(null); // ID de la solicitud que se está evaluando

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = () => {
    setLoading(true);
    setError(null);
    loanService
      .getAllSolicitudes()
      .then((response) => {
        setSolicitudes(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Error al obtener las solicitudes');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const evaluarSolicitud = (idSolicitud) => {
    setEvaluando(idSolicitud);
    loanService
      .evaluateLoan(idSolicitud)
      .then((response) => {
        alert(`Solicitud evaluada: ${response.data}`);
        fetchSolicitudes(); // Actualizar la lista después de la evaluación
      })
      .catch((error) => {
        console.error(error);
        alert('Error al evaluar la solicitud');
      })
      .finally(() => {
        setEvaluando(null);
      });
  };

  if (loading) {
    return (
      <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '2rem' }}>
      <BackButton />
      <Typography variant="h5" gutterBottom>
        Evaluación de Solicitudes de Crédito
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Solicitud</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Tipo de Préstamo</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Plazo (años)</TableCell>
            <TableCell>Tasa de Interés (%)</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map((solicitud) => (
            <TableRow key={solicitud.idSolicitud}>
              <TableCell>{solicitud.idSolicitud}</TableCell>
              <TableCell>{solicitud.usuario.nombreCompleto}</TableCell>
              <TableCell>{solicitud.tipoPrestamo}</TableCell>
              <TableCell>${solicitud.montoSolicitado.toLocaleString()}</TableCell>
              <TableCell>{solicitud.plazoSolicitado}</TableCell>
              <TableCell>{solicitud.tasaInteres}%</TableCell>
              <TableCell>{solicitud.estadoSolicitud}</TableCell>
              <TableCell>
                {solicitud.estadoSolicitud === 'EN_REVISION_INICIAL' && (
                  <Tooltip title="Evaluar esta solicitud">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => evaluarSolicitud(solicitud.idSolicitud)}
                      disabled={evaluando === solicitud.idSolicitud}
                    >
                      {evaluando === solicitud.idSolicitud ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Evaluar'
                      )}
                    </Button>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default LoanEvaluation;
