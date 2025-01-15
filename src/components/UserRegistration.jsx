// src/components/UserRegistration.jsx
import React, { useState } from 'react'
import { registerUser } from '../services/userService'
import { useNavigate } from 'react-router-dom'
import '../styles/styles.css'

function UserRegistration() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    estadoCivil: '',
    direccion: '',
    numeroTelefono: '',
    correoElectronico: '',
    ingresosMensuales: '',
    historialCrediticio: 'BUENO',
    tipoEmpleo: '',
    antiguedadLaboral: '',
    saldoCuentaAhorros: '',
    historialAhorro: '',
    numeroDependientes: '',
    tipoUsuario: 'CLIENTE',
    capacidadAhorro: 'ADECUADA',
    deudasActuales: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

   // Botón "Limpiar" - resetea el formulario
   const handleClear = () => {
    setFormData({
      nombreCompleto: '',
      fechaNacimiento: '',
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      estadoCivil: '',
      direccion: '',
      numeroTelefono: '',
      correoElectronico: '',
      ingresosMensuales: '',
      historialCrediticio: 'BUENO',
      tipoEmpleo: '',
      antiguedadLaboral: '',
      saldoCuentaAhorros: '',
      historialAhorro: '',
      numeroDependientes: '',
      tipoUsuario: 'CLIENTE',
      capacidadAhorro: 'ADECUADA',
      deudasActuales: ''
    })
    setError('')
    setMessage('')
    setShowModal(false)
  }

  // Botón "Volver a Inicio"
  const handleGoHome = () => {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirmed = window.confirm('¿Estás seguro de registrar este usuario?')
    if (!confirmed) return

    try {
      await registerUser(formData)
      setMessage('¡Usuario registrado con éxito!')
      setError('')
      setShowModal(true)  // Mostramos el modal con el mensaje
    } catch (err) {
      setError('Error al registrar usuario.')
      setMessage('')
    }
  }

  // Cuando el usuario elija "Ir a Aplicar Préstamo"
  const handleGoToLoanApplication = () => {
    setShowModal(false)
    navigate('/loan-application')
  }

  // Cuando el usuario quiera permanecer
  const handleStayHere = () => {
    setShowModal(false)
  }
  return (
    <div className="form-section">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre Completo *</label>
        <input 
          type="text" 
          name="nombreCompleto" 
          value={formData.nombreCompleto} 
          onChange={handleChange} 
          required 
        />

        <label>Fecha de Nacimiento</label>
        <input 
          type="date" 
          name="fechaNacimiento" 
          value={formData.fechaNacimiento} 
          onChange={handleChange}
        />

        <label>Tipo de Identificación</label>
        <input 
          type="text" 
          name="tipoIdentificacion" 
          value={formData.tipoIdentificacion} 
          onChange={handleChange}
        />
        
        <label>Número de Identificación</label>
        <input 
          type="text" 
          name="numeroIdentificacion" 
          value={formData.numeroIdentificacion} 
          onChange={handleChange}
        />
        <label>Correo Electrónico</label>
        <input 
          type="email"
          name="correoElectronico"
          value={formData.correoElectronico}
          onChange={handleChange}
        />

        <label>Ingresos Mensuales</label>
        <input
          type="number"
          name="ingresosMensuales"
          value={formData.ingresosMensuales}
          onChange={handleChange}
        />

        {/* Más campos... */}
        <label>Antigüedad Laboral (años)</label>
        <input 
          type="number" 
          name="antiguedadLaboral" 
          value={formData.antiguedadLaboral} 
          onChange={handleChange}
        />

        <label>Historial Crediticio</label>
        <select 
          name="historialCrediticio" 
          value={formData.historialCrediticio} 
          onChange={handleChange}
        >
          <option value="BUENO">BUENO</option>
          <option value="REGULAR">REGULAR</option>
          <option value="MALO">MALO</option>
        </select>

        <label>Capacidad de Ahorro</label>
        <select 
          name="capacidadAhorro" 
          value={formData.capacidadAhorro} 
          onChange={handleChange}
        >
          <option value="ADECUADA">ADECUADA</option>
          <option value="INSUFICIENTE">INSUFICIENTE</option>
        </select>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">
            Registrar
          </button>
          <button type="button" className="btn-primary" style={{ backgroundColor: '#6c757d' }} onClick={handleClear}>
            Limpiar
          </button>
          <button type="button" className="btn-primary" style={{ backgroundColor: '#17a2b8' }} onClick={handleGoHome}>
            Volver a Inicio
          </button>
        </div>
      </form>

      {message && !showModal && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Modal centrado con dos opciones (Permanecer o Ir a Aplicar Préstamo) */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              width: '400px',
              margin: '10% auto',
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '4px',
              position: 'relative'
            }}
          >
            <h3>{message}</h3>
            <p>¿Deseas ir a la página de Aplicar Préstamo o permanecer aquí?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn-primary"
                style={{ backgroundColor: '#6c757d' }}
                onClick={handleStayHere}
              >
                Permanecer
              </button>
              <button
                className="btn-primary"
                onClick={handleGoToLoanApplication}
              >
                Ir a Aplicar Préstamo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRegistration