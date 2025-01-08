// src/components/LoanStatus.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import loanService from '../services/loanService';
import dayjs from 'dayjs';

const LoanStatus = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNombreCompleto(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSolicitudes([]);

    loanService
      .getSolicitudesByUser(nombreCompleto)
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

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h5">Estado de sus Solicitudes</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="nombreCompleto"
          label="Nombre Completo"
          fullWidth
          margin="normal"
          value={nombreCompleto}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Ver Solicitudes'}
        </Button>
      </form>
      {error && (
        <Alert severity="error" style={{ marginTop: '1rem' }}>
          {error}
        </Alert>
      )}
      {solicitudes.length > 0 && (
        <Table style={{ marginTop: '2rem' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID Solicitud</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Plazo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell>Fecha de Aprobación/Rechazo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow key={solicitud.idSolicitud}>
                <TableCell>{solicitud.idSolicitud}</TableCell>
                <TableCell>
                  {dayjs(solicitud.fechaSolicitud).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>{solicitud.montoSolicitado}</TableCell>
                <TableCell>{solicitud.plazoSolicitado}</TableCell>
                <TableCell>{solicitud.estadoSolicitud}</TableCell>
                <TableCell>{solicitud.comentariosSeguimiento}</TableCell>
                <TableCell>
                  {solicitud.fechaAprobacionRechazo
                    ? dayjs(solicitud.fechaAprobacionRechazo).format('DD/MM/YYYY')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default LoanStatus;
