// src/components/UserRegistration.jsx
import React, { useState } from 'react'
import { registerUser } from '../services/userService'
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

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser(formData)
      setMessage('Usuario registrado con éxito.')
      setError('')
    } catch (error) {
      setError('Error al registrar usuario.')
      setMessage('')
    }
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

        {/* Rest of the fields... */}
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

        <button type="submit" className="btn-primary">
          Registrar
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default UserRegistration
