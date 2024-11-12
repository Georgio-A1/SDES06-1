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

module.exports = { cadastrarEdital };
