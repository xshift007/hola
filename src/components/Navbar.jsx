// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          PrestaBanco
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Inicio
        </Button>
        <Button color="inherit" component={Link} to="/simulacion">
          Simulación
        </Button>
        <Button color="inherit" component={Link} to="/registro-usuario">
          Registro
        </Button>
        <Button color="inherit" component={Link} to="/solicitud-credito">
          Solicitar Crédito
        </Button>
        <Button color="inherit" component={Link} to="/estado-solicitudes">
          Mis Solicitudes
        </Button>
        <Button color="inherit" component={Link} to="/evaluacion-solicitudes">
          Evaluar Solicitudes
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
