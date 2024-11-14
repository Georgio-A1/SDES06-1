import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CriarEdital = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_bolsa: '',
    descricao: '',
    criterios_elegibilidade: '',
    periodo_letivo: '',
    data_inicio_inscricao: '',
    data_fim_inscricao: '',
    maximo_alunos_aprovados: '',
    perguntas: [],
    documentos_exigidos: [],
  });

  // Funções para manipular perguntas e documentos
  const handleAddPergunta = () => {
    setFormData((prevState) => ({
      ...prevState,
      perguntas: [...prevState.perguntas, { texto: '', tipo: 'texto_curto', obrigatorio: false }],
    }));
  };

  const handleRemovePergunta = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      perguntas: prevState.perguntas.filter((_, i) => i !== index),
    }));
  };

  const handlePerguntaChange = (index, field, value) => {
    const updatedPerguntas = [...formData.perguntas];
    updatedPerguntas[index][field] = value;
    setFormData({ ...formData, perguntas: updatedPerguntas });
  };

  const handleAddDocumento = () => {
    setFormData((prevState) => ({
      ...prevState,
      documentos_exigidos: [...prevState.documentos_exigidos, { nome: '', descricao: '', obrigatorio: false }],
    }));
  };

  const handleRemoveDocumento = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      documentos_exigidos: prevState.documentos_exigidos.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentoChange = (index, field, value) => {
    const updatedDocumentos = [...formData.documentos_exigidos];
    updatedDocumentos[index][field] = value;
    setFormData({ ...formData, documentos_exigidos: updatedDocumentos });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar se a data de fim é posterior à data de início
    if (new Date(formData.data_fim_inscricao) < new Date(formData.data_inicio_inscricao)) {
      alert("A data de fim da inscrição não pode ser anterior à data de início.");
      return; // Parar o envio do formulário
    }
  
    try {
      await axios.post('http://localhost:5000/api/editais/cadastrar', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Edital criado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao criar edital:', error);
      alert('Houve um erro ao criar o edital.');
    }
  };

  return (
    <div>
      <h2>Criar Novo Edital</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos do Edital */}
        <div>
          <label>Nome da Bolsa:</label>
          <input type="text" name="nome_bolsa" value={formData.nome_bolsa} onChange={handleChange} required />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} required></textarea>
        </div>

        <div>
          <label>Critérios de Elegibilidade:</label>
          <textarea name="criterios_elegibilidade" value={formData.criterios_elegibilidade} onChange={handleChange} required></textarea>
        </div>

        <div>
          <label>Período Letivo:</label>
          <input type="text" name="periodo_letivo" value={formData.periodo_letivo} onChange={handleChange} required />
        </div>

        <div>
          <label>Data de Início da Inscrição:</label>
          <input type="date" name="data_inicio_inscricao" value={formData.data_inicio_inscricao} onChange={handleChange} required />
        </div>

        <div>
          <label>Data de Fim da Inscrição:</label>
          <input type="date" name="data_fim_inscricao" value={formData.data_fim_inscricao} onChange={handleChange} required />
        </div>

        {/* Máximo de Alunos Aprovados */}
        <div>
          <label>Máximo de Alunos Aprovados (opcional):</label>
          <input type="number" name="maximo_alunos_aprovados" value={formData.maximo_alunos_aprovados} onChange={handleChange} />
        </div>

        {/* Perguntas Dinâmicas */}
        <div>
          <h3>Perguntas</h3>
          {formData.perguntas.map((pergunta, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Texto da pergunta"
                value={pergunta.texto}
                onChange={(e) => handlePerguntaChange(index, 'texto', e.target.value)}
                required
              />
              <select
                value={pergunta.tipo}
                onChange={(e) => handlePerguntaChange(index, 'tipo', e.target.value)}
                required
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
                  onChange={(e) => handlePerguntaChange(index, 'obrigatorio', e.target.checked)}
                />
                Obrigatório
              </label>
              <button type="button" onClick={() => handleRemovePergunta(index)}>Remover</button>
            </div>
          ))}
          <button type="button" onClick={handleAddPergunta}>Adicionar Pergunta</button>
        </div>

        {/* Documentos Exigidos Dinâmicos */}
        <div>
          <h3>Documentos Exigidos</h3>
          {formData.documentos_exigidos.map((documento, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Nome do documento"
                value={documento.nome}
                onChange={(e) => handleDocumentoChange(index, 'nome', e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição do documento"
                value={documento.descricao}
                onChange={(e) => handleDocumentoChange(index, 'descricao', e.target.value)}
                required
              ></textarea>
              <label>
                <input
                  type="checkbox"
                  checked={documento.obrigatorio}
                  onChange={(e) => handleDocumentoChange(index, 'obrigatorio', e.target.checked)}
                />
                Obrigatório
              </label>
              <button type="button" onClick={() => handleRemoveDocumento(index)}>Remover</button>
            </div>
          ))}
          <button type="button" onClick={handleAddDocumento}>Adicionar Documento</button>
        </div>

        {/* Botão de Submissão */}
        <button type="submit">Criar Edital</button>
      </form>
    </div>
  );
};

export default CriarEdital;
