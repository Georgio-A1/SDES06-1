// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CadastrarUsuario from './pages/CadastrarUsuario';
import CriarEdital from './pages/CriarEdital';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const token = localStorage.getItem('token'); // Verifica se há um token JWT no localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        <Route path="/criar-edital" element={<CriarEdital />} />
      </Routes>
    </Router>
  );
}

export default App;
