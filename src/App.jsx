// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import UserRegistration from './components/UserRegistration'
import LoanApplication from './components/LoanApplication'
import LoanEvaluation from './components/LoanEvaluation'
import LoanStatus from './components/LoanStatus'
import Simulation from './components/Simulation'

import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/loan-evaluation" element={<LoanEvaluation />} />
            <Route path="/loan-status" element={<LoanStatus />} />
            <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </div>
        <footer className="footer">
          <p>© 2025 PrestaBanco - Todos los derechos reservados</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
