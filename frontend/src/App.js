import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CadastrarUsuario from './pages/CadastrarUsuario';
import CriarEdital from './pages/CriarEdital';
import ExcluirEdital from './pages/ExcluirEdital';
import EditarEdital from './pages/EditarEdital';
import ListaEditais from './pages/ListaEditais';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        <Route path="/criar-edital" element={<CriarEdital />} />
        <Route path="/excluir-edital" element={<ExcluirEdital />} />

        <Route path="/editar-edital" element={<ProtectedRoute element={<ListaEditais />} />} />
        
        <Route path="/editar-edital/:id" element={<ProtectedRoute element={<EditarEdital />} />} />

      
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
