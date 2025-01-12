// src/components/LoanApplication.jsx
import React, { useState } from 'react'
import { createLoanApplication } from '../services/loanService'
import '../styles/styles.css'

function LoanApplication() {
  const [formData, setFormData] = useState({
    tipoPrestamo: 'PRIMERA VIVIENDA',
    montoSolicitado: '',
    plazoSolicitado: '',
    tasaInteres: '',
    valorPropiedad: '',
    nombreCompleto: ''
  })
  const [avaluoFile, setAvaluoFile] = useState(null)
  const [ingresosFile, setIngresosFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    })
  }

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const multipartFormData = new FormData()
      multipartFormData.append('tipoPrestamo', formData.tipoPrestamo)
      multipartFormData.append('montoSolicitado', formData.montoSolicitado)
      multipartFormData.append('plazoSolicitado', formData.plazoSolicitado)
      multipartFormData.append('tasaInteres', formData.tasaInteres)
      multipartFormData.append('valorPropiedad', formData.valorPropiedad)
      multipartFormData.append('comprobanteAvaluo', avaluoFile)
      multipartFormData.append('comprobanteIngresos', ingresosFile)
      multipartFormData.append('nombreCompleto', formData.nombreCompleto)

      await createLoanApplication(multipartFormData)
      setMessage('Solicitud de préstamo creada con éxito.')
      setError('')
    } catch (err) {
      setError('Error al crear la solicitud de préstamo.')
      setMessage('')
    }
  }

  return (
    <div className="form-section">
      <h2>Aplicar a Préstamo</h2>
      <form onSubmit={handleSubmit}>
        <label>Tipo de Préstamo *</label>
        <select 
          name="tipoPrestamo" 
          value={formData.tipoPrestamo} 
          onChange={handleChange}
        >
          <option value="PRIMERA VIVIENDA">Primera Vivienda</option>
          <option value="SEGUNDA VIVIENDA">Segunda Vivienda</option>
          <option value="PROPIEDADES COMERCIALES">Propiedades Comerciales</option>
          <option value="REMODELACIÓN">Remodelación</option>
        </select>

        <label>Monto Solicitado *</label>
        <input 
          type="number" 
          name="montoSolicitado" 
          value={formData.montoSolicitado} 
          onChange={handleChange} 
          required 
        />

        <label>Plazo (años) *</label>
        <input 
          type="number" 
          name="plazoSolicitado" 
          value={formData.plazoSolicitado} 
          onChange={handleChange} 
          required 
        />

        <label>Tasa de Interés (%) *</label>
        <input 
          type="number" 
          name="tasaInteres" 
          value={formData.tasaInteres} 
          onChange={handleChange}
          required
        />

        <label>Valor de la Propiedad</label>
        <input 
          type="number" 
          name="valorPropiedad" 
          value={formData.valorPropiedad} 
          onChange={handleChange}
        />

        <label>Comprobante Avaluo *</label>
        <input 
          type="file" 
          onChange={(e) => handleFileChange(e, setAvaluoFile)} 
          required
        />

        <label>Comprobante Ingresos *</label>
        <input 
          type="file" 
          onChange={(e) => handleFileChange(e, setIngresosFile)} 
          required
        />

        <label>Nombre Completo (dueño de la solicitud) *</label>
        <input 
          type="text" 
          name="nombreCompleto" 
          value={formData.nombreCompleto} 
          onChange={handleChange} 
          required
        />

        <button type="submit" className="btn-primary">
          Crear Solicitud
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default LoanApplication
