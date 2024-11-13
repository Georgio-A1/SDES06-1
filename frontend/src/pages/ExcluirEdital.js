import React, { useState, useEffect } from 'react';

const ExcluirEditais = () => {
  const [editais, setEditais] = useState([]);

  // Função para buscar todos os editais
  const fetchEditais = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/editais/listar');
      if (!response.ok) throw new Error('Erro ao buscar editais');
      const data = await response.json();
      setEditais(data);
    } catch (error) {
      console.error('Erro ao buscar editais:', error);
    }
  };

  const excluirEdital = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este edital?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/editais/excluir/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir edital');
  
      // Atualiza a lista de editais após exclusão
      setEditais(editais.filter((edital) => edital._id !== id));
      alert('Edital excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir edital:', error);
      alert('Erro ao excluir o edital');
    }
  };
  

  // Busca os editais ao carregar a página
  useEffect(() => {
    fetchEditais();
  }, []);

  return (
    <div>
      <h2>Excluir Editais</h2>
      <ul>
        {editais.map((edital) => (
          <li key={edital._id}>
            <span>{edital.nome_bolsa}</span>
            <button onClick={() => excluirEdital(edital._id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExcluirEditais;
