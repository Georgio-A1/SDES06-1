import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditarEdital = () => {
  const { id } = useParams();
  const [edital, setEdital] = useState({
    nome_bolsa: '',
    descricao: '',
    criterios_elegibilidade: '',
    periodo_letivo: '',
    data_inicio_inscricao: '',
    data_fim_inscricao: '',
    maximo_alunos_aprovados: 0,
    documentos_exigidos: [],
    status: '',
    perguntas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEdital = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/editais/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar edital');
        const data = await response.json();

        setEdital({
          nome_bolsa: data.nome_bolsa || '',
          descricao: data.descricao || '',
          criterios_elegibilidade: data.criterios_elegibilidade || '',
          periodo_letivo: data.periodo_letivo || '',
          data_inicio_inscricao: data.data_inicio_inscricao?.$date
            ? new Date(data.data_inicio_inscricao.$date).toISOString().slice(0, 10)
            : '',
          data_fim_inscricao: data.data_fim_inscricao?.$date
            ? new Date(data.data_fim_inscricao.$date).toISOString().slice(0, 10)
            : '',
          maximo_alunos_aprovados: data.maximo_alunos_aprovados || 0,
          documentos_exigidos: Array.isArray(data.documentos_exigidos) ? data.documentos_exigidos : [],
          status: data.status || '',
          perguntas: Array.isArray(data.perguntas) ? data.perguntas : []
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEdital();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdital((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPergunta = () => {
    setEdital({
      ...edital,
      perguntas: [...edital.perguntas, { texto: '', tipo: 'texto_curto', obrigatorio: false, opcoes: [] }],
    });
  };

  const removePergunta = (index) => {
    const novasPerguntas = edital.perguntas.filter((_, i) => i !== index);
    setEdital({
      ...edital,
      perguntas: novasPerguntas,
    });
  };

  const addDocumento = () => {
    setEdital({
      ...edital,
      documentos_exigidos: [...edital.documentos_exigidos, { nome: '', descricao: '' }],
    });
  };

  const removeDocumento = (index) => {
    const novosDocumentos = edital.documentos_exigidos.filter((_, i) => i !== index);
    setEdital({
      ...edital,
      documentos_exigidos: novosDocumentos,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/editais/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edital),
      });

      if (!response.ok) throw new Error('Erro ao salvar as alterações');
      alert('Edital atualizado com sucesso!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Editar Edital</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Nome da Bolsa</label>
          <input
            type="text"
            name="nome_bolsa"
            value={edital.nome_bolsa}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={edital.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Critérios de Elegibilidade</label>
          <textarea
            name="criterios_elegibilidade"
            value={edital.criterios_elegibilidade}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Período Letivo</label>
          <input
            type="text"
            name="periodo_letivo"
            value={edital.periodo_letivo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Data de Início da Inscrição</label>
          <input
            type="date"
            name="data_inicio_inscricao"
            value={edital.data_inicio_inscricao}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Data de Fim da Inscrição</label>
          <input
            type="date"
            name="data_fim_inscricao"
            value={edital.data_fim_inscricao}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Máximo de Alunos Aprovados</label>
          <input
            type="number"
            name="maximo_alunos_aprovados"
            value={edital.maximo_alunos_aprovados}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Status</label>
          <input
            type="text"
            name="status"
            value={edital.status}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Documentos Exigidos</label>
          {edital.documentos_exigidos.map((documento, index) => (
            <div key={documento._id?.$oid || index}>
              <input
                type="text"
                value={documento.nome}
                onChange={(e) => {
                  const novosDocumentos = [...edital.documentos_exigidos];
                  novosDocumentos[index].nome = e.target.value;
                  setEdital({ ...edital, documentos_exigidos: novosDocumentos });
                }}
                placeholder={`Documento ${index + 1}`}
              />
              <input
                type="text"
                value={documento.descricao || ''}
                onChange={(e) => {
                  const novosDocumentos = [...edital.documentos_exigidos];
                  novosDocumentos[index].descricao = e.target.value;
                  setEdital({ ...edital, documentos_exigidos: novosDocumentos });
                }}
                placeholder="Descrição do Documento"
              />
              <button type="button" onClick={() => removeDocumento(index)}>Remover</button>
            </div>
          ))}
          <button type="button" onClick={addDocumento}>Adicionar Documento</button>
        </div>

        <div>
          <label>Perguntas</label>
          {edital.perguntas.map((pergunta, index) => (
            <div key={pergunta._id?.$oid || index}>
              <input
                type="text"
                value={pergunta.texto}
                onChange={(e) => {
                  const novasPerguntas = [...edital.perguntas];
                  novasPerguntas[index].texto = e.target.value;
                  setEdital({ ...edital, perguntas: novasPerguntas });
                }}
                placeholder={`Pergunta ${index + 1}`}
              />
              <select
                value={pergunta.tipo}
                onChange={(e) => {
                  const novasPerguntas = [...edital.perguntas];
                  novasPerguntas[index].tipo = e.target.value;
                  setEdital({ ...edital, perguntas: novasPerguntas });
                }}
              >
                <option value="texto_curto">Texto Curto</option>
                <option value="texto_longo">Texto Longo</option>
                <option value="sim_nao">Sim/Não</option>
                <option value="numero">Número</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={pergunta.obrigatorio}
                  onChange={(e) => {
                    const novasPerguntas = [...edital.perguntas];
                    novasPerguntas[index].obrigatorio = e.target.checked;
                    setEdital({ ...edital, perguntas: novasPerguntas });
                  }}
                />
                Obrigatório
              </label>
              <button type="button" onClick={() => removePergunta(index)}>Remover</button>
            </div>
          ))}
          <button type="button" onClick={addPergunta}>Adicionar Pergunta</button>
        </div>

        <button type="submit">Salvar alterações</button>
      </form>
    </div>
  );
};

export default EditarEdital;
