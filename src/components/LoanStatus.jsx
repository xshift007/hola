// src/components/LoanStatus.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllLoans, getLoansByUserName, deleteLoan } from '../services/loanService'
import '../styles/styles.css'

function LoanStatus() {
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchName, setSearchName] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loanToDelete, setLoanToDelete] = useState(null)

  const [confirmName, setConfirmName] = useState('')
  const [confirmID, setConfirmID] = useState('') // Se formatea como RUT

  // Formatear dinero
  const formatMoney = (value) => {
    if (!value) return ''
    let numeric = value.toString().replace(/\D/g, '')
    if (!numeric) return ''
    let number = parseInt(numeric, 10)
    return '$ ' + number.toLocaleString('es-CL')
  }

  // Formatear RUT
  const formatRut = (rut) => {
    let limpio = rut.replace(/[^\dkK]/g, '').toUpperCase()
    if (limpio.length > 1) {
      let cuerpo = limpio.slice(0, -1)
      let dv = limpio.slice(-1)
      let formateado = ''
      while (cuerpo.length > 3) {
        formateado = '.' + cuerpo.slice(-3) + formateado
        cuerpo = cuerpo.slice(0, -3)
      }
      formateado = cuerpo + formateado + '-' + dv
      return formateado
    }
    return limpio
  }

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

  const handleGoHome = () => {
    navigate('/')
  }

  // Mostrar el modal
  const handleShowDeleteModal = (loan) => {
    setLoanToDelete(loan)
    setConfirmName('')
    setConfirmID('')
    setShowDeleteModal(true)
  }

  // Cerrar modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setLoanToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!loanToDelete) return

    const usuario = loanToDelete.usuario
    if (!usuario) {
      setError('No se pudo verificar el usuario de esta solicitud.')
      return
    }

    // Comparar confirmName e ID
    const nameMatches = confirmName.trim().toLowerCase() === usuario.nombreCompleto.trim().toLowerCase()
    const idMatches = confirmID.replace(/\./g, '').replace('-', '').trim().toLowerCase() === 
      (usuario.numeroIdentificacion || '').replace(/\./g, '').replace('-', '').trim().toLowerCase()

    if (!nameMatches || !idMatches) {
      alert('Los datos no coinciden. Asegúrate de ingresar tu nombre completo y número de identificación exactamente como en la solicitud.')
      return
    }

    try {
      await deleteLoan(loanToDelete.idSolicitud)
      setMessage(`Solicitud #${loanToDelete.idSolicitud} eliminada con éxito.`)
      setError('')
      handleCloseDeleteModal()
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
                <td>{formatMoney(loan.montoSolicitado)}</td>
                <td>{loan.estadoSolicitud}</td>
                <td>
                  {loan.fechaSolicitud 
                    ? new Date(loan.fechaSolicitud).toLocaleString('es-CL')
                    : '---'
                  }
                </td>
                <td>
                  <button
                    className="btn-primary"
                    style={{ backgroundColor: '#dc3545' }}
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
              ingresa tu <strong>Nombre Completo</strong> y <strong>tu Número de Identificación (RUT)</strong>:
            </p>
            <label>Nombre Completo</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              style={{ marginBottom: '0.5rem', width: '100%' }}
            />

            <label>Número de Identificación (RUT)</label>
            <input
              type="text"
              placeholder="12.345.678-9"
              value={confirmID}
              onChange={(e) => setConfirmID(formatRut(e.target.value))}
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
