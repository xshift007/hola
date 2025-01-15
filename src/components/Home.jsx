// src/components/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalculator, FaUserPlus } from 'react-icons/fa' // Importamos iconos para Simular y Registrarse

function Home() {
  const navigate = useNavigate()

  return (
    <div 
      style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '4px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
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

      {/* Botones para Simular y Registrarse */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/simulation')}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
          className="btn-primary"
        >
          <FaCalculator /> Simular
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
          className="btn-primary"
        >
          <FaUserPlus /> Registrarse
        </button>
      </div>
    </div>
  )
}

export default Home
