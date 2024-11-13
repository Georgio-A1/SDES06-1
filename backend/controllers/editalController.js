const Edital = require('../models/Edital');

const cadastrarEdital = async (req, res) => {
  const {
    nome_bolsa,
    descricao,
    criterios_elegibilidade,
    periodo_letivo,
    data_inicio_inscricao,
    data_fim_inscricao,
    maximo_alunos_aprovados,
    documentos_exigidos,
    perguntas,
  } = req.body;

  // Validação dos campos obrigatórios
  if (!nome_bolsa || !descricao || !criterios_elegibilidade || !periodo_letivo || !data_inicio_inscricao || !data_fim_inscricao) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  // Validação de documentos exigidos
  if (documentos_exigidos && documentos_exigidos.length > 0) {
    for (let i = 0; i < documentos_exigidos.length; i++) {
      const documento = documentos_exigidos[i];
      if (!documento.nome || !documento.descricao) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios para cada documento.' });
      }
    }
  }

  // Validação de perguntas
  if (perguntas && perguntas.length > 0) {
    for (let i = 0; i < perguntas.length; i++) {
      const pergunta = perguntas[i];
      if (!pergunta.texto || !pergunta.tipo) {
        return res.status(400).json({ error: 'Texto e tipo são obrigatórios para cada pergunta.' });
      }
    }
  }

  try {
    const novoEdital = new Edital({
      nome_bolsa,
      descricao,
      criterios_elegibilidade,
      periodo_letivo,
      data_inicio_inscricao,
      data_fim_inscricao,
      maximo_alunos_aprovados: maximo_alunos_aprovados || null, // Define como null se não fornecido
      documentos_exigidos,
      perguntas,
    });

    await novoEdital.save();
    res.status(201).json({ message: 'Edital cadastrado com sucesso!', edital: novoEdital });
  } catch (error) {
    console.error('Erro ao cadastrar edital:', error);
    res.status(500).json({ error: error.message || 'Erro ao cadastrar edital' });
  }
};

// Função para excluir edital
const excluirEdital = async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID do edital a ser excluído a partir dos parâmetros da URL
    const edital = await Edital.findByIdAndDelete(id);

    if (!edital) {
      return res.status(404).json({ error: 'Edital não encontrado.' });
    }

    res.json({ message: 'Edital excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir edital:', error);
    res.status(500).json({ error: 'Erro ao excluir edital.' });
  }
};

// Função para listar todos os editais
const listarEditais = async (req, res) => {
  try {
    const editais = await Edital.find(); // Busca todos os editais na coleção
    res.json(editais); // Retorna a lista de editais em formato JSON
  } catch (error) {
    console.error('Erro ao listar editais:', error);
    res.status(500).json({ error: 'Erro ao listar editais.' });
  }
};

// Função para editar um edital
const editarEdital = async (req, res) => {
  const { id } = req.params;
  const {
    nome_bolsa,
    descricao,
    criterios_elegibilidade,
    periodo_letivo,
    data_inicio_inscricao,
    data_fim_inscricao,
    maximo_alunos_aprovados,
    documentos_exigidos,
    perguntas,
  } = req.body;

  // Validação dos campos obrigatórios
  if (!nome_bolsa || !descricao || !criterios_elegibilidade || !periodo_letivo || !data_inicio_inscricao || !data_fim_inscricao) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  // Validação de documentos exigidos
  if (documentos_exigidos && documentos_exigidos.length > 0) {
    for (let i = 0; i < documentos_exigidos.length; i++) {
      const documento = documentos_exigidos[i];
      if (!documento.nome || !documento.descricao) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios para cada documento.' });
      }
    }
  }

  // Validação de perguntas
  if (perguntas && perguntas.length > 0) {
    for (let i = 0; i < perguntas.length; i++) {
      const pergunta = perguntas[i];
      if (!pergunta.texto || !pergunta.tipo) {
        return res.status(400).json({ error: 'Texto e tipo são obrigatórios para cada pergunta.' });
      }
    }
  }

  try {
    // Busca o edital pelo ID
    const edital = await Edital.findById(id);
    if (!edital) {
      return res.status(404).json({ error: 'Edital não encontrado.' });
    }

    // Atualiza as informações do edital
    edital.nome_bolsa = nome_bolsa;
    edital.descricao = descricao;
    edital.criterios_elegibilidade = criterios_elegibilidade;
    edital.periodo_letivo = periodo_letivo;
    edital.data_inicio_inscricao = data_inicio_inscricao;
    edital.data_fim_inscricao = data_fim_inscricao;
    edital.maximo_alunos_aprovados = maximo_alunos_aprovados || null;
    edital.documentos_exigidos = documentos_exigidos;
    edital.perguntas = perguntas;

    // Salva as alterações
    await edital.save();

    res.status(200).json({ message: 'Edital atualizado com sucesso!', edital });
  } catch (error) {
    console.error('Erro ao atualizar edital:', error);
    res.status(500).json({ error: 'Erro ao atualizar o edital.' });
  }
};

module.exports = { cadastrarEdital, excluirEdital, listarEditais, editarEdital };
