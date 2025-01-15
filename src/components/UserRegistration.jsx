// src/components/UserRegistration.jsx
import React, { useState } from 'react'
import { registerUser } from '../services/userService'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBroom, FaTrash } from 'react-icons/fa' // Importamos los iconos necesarios
import '../styles/styles.css'

function UserRegistration() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    fechaNacimiento: '',
    tipoIdentificacion: 'CEDULA',  // "CEDULA" o "PASAPORTE"
    numeroIdentificacion: '',
    estadoCivil: 'SOLTERO',        // "SOLTERO", "CASADO", "DIVORCIADO", "VIUDO"
    direccion: '',
    numeroTelefono: '',            // se requerirá +56 9 y 8 dígitos
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
  const [showModal, setShowModal] = useState(false)

  // ─────────────────────────────────────────────────────────────────
  // Funciones de Validación/Utilidad
  // ─────────────────────────────────────────────────────────────────

  // Valida que sea mayor de edad
  const esMayorDeEdad = (fechaString) => {
    if (!fechaString) return false
    const hoy = new Date()
    const fechaNac = new Date(fechaString)
    let edad = hoy.getFullYear() - fechaNac.getFullYear()
    const m = hoy.getMonth() - fechaNac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--
    }
    return edad >= 18
  }

  // Formatear montos (ingresos, deudas) a "$ X.YYY"
  const formatMoney = (value) => {
    if (!value) return ''
    let numeric = value.replace(/\D/g, '') // quita todo excepto dígitos
    if (!numeric) return ''
    let number = parseInt(numeric, 10)
    return '$ ' + number.toLocaleString('es-CL') 
  }

  // Validar teléfono +56 9 ########
  const validarTelefono = (valor) => {
    // Aceptamos solamente si comienza con +56 9
    // y luego 8 dígitos. Ej: +56 9 12345678
    const regex = /^\+56 9 \d{8}$/
    return regex.test(valor)
  }

  // Formatear RUT (si tipoIdentificacion="CEDULA") o algo más
  const formatearRut = (rut) => {
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

  // ─────────────────────────────────────────────────────────────────
  // Manejo de cambios en el formulario
  // ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    let { name, value } = e.target

    // Si es "numeroIdentificacion" y "tipoIdentificacion" = "CEDULA", formatear
    if (name === 'numeroIdentificacion' && formData.tipoIdentificacion === 'CEDULA') {
      value = formatearRut(value)
    }

    setFormData({
      ...formData,
      [name]: value
    })
    setError('') // limpiar error al cambiar
  }

  const handleMoneyChange = (fieldName, e) => {
    // formatear al escribir
    let sinFormatear = e.target.value.replace(/\D/g, '') // solo dígitos
    setFormData({ ...formData, [fieldName]: sinFormatear })
  }

  // ─────────────────────────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que sea mayor de edad
    if (!esMayorDeEdad(formData.fechaNacimiento)) {
      setError('Debe ser mayor de 18 años para registrarse.')
      return
    }

    // Validar teléfono +56 9 ########
    if (!validarTelefono(formData.numeroTelefono)) {
      setError('El número de teléfono debe tener el formato: +56 9 12345678')
      return
    }

    // Validar campos obligatorios (p.ejemplo)
    if (!formData.nombreCompleto || !formData.fechaNacimiento || !formData.tipoIdentificacion ||
        !formData.numeroIdentificacion || !formData.estadoCivil || !formData.direccion ||
        !formData.numeroTelefono || !formData.correoElectronico || !formData.ingresosMensuales ||
        !formData.antiguedadLaboral) {
      setError('Por favor completa todos los campos obligatorios (*).')
      return
    }

    const confirmed = window.confirm('¿Estás seguro de registrar este usuario?')
    if (!confirmed) return

    try {
      // Convertir los montos "formateados" a BigDecimal o string plano
      let payload = {
        ...formData,
        ingresosMensuales: formData.ingresosMensuales ? parseInt(formData.ingresosMensuales, 10) : 0,
        saldoCuentaAhorros: formData.saldoCuentaAhorros ? parseInt(formData.saldoCuentaAhorros, 10) : 0,
        deudasActuales: formData.deudasActuales ? parseInt(formData.deudasActuales, 10) : 0
      }

      // Llamar al servicio
      const usuarioCreado = await registerUser(payload)
      setMessage('¡Usuario registrado con éxito!')
      setError('')
      setShowModal(true)
    } catch (err) {
      setError('Error al registrar usuario.')
      setMessage('')
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // Botones (Limpiar, Volver, etc.)
  // ─────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setFormData({
      nombreCompleto: '',
      fechaNacimiento: '',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '',
      estadoCivil: 'SOLTERO',
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
    setError('')
    setMessage('')
    setShowModal(false)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleStayHere = () => {
    setShowModal(false)
  }

  const handleGoToLoanApplication = () => {
    setShowModal(false)
    navigate('/loan-application')
  }

  // ─────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="form-section">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        
        <label>Nombre Completo *</label>
        <input 
          type="text" 
          name="nombreCompleto" 
          placeholder="Ej: Juan Alberto Pérez"
          value={formData.nombreCompleto}
          onChange={handleChange}
        />

        <label>Fecha de Nacimiento *</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
        />

        <label>Tipo de Identificación *</label>
        <select
          name="tipoIdentificacion"
          value={formData.tipoIdentificacion}
          onChange={handleChange}
        >
          <option value="CEDULA">Cédula de Identidad</option>
          <option value="PASAPORTE">Pasaporte</option>
        </select>

        <label>Número de Identificación *</label>
        <input
          type="text"
          name="numeroIdentificacion"
          placeholder={formData.tipoIdentificacion === 'CEDULA' ? 'Ej: 12.345.678-9' : 'Ej: Passport123'}
          value={formData.numeroIdentificacion}
          onChange={handleChange}
        />

        <label>Estado Civil *</label>
        <select
          name="estadoCivil"
          value={formData.estadoCivil}
          onChange={handleChange}
        >
          <option value="SOLTERO">SOLTERO</option>
          <option value="CASADO">CASADO</option>
          <option value="DIVORCIADO">DIVORCIADO</option>
          <option value="VIUDO">VIUDO</option>
        </select>

        <label>Dirección *</label>
        <input
          type="text"
          name="direccion"
          placeholder="Ej: Avenida Siempre Viva #123"
          value={formData.direccion}
          onChange={handleChange}
        />

        <label>Número de Teléfono (+56 9 XXXXXXXX) *</label>
        <input
          type="text"
          name="numeroTelefono"
          placeholder="+56 9 12345678"
          value={formData.numeroTelefono}
          onChange={handleChange}
        />

        <label>Correo Electrónico *</label>
        <input
          type="email"
          name="correoElectronico"
          placeholder="usuario@ejemplo.cl"
          value={formData.correoElectronico}
          onChange={handleChange}
        />

        <label>Ingresos Mensuales *</label>
        <input
          type="text"
          name="ingresosMensuales"
          placeholder="$ 500.000"
          value={formatMoney(formData.ingresosMensuales)}
          onChange={(e) => handleMoneyChange('ingresosMensuales', e)}
        />

        <label>Tipo de Empleo *</label>
        <input
          type="text"
          name="tipoEmpleo"
          placeholder="Ej: Dependiente, Independiente, etc."
          value={formData.tipoEmpleo}
          onChange={handleChange}
        />

        <label>Antigüedad Laboral (años) *</label>
        <input
          type="number"
          name="antiguedadLaboral"
          placeholder="Ej: 3"
          value={formData.antiguedadLaboral}
          onChange={handleChange}
          min="0"
        />

        <label>Historial Crediticio *</label>
        <select
          name="historialCrediticio"
          value={formData.historialCrediticio}
          onChange={handleChange}
        >
          <option value="BUENO">BUENO</option>
          <option value="REGULAR">REGULAR</option>
          <option value="MALO">MALO</option>
        </select>

        <label>Capacidad de Ahorro *</label>
        <select
          name="capacidadAhorro"
          value={formData.capacidadAhorro}
          onChange={handleChange}
        >
          <option value="ADECUADA">ADECUADA</option>
          <option value="INSUFICIENTE">INSUFICIENTE</option>
        </select>

        <label>Saldo Cuenta Ahorros</label>
        <input
          type="text"
          name="saldoCuentaAhorros"
          placeholder="$ 1.000.000"
          value={formatMoney(formData.saldoCuentaAhorros)}
          onChange={(e) => handleMoneyChange('saldoCuentaAhorros', e)}
        />

        <label>Historial de Ahorro</label>
        <input
          type="text"
          name="historialAhorro"
          placeholder="Ej: Depósitos frecuentes"
          value={formData.historialAhorro}
          onChange={handleChange}
        />

        <label>Número de Dependientes</label>
        <input
          type="number"
          name="numeroDependientes"
          placeholder="Ej: 2"
          value={formData.numeroDependientes}
          onChange={handleChange}
          min="0"
        />

        <label>Deudas Actuales</label>
        <input
          type="text"
          name="deudasActuales"
          placeholder="$ 150.000"
          value={formatMoney(formData.deudasActuales)}
          onChange={(e) => handleMoneyChange('deudasActuales', e)}
        />

        {/* No solicitamos comprobanteIngresos aquí porque se maneja en la Solicitud, si se desea. */}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">
            Registrar
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleClear}
          >
            <FaBroom /> Limpiar
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#17a2b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleGoHome}
          >
            <FaArrowLeft /> Volver a Inicio
          </button>
        </div>
      </form>

      {message && !showModal && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Modal al registrarse */}
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
            <p>¿Deseas ir a la página de Aplicar Préstamo o permanecer aquí?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn-primary"
                style={{ backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={handleStayHere}
              >
                Permanecer <FaArrowLeft />
              </button>
              <button
                className="btn-primary"
                onClick={handleGoToLoanApplication}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Ir a Aplicar Préstamo <FaArrowLeft />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserRegistration
