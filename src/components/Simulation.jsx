// src/components/Simulation.jsx
import React, { useState } from 'react'
import { simulateLoan } from '../services/loanService'
import '../styles/styles.css'

function Simulation() {
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

  const handleChange = (e) => {
    setSimData({
      ...simData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!simData.montoDeseado || !simData.plazo || !simData.tasaInteres) {
      setError('Por favor llena los campos obligatorios.')
      setMessage('')
      return
    }
    try {
      const response = await simulateLoan({
        montoDeseado: parseFloat(simData.montoDeseado),
        plazo: parseInt(simData.plazo),
        tasaInteres: parseFloat(simData.tasaInteres),
        tipoPrestamo: simData.tipoPrestamo,
        seguros: parseFloat(simData.seguros) || 0,
        comisiones: parseFloat(simData.comisiones) || 0
      })
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
          type="number" 
          name="montoDeseado" 
          value={simData.montoDeseado} 
          onChange={handleChange}
        />

        <label>Plazo (años) *</label>
        <input 
          type="number" 
          name="plazo" 
          value={simData.plazo} 
          onChange={handleChange}
        />

        <label>Tasa de Interés (%) *</label>
        <input 
          type="number" 
          name="tasaInteres" 
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
          type="number" 
          name="seguros" 
          value={simData.seguros} 
          onChange={handleChange}
        />

        <label>Comisiones (opcional)</label>
        <input 
          type="number" 
          name="comisiones" 
          value={simData.comisiones} 
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary">
          Simular
        </button>
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
