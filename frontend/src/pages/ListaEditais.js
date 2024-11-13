// src/pages/ListaEditais.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListaEditais = () => {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEditais = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/editais/listar');
        if (!response.ok) throw new Error('Erro ao carregar editais');
        const data = await response.json();
        setEditais(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEditais();
  }, []);

  if (loading) return <div>Carregando editais...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lista de Editais</h1>
      <ul>
        {editais.map((edital) => (
          <li key={edital._id}>
            {edital.nome_bolsa}
            <Link to={`/editar-edital/${edital._id}`}>Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEditais;
