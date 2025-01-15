// src/components/LoanEvaluation.jsx
import React, { useEffect, useState } from 'react'
import { getAllLoans, evaluateLoan, changeLoanStatus } from '../services/loanService'
import { useNavigate } from 'react-router-dom'
import '../styles/styles.css'

function LoanEvaluation() {
  // Estado para login simulado
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })

  // Estados principales
  const [loans, setLoans] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newStatuses, setNewStatuses] = useState({})
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const navigate = useNavigate()

  // ─────────────────────────────────────────────────────────
  // 1. LOGIN SIMPLIFICADO (si ya lo tenías)
  // ─────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = () => {
    // credenciales fijas: usuario = "ejecutivo" y pass = "1234"
    if (loginData.username === 'ejecutivo' && loginData.password === '1234') {
      setIsAuthenticated(true)
    } else {
      alert('Credenciales inválidas. Use usuario "ejecutivo" y contraseña "1234".')
    }
  }

  // ─────────────────────────────────────────────────────────
  // 2. Cargar Solicitudes
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchLoans()
    }
    // eslint-disable-next-line
  }, [isAuthenticated])

  const fetchLoans = async () => {
    try {
      const data = await getAllLoans()
      setLoans(data)
    } catch (err) {
      setError('Error al obtener la lista de solicitudes.')
    }
  }

  // ─────────────────────────────────────────────────────────
  // 3. Evaluar Solicitud
  // ─────────────────────────────────────────────────────────
  const handleEvaluate = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de evaluar esta solicitud?')
    if (!confirmed) return

    try {
      const result = await evaluateLoan(id)
      setMessage(result) // "La solicitud ha sido APROBADA" o "RECHAZADA"
      setError('')
      fetchLoans()
      // Ejemplo: no redirigir automáticamente, 
      // sino sólo mostrar el mensaje o redirigir si deseas
    } catch (err) {
      setError('Error al evaluar la solicitud.')
      setMessage('')
    }
  }

  // ─────────────────────────────────────────────────────────
  // 4. Actualizar Estado Manualmente
  // ─────────────────────────────────────────────────────────
  const handleChangeStatus = async (loanId) => {
    const statusToUpdate = newStatuses[loanId]
    if (!statusToUpdate) {
      alert('Por favor ingresa el nuevo estado.')
      return
    }
    const confirmed = window.confirm(`¿Seguro de cambiar el estado a "${statusToUpdate}"?`)
    if (!confirmed) return

    try {
      const updated = await changeLoanStatus(loanId, statusToUpdate)
      setMessage(`Estado actualizado a: ${updated.estadoSolicitud}`)
      setError('')
      fetchLoans()
    } catch (err) {
      setError('Error al cambiar el estado de la solicitud.')
      setMessage('')
    }
  }

  const handleStatusInputChange = (loanId, newValue) => {
    setNewStatuses({
      ...newStatuses,
      [loanId]: newValue
    })
  }

  // ─────────────────────────────────────────────────────────
  // 5. Ver Detalles (Modal)
  // ─────────────────────────────────────────────────────────
  const handleShowDetails = (loan) => {
    setSelectedLoan(loan)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setSelectedLoan(null)
    setShowDetails(false)
  }

  // ─────────────────────────────────────────────────────────
  // 6. Botón "Volver a Inicio"
  // ─────────────────────────────────────────────────────────
  const handleGoHome = () => {
    navigate('/')
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDERIZADO
  // ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    // Vista de login si no está autenticado
    return (
      <div className="form-section" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h2>Acceso Restringido</h2>
        <p style={{ marginBottom: '1rem' }}>
          Solo personal ejecutivo puede evaluar solicitudes.<br />
          (Usuario: <strong>ejecutivo</strong>, Contraseña: <strong>1234</strong>)
        </p>
        <label>Usuario</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleInputChange}
          placeholder="ejecutivo"
        />
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
          placeholder="1234"
        />
        <div style={{ marginTop: '1rem' }}>
          <button 
            className="btn-primary" 
            style={{ backgroundColor: '#17a2b8', marginLeft: '1rem' }}
            onClick={handleGoHome}
          >
            Volver a Inicio
          </button>
          {' '}
          <button onClick={handleLogin} className="btn-primary">
            Ingresar
          </button>
          
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar la tabla y el resto:
  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>Evaluación de Solicitudes</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn-primary" 
          style={{ backgroundColor: '#17a2b8' }}
          onClick={handleGoHome}
        >
          Volver a Inicio
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo Préstamo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Evaluar</th>
              <th>Nuevo Estado</th>
              <th>Actualizar Estado</th>
              <th>Detalles</th>
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
                    disabled={loan.estadoSolicitud === 'E6_APROBADA' || loan.estadoSolicitud === 'E7_RECHAZADA'}
                    className="btn-primary"
                  >
                    Evaluar
                  </button>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Ej: E2_PENDIENTE_DOCUMENTACION"
                    value={newStatuses[loan.idSolicitud] || ''}
                    onChange={(e) => handleStatusInputChange(loan.idSolicitud, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleChangeStatus(loan.idSolicitud)}
                    className="btn-primary"
                  >
                    Actualizar
                  </button>
                </td>
                <td>
                  <span
                    onClick={() => handleShowDetails(loan)}
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Ver Detalles"
                  >
                    🔍
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver detalles */}
      {showDetails && selectedLoan && (
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
              margin: '5% auto',
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '4px',
              position: 'relative'
            }}
          >
            <h3>Detalles de la Solicitud #{selectedLoan.idSolicitud}</h3>
            <p><strong>Tipo Préstamo:</strong> {selectedLoan.tipoPrestamo}</p>
            <p><strong>Monto Solicitado:</strong> {selectedLoan.montoSolicitado}</p>
            <p><strong>Estado Actual:</strong> {selectedLoan.estadoSolicitud}</p>
            <p><strong>Tasa Interés:</strong> {selectedLoan.tasaInteres}</p>
            <p><strong>Valor de Propiedad:</strong> {selectedLoan.valorPropiedad}</p>
            {/* ... más campos si quieres ... */}

            <button
              onClick={handleCloseDetails}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanEvaluation
