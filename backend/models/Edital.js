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
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
  }],
  status: { type: String, default: 'ativo' },
  perguntas: [{
    texto: { type: String, required: true },
    tipo: { type: String, required: true },
    campo: String,
    opcoes: [String],
    obrigatorio: { type: Boolean, default: true },
  }],
}, { collection: 'editals' }); // Define a coleção explicitamente como 'editals'

module.exports = mongoose.model('Edital', editalSchema);
