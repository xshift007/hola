// src/components/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div 
      style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '4px',
        border: '1px solid var(--border-color)'
      }}
    >
      <h1 style={{ marginBottom: '1rem' }}>Bienvenido a PrestaBanco</h1>
      <p style={{ marginBottom: '1rem' }}>
        Simplificamos la gestión de tus solicitudes de crédito hipotecario. 
        Regístrate, aplica a un préstamo, evalúa solicitudes y simula montos, 
        todo en un solo lugar.
      </p>
      <p>
        Navega a través de nuestro menú superior para descubrir todas las funcionalidades 
        disponibles y aprovechar nuestros servicios.
      </p>

      {/* Botón Volver (opcional en Home, pero lo dejamos de ejemplo) */}
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'var(--primary-color)',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Volver
      </button>
    </div>
  )
}

export default Home
