// src/components/LoanStatus.jsx
import React, { useState, useEffect } from 'react'
import { getAllLoans, changeLoanStatus } from '../services/loanService'
import '../styles/styles.css'

function LoanStatus() {
  const [loans, setLoans] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const data = await getAllLoans()
      setLoans(data)
    } catch (err) {
      setError('Error al obtener la lista de solicitudes.')
    }
  }

  const handleChangeStatus = async (id) => {
    if (!newStatus) {
      setError('Por favor ingresa el nuevo estado.')
      return
    }
    try {
      const updatedLoan = await changeLoanStatus(id, newStatus)
      setMessage(`Estado actualizado a: ${updatedLoan.estadoSolicitud}`)
      setError('')
      fetchLoans()
    } catch (err) {
      setError('Error al cambiar el estado de la solicitud.')
      setMessage('')
    }
  }

  return (
    <div>
      <h2>Estado de Solicitudes</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-section" style={{ marginBottom: '1.5rem' }}>
        <label>Nuevo Estado (ej: E2_PENDIENTE_DOCUMENTACION)</label>
        <input 
          type="text"
          placeholder="E2_PENDIENTE_DOCUMENTACION"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo Préstamo</th>
              <th>Estado Actual</th>
              <th>Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.idSolicitud}>
                <td>{loan.idSolicitud}</td>
                <td>{loan.tipoPrestamo}</td>
                <td>{loan.estadoSolicitud}</td>
                <td>
                  <button 
                    onClick={() => handleChangeStatus(loan.idSolicitud)} 
                    className="btn-primary"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LoanStatus
