// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    color: '#ffeb3b', // Color de resaltado para el enlace activo
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          PrestaBanco
        </Typography>
        <Button
          color="inherit"
          component={NavLink}
          to="/"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Inicio
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/simulacion"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Simulación
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/registro-usuario"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Registro
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/solicitud-credito"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Solicitar Crédito
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/estado-solicitudes"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Mis Solicitudes
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/evaluacion-solicitudes"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Evaluar Solicitudes
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          to="/faq"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          FAQ
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
