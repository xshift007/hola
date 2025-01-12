// src/components/Home.jsx
import React from 'react'

function Home() {
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
    </div>
  )
}

export default Home
