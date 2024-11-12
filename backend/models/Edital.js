const mongoose = require('mongoose');

const editalSchema = new mongoose.Schema({
  nome_bolsa: { type: String, required: true },
  descricao: { type: String, required: true },
  criterios_elegibilidade: { type: String, required: true },
  periodo_letivo: { type: String, required: true },
  data_inicio_inscricao: { type: Date, required: true },
  data_fim_inscricao: { type: Date, required: true },
  maximo_alunos_aprovados: { type: Number, default: null },
  documentos_exigidos: [{
    nome: { type: String, required: true }, // Nome do documento
    descricao: { type: String, required: true }, // Descrição do documento
  }],
  status: { type: String, default: 'ativo' },
  perguntas: [{
    texto: { type: String, required: true }, // Texto da pergunta
    tipo: { type: String, required: true }, // Tipo da pergunta
    campo: String, // Opcional: campo adicional, caso necessário
    opcoes: [String], // Opcional: usado para perguntas com opções, como Sim/Não
    obrigatorio: { type: Boolean, default: true },
  }],
});

module.exports = mongoose.model('Edital', editalSchema);
