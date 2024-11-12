// src/pages/CadastrarUsuario.js
import React, { useState } from 'react';

const CadastrarUsuario = () => {
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [matricula, setMatricula] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [endereco, setEndereco] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('Aluno'); // Tipo de usuário pode ser 'Aluno', 'Funcionario' ou 'Administrador', deixando Aluno como default

    // Função de envio do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifica se os campos obrigatórios estão preenchidos
        if (!cpf || !email || !nomeCompleto || !matricula || !senha) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Enviar os dados para o backend
        try {
            const response = await fetch('http://localhost:5000/api/usuarios/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cpf,
                    email,
                    nome_completo: nomeCompleto,
                    matricula,
                    numero_celular: numeroCelular,
                    endereco,
                    senha,
                    tipo_usuario: tipoUsuario,
                }),
            });


            if (response.ok) {
                alert('Usuário cadastrado com sucesso!');
                // Acho bom talvez redirecionar ou limpar o formulário dps tmb...
            } else {
                alert('Erro ao cadastrar usuário!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar usuário!');
        }
    };

    return (
        <div>
            <h2>Cadastrar Novo Usuário</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Matricula:</label>
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Número Celular:</label>
                    <input
                        type="text"
                        value={numeroCelular}
                        onChange={(e) => setNumeroCelular(e.target.value)}
                    />
                </div>
                <div>
                    <label>Endereço:</label>
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Tipo de Usuário:</label>
                    <select
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                    >
                        <option value="Aluno">Aluno</option>
                        <option value="Funcionario">Funcionário</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                </div>
                <button type="submit">Cadastrar Usuário</button>
            </form>
        </div>
    );
};

export default CadastrarUsuario;
