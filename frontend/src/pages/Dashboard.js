import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login'); // Se não houver token, redireciona para o login
    return null;
  }

  const decodedToken = jwtDecode(token); // Decodificando o token
  console.log(decodedToken);  // Verifique o conteúdo do token no console

  const tipoUsuario = decodedToken.tipo_usuario;
  const nome = decodedToken.nome_completo; // Pengando o nome do usuário do token para colocar no display

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage ao fazer logout
    navigate('/login'); // Redireciona para a página de login novamente
  };

  return (
    <div>
      <h1>Bem-vindo ao Dashboard, {nome}!</h1>
      
      {/* Botão de Logout */}
      <button onClick={handleLogout}>Logout</button>

      {/* Exibindo botões dependendo do tipo de usuário */}
      {tipoUsuario === 'Aluno' && (
        <div>
          <button onClick={() => navigate('/cadastrar-documentos')}>Cadastrar Documentos</button>
          <button onClick={() => navigate('/realizar-inscricao')}>Realizar Inscrição</button>
          <button onClick={() => navigate('/cancelar-inscricao')}>Cancelar Inscrição</button>
          <button onClick={() => navigate('/verificar-status')}>Verificar Status</button>
        </div>
      )}

      {tipoUsuario === 'Funcionario' && (
        <div>
          <button onClick={() => navigate('/avaliar-documentos')}>Avaliar Documentos</button>
          <button onClick={() => navigate('/avaliar-inscricao')}>Avaliar Inscrição</button>
        </div>
      )}

      {tipoUsuario === 'Administrador' && (
        <div>
          <button onClick={() => navigate('/criar-edital')}>Criar Edital</button>
          <button onClick={() => navigate('/editar-edital')}>Editar Edital</button>
          <button onClick={() => navigate('/excluir-edital')}>Excluir Edital</button>
          <button onClick={() => navigate('/cadastrar-usuario')}>Cadastrar Usuário</button>
          <button onClick={() => navigate('/avaliar-documentos')}>Avaliar Documentos</button>
          <button onClick={() => navigate('/avaliar-inscricao')}>Avaliar Inscrição</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
