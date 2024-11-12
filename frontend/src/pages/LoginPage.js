// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário
    const handleLogin = async (e) => {
        e.preventDefault();

        // Validação simples
        if (!cpf || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        // Fazendo a requisição de login para o backend
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cpf, senha }),
            });

            const data = await response.json();
            //console.log(data); // Verificando a resposta

            if (response.ok) {
                // Se o login for bem-sucedido, armazena o token no localStorage
                localStorage.setItem('token', data.token);

                // Redireciona para o dashboard
                navigate('/dashboard');
            } else {
                // Se ocorrer um erro no login
                setErro(data.message || 'Erro no login. Tente novamente.');
            }
        } catch (err) {
            setErro('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {erro && <p className="error-message">{erro}</p>}
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="cpf">CPF</label>
                    <input
                        type="text"
                        id="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Digite seu CPF"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Digite sua senha"
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;
