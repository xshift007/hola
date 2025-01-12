
// src/components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/styles.css'
import '../App.css'  // Por si usamos algo de la app

function Navbar() {
  return (
    <nav 
      style={{
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        padding: '0.75rem',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 999
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            PrestaBanco
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/register" style={linkStyle}>Registro</Link>
          <Link to="/loan-application" style={linkStyle}>Aplicar Préstamo</Link>
          <Link to="/loan-evaluation" style={linkStyle}>Evaluar Solicitudes</Link>
          <Link to="/loan-status" style={linkStyle}>Estado Solicitudes</Link>
          <Link to="/simulation" style={linkStyle}>Simulación</Link>
        </div>
      </div>
    </nav>
  )
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.2s ease-in-out'
}

export default Navbar
