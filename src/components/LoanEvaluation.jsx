// src/components/LoanEvaluation.jsx
import React, { useEffect, useState } from 'react'
import { getAllLoans, evaluateLoan } from '../services/loanService'
import '../styles/styles.css'

function LoanEvaluation() {
  const [loans, setLoans] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

  const handleEvaluate = async (id) => {
    try {
      const result = await evaluateLoan(id) 
      // "La solicitud ha sido APROBADA" o "RECHAZADA"
      setMessage(result)
      setError('')
      fetchLoans()
    } catch (err) {
      setError('Error al evaluar la solicitud.')
      setMessage('')
    }
  }

  return (
    <div>
      <h2>Evaluación de Solicitudes</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo Préstamo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.idSolicitud}>
                <td>{loan.idSolicitud}</td>
                <td>{loan.tipoPrestamo}</td>
                <td>{loan.montoSolicitado}</td>
                <td>{loan.estadoSolicitud}</td>
                <td>
                  <button
                    onClick={() => handleEvaluate(loan.idSolicitud)}
                    disabled={
                      loan.estadoSolicitud === 'E6_APROBADA' || 
                      loan.estadoSolicitud === 'E7_RECHAZADA'
                    }
                    className="btn-primary"
                  >
                    Evaluar
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

export default LoanEvaluation
