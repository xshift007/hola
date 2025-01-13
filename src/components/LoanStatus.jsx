// src/components/LoanStatus.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllLoans, getLoansByUserName, deleteLoan } from '../services/loanService'
import '../styles/styles.css'

function LoanStatus() {
  const navigate = useNavigate(); // <-- Tiene que estar para navegar 
  const [loans, setLoans] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchName, setSearchName] = useState('')

  // Para controlar el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loanToDelete, setLoanToDelete] = useState(null)

  // Datos que el usuario debe ingresar para confirmar la eliminación
  const [confirmName, setConfirmName] = useState('')
  const [confirmID, setConfirmID] = useState('')

  useEffect(() => {
    fetchAllLoans()
  }, [])

  const fetchAllLoans = async () => {
    try {
      const data = await getAllLoans()
      setLoans(data)
    } catch (err) {
      setError('Error al obtener la lista de solicitudes.')
    }
  }

  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      fetchAllLoans()
      return
    }
    try {
      const filtered = await getLoansByUserName(searchName)
      setLoans(filtered)
      setMessage(`Mostrando solicitudes para el usuario: ${searchName}`)
      setError('')
    } catch (err) {
      setError(`No se encontraron solicitudes para "${searchName}" o ocurrió un error.`)
      setLoans([])
      setMessage('')
    }
  }

  const handleClearSearch = () => {
    setSearchName('')
    setMessage('')
    setError('')
    fetchAllLoans()
  }

  // Botón "Volver a Inicio"
  const handleGoHome = () => {
    navigate('/')
  }

  // Formateo de fecha, para que no se vea el formato "2025-01-11T18:44:46.716031"
  const formatDateTime = (isoString) => {
    if (!isoString) return '---'
    const date = new Date(isoString)
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ─────────────────────────────────────────────────────────
  // 1. Manejo del Modal de Eliminación
  // ─────────────────────────────────────────────────────────
  const handleShowDeleteModal = (loan) => {
    setLoanToDelete(loan)
    setConfirmName('')
    setConfirmID('')
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setLoanToDelete(null)
  }

  // ─────────────────────────────────────────────────────────
  // 2. Confirmar eliminación
  // ─────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!loanToDelete) return

    // Verificamos que el nombre y la identificación coincidan
    // con la información de la solicitud
    const usuario = loanToDelete.usuario
    if (!usuario) {
      // Si no hay usuario, mostramos error
      setError('No se pudo verificar el usuario de esta solicitud.')
      return
    }

    // Comparar confirmName e ID con los datos del loanToDelete
    const nameMatches = confirmName.trim().toLowerCase() === usuario.nombreCompleto.trim().toLowerCase()
    const idMatches = confirmID.trim() === (usuario.numeroIdentificacion || '').trim()

    if (!nameMatches || !idMatches) {
      alert('Los datos no coinciden. Asegúrate de ingresar tu nombre completo y número de identificación exactamente como en la solicitud.')
      return
    }

    // Si todo coincide, procedemos a eliminar la solicitud
    try {
      await deleteLoan(loanToDelete.idSolicitud)
      setMessage(`Solicitud #${loanToDelete.idSolicitud} eliminada con éxito.`)
      setError('')
      handleCloseDeleteModal()
      // Recargamos la lista
      fetchAllLoans()
    } catch (err) {
      setError('Error al eliminar la solicitud.')
    }
  }

  return (
    <div>
      <h2>Estado de Solicitudes</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-section" style={{ marginBottom: '1.5rem' }}>
        <label>Búsqueda por nombre de usuario</label>
        <input 
          type="text"
          placeholder="Ej: Juan Pérez"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={handleSearchByName} className="btn-primary">
            Buscar
          </button>
          <button 
            onClick={handleClearSearch} 
            className="btn-primary" 
            style={{ backgroundColor: '#6c757d' }}
          >
            Limpiar
          </button>
          <button
            className="btn-primary"
            style={{ backgroundColor: '#17a2b8' }}
            onClick={handleGoHome}
          >
            Volver a Inicio
          </button>
          
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Usuario</th>
              <th>Tipo Préstamo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha Solicitud</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.idSolicitud}>
                <td>{loan.idSolicitud}</td>
                <td>{loan.usuario?.nombreCompleto || 'N/D'}</td>
                <td>{loan.tipoPrestamo}</td>
                <td>{loan.montoSolicitado}</td>
                <td>{loan.estadoSolicitud}</td>
                <td>{formatDateTime(loan.fechaSolicitud)}</td>
                <td>
                  <button
                    className="btn-primary"
                    style={{ backgroundColor: '#dc3545' }} // rojo
                    onClick={() => handleShowDeleteModal(loan)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && loanToDelete && (
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
            <h3>Eliminar Solicitud #{loanToDelete.idSolicitud}</h3>
            <p>
              Para confirmar la eliminación de la solicitud, <br />
              ingresa tu <strong>Nombre Completo</strong> y <strong>tu Número de Identificación</strong>:
            </p>
            <label>Nombre Completo</label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              style={{ marginBottom: '0.5rem', width: '100%' }}
            />

            <label>Número de Identificación</label>
            <input
              type="text"
              value={confirmID}
              onChange={(e) => setConfirmID(e.target.value)}
              style={{ marginBottom: '0.5rem', width: '100%' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={handleCloseDeleteModal}
                className="btn-primary"
                style={{ backgroundColor: '#6c757d' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-primary"
                style={{ backgroundColor: '#dc3545' }}
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default LoanStatus
