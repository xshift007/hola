// src/components/Home.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4">Bienvenido a PrestaBanco</Typography>
      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        Tu solución para créditos hipotecarios.
      </Typography>
    </Container>
  );
};

export default Home;
