// src/components/Navbar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/styles.css'
import '../App.css'

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
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
            end
          >
            PrestaBanco
          </NavLink>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
            end
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/register"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Registro
          </NavLink>
          <NavLink 
            to="/loan-application"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Aplicar Préstamo
          </NavLink>
          <NavLink 
            to="/loan-evaluation"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Evaluar Solicitudes
          </NavLink>
          <NavLink 
            to="/loan-status"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Estado Solicitudes
          </NavLink>
          <NavLink 
            to="/simulation"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Simulación
          </NavLink>
          
          {/* Nuevo link a la vista Q&A */}
          <NavLink 
            to="/qa"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}
          >
            Q&A
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
