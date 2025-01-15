// src/components/LoanApplication.jsx
import React, { useState } from 'react'
import { createLoanApplication } from '../services/loanService'
import { useNavigate } from 'react-router-dom'
import '../styles/styles.css'

function LoanApplication() {
  const navigate = useNavigate()

  const loanHints = {
    "PRIMERA VIVIENDA": {
      plazoMax: 30,
      tasaRange: "3.5% - 5.0%",
      montoFinMax: "80% del valor de la propiedad"
    },
    "SEGUNDA VIVIENDA": {
      plazoMax: 20,
      tasaRange: "4.0% - 6.0%",
      montoFinMax: "70% del valor de la propiedad"
    },
    "PROPIEDADES COMERCIALES": {
      plazoMax: 25,
      tasaRange: "5.0% - 7.0%",
      montoFinMax: "60% del valor de la propiedad"
    },
    "REMODELACIÓN": {
      plazoMax: 15,
      tasaRange: "4.5% - 6.0%",
      montoFinMax: "50% del valor actual de la propiedad"
    }
  }

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
  const [showModal, setShowModal] = useState(false)

  // Función para formatear dinero (similar a la de UserRegistration)
  const formatMoney = (value) => {
    if (!value) return ''
    let numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    let number = parseInt(numeric, 10)
    return '$ ' + number.toLocaleString('es-CL')
  }

  // Manejo de cambios para montos
  const handleMoneyChange = (name, e) => {
    let sinFormatear = e.target.value.replace(/\D/g, '')
    setFormData({
      ...formData,
      [name]: sinFormatear
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
  }

  // Botón "Limpiar"
  const handleClear = () => {
    setFormData({
      tipoPrestamo: 'PRIMERA VIVIENDA',
      montoSolicitado: '',
      plazoSolicitado: '',
      tasaInteres: '',
      valorPropiedad: '',
      nombreCompleto: ''
    })
    setAvaluoFile(null)
    setIngresosFile(null)
    setMessage('')
    setError('')
    setShowModal(false)
  }

  // Botón "Volver a Inicio"
  const handleGoHome = () => {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirmed = window.confirm('¿Deseas crear esta solicitud de préstamo?')
    if (!confirmed) return

    try {
      // Convertir los campos monetarios a int / string
      let payload = {
        ...formData,
        montoSolicitado: formData.montoSolicitado ? parseInt(formData.montoSolicitado, 10) : 0,
        valorPropiedad: formData.valorPropiedad ? parseInt(formData.valorPropiedad, 10) : 0
      }

      const multipartFormData = new FormData()
      multipartFormData.append('tipoPrestamo', payload.tipoPrestamo)
      multipartFormData.append('montoSolicitado', payload.montoSolicitado)
      multipartFormData.append('plazoSolicitado', payload.plazoSolicitado)
      multipartFormData.append('tasaInteres', payload.tasaInteres)
      multipartFormData.append('valorPropiedad', payload.valorPropiedad)
      multipartFormData.append('comprobanteAvaluo', avaluoFile)
      multipartFormData.append('comprobanteIngresos', ingresosFile)
      multipartFormData.append('nombreCompleto', payload.nombreCompleto)

      await createLoanApplication(multipartFormData)
      setMessage('Solicitud de préstamo creada con éxito.')
      setError('')
      setShowModal(true)
    } catch (err) {
      setError('Error al crear la solicitud de préstamo.')
      setMessage('')
    }
  }

  // Extraer "hint" según el tipo de préstamo seleccionado
  const selectedHint = loanHints[formData.tipoPrestamo]

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

        {/* Mostrar el "hint" correspondiente */}
        {selectedHint && (
          <div 
            style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '0.5rem', 
              marginBottom: '1rem', 
              borderRadius: '4px', 
              fontSize: '0.9rem'
            }}
          >
            <strong>Referencia:</strong> Plazo Máx: {selectedHint.plazoMax} años,
            Tasa Recomendada: {selectedHint.tasaRange},
            Monto Máx Fin: {selectedHint.montoFinMax}
          </div>
        )}

        <label>Monto Solicitado *</label>
        <input
          type="text"
          name="montoSolicitado"
          placeholder="$ 3.000.000"
          value={formatMoney(formData.montoSolicitado)}
          onChange={(e) => handleMoneyChange('montoSolicitado', e)}
          required
        />

        <label>Plazo (años) *</label>
        <input
          type="number"
          name="plazoSolicitado"
          placeholder="Ej: 15"
          value={formData.plazoSolicitado}
          onChange={handleChange}
          required
        />

        <label>Tasa de Interés (Anual) *</label>
        <input
          type="number"
          step="0.1"
          name="tasaInteres"
          placeholder="Ej: 4.5"
          value={formData.tasaInteres}
          onChange={handleChange}
          required
        />

        <label>Valor de la Propiedad</label>
        <input
          type="text"
          name="valorPropiedad"
          placeholder="$ 10.000.000"
          value={formatMoney(formData.valorPropiedad)}
          onChange={(e) => handleMoneyChange('valorPropiedad', e)}
        />

        <label>Comprobante de Avalúo *</label>
        <input
          type="file"
          onChange={(e) => setAvaluoFile(e.target.files[0])}
          required
        />

        <label>Comprobante de Ingresos *</label>
        <input
          type="file"
          onChange={(e) => setIngresosFile(e.target.files[0])}
          required
        />

        <label>Nombre Completo (dueño de la solicitud) *</label>
        <input
          type="text"
          name="nombreCompleto"
          placeholder="Ej: Juan Pérez"
          value={formData.nombreCompleto}
          onChange={handleChange}
          required
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">
            Crear Solicitud
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#6c757d' }}
            onClick={handleClear}
          >
            Limpiar
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#17a2b8' }}
            onClick={handleGoHome}
          >
            Volver a Inicio
          </button>
        </div>
      </form>

      {message && !showModal && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

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
            <p>¿Deseas ir a Estado de Solicitudes o permanecer aquí?</p>
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
                onClick={handleGoToLoanStatus}
              >
                Ir a Estado de Solicitudes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanApplication
