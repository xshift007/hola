// src/components/Home.jsx
import React from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container style={{ marginTop: '4rem' }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido a PrestaBanco
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Tu solución para créditos hipotecarios.
      </Typography>
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '2rem' }}>
        <Grid item>
          <Button variant="contained" color="primary" component={Link} to="/registro-usuario">
            Regístrate
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" component={Link} to="/simulacion">
            Simula tu Crédito
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
