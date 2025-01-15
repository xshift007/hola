// src/components/Simulation.jsx
import React, { useState } from 'react'
import { simulateLoan } from '../services/loanService'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBroom } from 'react-icons/fa' // Importamos los iconos necesarios
import '../styles/styles.css'

function Simulation() {
  const navigate = useNavigate()

  const [simData, setSimData] = useState({
    montoDeseado: '',
    plazo: '',
    tasaInteres: '',
    tipoPrestamo: 'PRIMERA VIVIENDA',
    seguros: '',
    comisiones: ''
  })

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Formateo de montos
  const formatMoney = (value) => {
    if (!value) return ''
    let numeric = value.replace(/\D/g, '')
    if (!numeric) return ''
    let number = parseInt(numeric, 10)
    return '$ ' + number.toLocaleString('es-CL')
  }

  const handleMoneyChange = (fieldName, e) => {
    let sinFormatear = e.target.value.replace(/\D/g, '')
    setSimData({ ...simData, [fieldName]: sinFormatear })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSimData({
      ...simData,
      [name]: value
    })
    setError('')
  }

  const handleClear = () => {
    setSimData({
      montoDeseado: '',
      plazo: '',
      tasaInteres: '',
      tipoPrestamo: 'PRIMERA VIVIENDA',
      seguros: '',
      comisiones: ''
    })
    setResult(null)
    setError('')
    setMessage('')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!simData.montoDeseado || !simData.plazo || !simData.tasaInteres) {
      setError('Por favor llena los campos obligatorios.')
      setMessage('')
      return
    }

    const confirmed = window.confirm('¿Deseas realizar esta simulación?')
    if (!confirmed) return

    try {
      let payload = {
        montoDeseado: simData.montoDeseado ? parseInt(simData.montoDeseado, 10) : 0,
        plazo: parseInt(simData.plazo, 10),
        tasaInteres: parseFloat(simData.tasaInteres),
        tipoPrestamo: simData.tipoPrestamo,
        seguros: simData.seguros ? parseInt(simData.seguros, 10) : 0,
        comisiones: simData.comisiones ? parseInt(simData.comisiones, 10) : 0
      }

      const response = await simulateLoan(payload)
      setResult(response)
      setError('')
      setMessage('Simulación exitosa.')
    } catch (err) {
      setError('Ocurrió un error en la simulación.')
      setMessage('')
      setResult(null)
    }
  }

  return (
    <div className="form-section">
      <h2>Simulación de Préstamo</h2>
      <form onSubmit={handleSubmit}>
        
        <label>Monto Deseado *</label>
        <input
          type="text"
          name="montoDeseado"
          placeholder="$ 3.000.000"
          value={formatMoney(simData.montoDeseado)}
          onChange={(e) => handleMoneyChange('montoDeseado', e)}
        />

        <label>Plazo (años) *</label>
        <input
          type="number"
          name="plazo"
          placeholder="Ej: 20"
          value={simData.plazo}
          onChange={handleChange}
        />

        <label>Tasa de Interés (%) *</label>
        <input
          type="number"
          step="0.1"
          name="tasaInteres"
          placeholder="Ej: 4.0"
          value={simData.tasaInteres}
          onChange={handleChange}
        />

        <label>Tipo de Préstamo</label>
        <select
          name="tipoPrestamo"
          value={simData.tipoPrestamo}
          onChange={handleChange}
        >
          <option value="PRIMERA VIVIENDA">Primera Vivienda</option>
          <option value="SEGUNDA VIVIENDA">Segunda Vivienda</option>
          <option value="PROPIEDADES COMERCIALES">Propiedades Comerciales</option>
          <option value="REMODELACIÓN">Remodelación</option>
        </select>

        <label>Costos de Seguros (opcional)</label>
        <input
          type="text"
          name="seguros"
          placeholder="$ 50.000"
          value={formatMoney(simData.seguros)}
          onChange={(e) => handleMoneyChange('seguros', e)}
        />

        <label>Comisiones (opcional)</label>
        <input
          type="text"
          name="comisiones"
          placeholder="$ 15.000"
          value={formatMoney(simData.comisiones)}
          onChange={(e) => handleMoneyChange('comisiones', e)}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#17a2b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleGoHome}
          >
            <FaArrowLeft /> Volver a Inicio
          </button>          
          
          
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleClear}
          >
            <FaBroom /> Limpiar
          </button>

          <button type="submit" className="btn-primary">
            Simular
          </button>
        </div>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {result && (
        <div
          style={{
            marginTop: '1rem',
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1rem'
          }}
        >
          <p><strong>Cuota Mensual:</strong> {result.cuotaMensual}</p>
          <p><strong>Total Pagado:</strong> {result.totalPagado}</p>
          <p><strong>Total Intereses:</strong> {result.totalIntereses}</p>
          <p><strong>Costos Adicionales:</strong> {result.costosAdicionales}</p>
          <p><strong>Total Final:</strong> {result.totalFinal}</p>
        </div>
      )}
    </div>
  )
}

export default Simulation
