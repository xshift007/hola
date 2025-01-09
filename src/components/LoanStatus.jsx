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
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import loanService from '../services/loanService';
import dayjs from 'dayjs';
import BackButton from './BackButton'; // Importar BackButton

const LoanStatus = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

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

  const handleDeleteClick = (idSolicitud) => {
    setSelectedLoanId(idSolicitud);
    setDeleteDialogOpen(true);
  };

  // src/components/LoanStatus.jsx
  const handleDeleteConfirm = () => {
    loanService.deleteLoan(selectedLoanId)
      .then(() => {
        setSolicitudes(solicitudes.filter(solicitud => solicitud.idSolicitud !== selectedLoanId));
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Error al eliminar la solicitud');
        setDeleteDialogOpen(false);
      });
  };


  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedLoanId(null);
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <BackButton />
      <Typography variant="h5">Estado de sus Solicitudes</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              name="nombreCompleto"
              label="Nombre Completo"
              fullWidth
              value={nombreCompleto}
              onChange={handleChange}
              required
              variant="outlined"
              helperText="Ingrese su nombre completo tal como está registrado"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ver Solicitudes'}
            </Button>
          </Grid>
        </Grid>
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
              <TableCell>Acciones</TableCell> {/* Nueva columna para acciones */}
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudes.map((solicitud) => (
              <TableRow key={solicitud.idSolicitud}>
                <TableCell>{solicitud.idSolicitud}</TableCell>
                <TableCell>{dayjs(solicitud.fechaSolicitud).format('DD/MM/YYYY')}</TableCell>
                <TableCell>${solicitud.montoSolicitado.toLocaleString()}</TableCell>
                <TableCell>{solicitud.plazoSolicitado} años</TableCell>
                <TableCell>{solicitud.estadoSolicitud}</TableCell>
                <TableCell>{solicitud.comentariosSeguimiento || 'N/A'}</TableCell>
                <TableCell>
                  {solicitud.fechaAprobacionRechazo
                    ? dayjs(solicitud.fechaAprobacionRechazo).format('DD/MM/YYYY')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Tooltip title="Eliminar Solicitud">
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(solicitud.idSolicitud)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Eliminar Solicitud</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Está seguro de que desea eliminar esta solicitud? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoanStatus;
