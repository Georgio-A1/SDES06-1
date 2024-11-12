// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // navegação

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirecionar para a página de login
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Auxílio Estudantil</h1>
      <p>Por favor, faça login para acessar sua conta.</p>
      <button onClick={handleLoginRedirect}>Ir para Login</button>
    </div>
  );
};

export default HomePage;
