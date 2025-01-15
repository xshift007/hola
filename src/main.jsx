// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Importa tus estilos globales
import './index.css'
import './styles/styles.css' // Asegúrate de importar aquí tus estilos generales
// Importa bootstrap si lo necesitas
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
