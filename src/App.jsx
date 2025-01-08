// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Simulation from './components/Simulation';
import UserRegistration from './components/UserRegistration';
import LoanApplication from './components/LoanApplication';
import LoanStatus from './components/LoanStatus';
import LoanEvaluation from './components/LoanEvaluation';
import FAQ from './components/FAQ';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Azul
      },
      secondary: {
        main: '#dc004e', // Rosa
      },
      background: {
        default: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulacion" element={<Simulation />} />
          <Route path="/registro-usuario" element={<UserRegistration />} />
          <Route path="/solicitud-credito" element={<LoanApplication />} />
          <Route path="/estado-solicitudes" element={<LoanStatus />} />
          <Route path="/evaluacion-solicitudes" element={<LoanEvaluation />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Añadir rutas adicionales aquí si es necesario */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
