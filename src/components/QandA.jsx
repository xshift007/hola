// src/components/QandA.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/styles.css'

function QandA() {
  const navigate = useNavigate()

  return (
    <div 
      className="form-section" 
      style={{ marginBottom: '2rem' }}
    >
      <h2>Preguntas Frecuentes (Q&A)</h2>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>1. ¿Qué documentos necesito para aplicar a un préstamo?</h4>
        <p>
          Dependiendo del tipo de préstamo (Primera Vivienda, Segunda Vivienda, etc.), 
          generalmente se requiere un comprobante de ingresos, certificado de avalúo y 
          demás documentos indicados en la sección “Aplicar Préstamo”.
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>2. ¿Cuál es la tasa de interés para mi préstamo?</h4>
        <p>
          La tasa de interés varía según el tipo de préstamo y tu historial crediticio. 
          Consulta la opción “Simulación” para obtener una aproximación.
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>3. ¿Cómo puedo eliminar mi solicitud?</h4>
        <p>
          Dirígete a la sección “Estado de Solicitudes”. Allí encontrarás la opción de 
          eliminar tu solicitud si ya no la requieres; deberás confirmar tus datos para 
          mayor seguridad.
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>4. ¿Qué pasa si no cumplo con los requisitos?</h4>
        <p>
          Nuestra plataforma te informará si la solicitud es rechazada y te indicará el 
          motivo (edad mayor al límite, capacidad de ahorro insuficiente, etc.). Siempre 
          puedes regularizar tu situación e intentarlo de nuevo.
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>5. ¿Cómo sé el estado actual de mi solicitud?</h4>
        <p>
          En la sección “Estado de Solicitudes” verás cada solicitud y su estado (E1 a E9). 
          Además, podrás buscar por nombre de usuario para verificar el avance en tiempo real.
        </p>
      </div>

      {/* Botón volver a inicio (opcional) */}
      <div style={{ marginTop: '2rem' }}>
        <button
          className="btn-primary"
          style={{ backgroundColor: '#17a2b8' }}
          onClick={() => navigate('/')}
        >
          Volver a Inicio
        </button>
      </div>
    </div>
  )
}

export default QandA
