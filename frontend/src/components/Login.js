// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { cpf, senha });
      localStorage.setItem('token', response.data.token);
      alert('Login realizado com sucesso!');
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Envia CPF e email para o backend para iniciar o processo de redefinição de senha
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { cpf, email });
      alert(response.data.message);
      setShowForgotPassword(false); // Fecha o formulário após o envio
    } catch (error) {
      alert('Erro ao solicitar redefinição de senha. Verifique suas informações.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      
      <button onClick={() => setShowForgotPassword(!showForgotPassword)}>
        Esqueceu a senha?
      </button>

      {showForgotPassword && (
        <form onSubmit={handleForgotPassword}>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Solicitar Redefinição de Senha</button>
        </form>
      )}
    </div>
  );
}

export default Login;
