// backend/models/Usuario.js
const client = require('../config/db');  // Importa o cliente do PostgreSQL
const bcrypt = require('bcrypt');  // Para criptografar a senha

// Função para cadastrar um novo usuário
const cadastrarUsuario = async ({ cpf, email, nome_completo, matricula, numero_celular, endereco, senha, tipo_usuario }) => {
  // Verifica se o CPF já existe
  const checkCpfQuery = 'SELECT * FROM usuarios WHERE cpf = $1';
  const cpfExistente = await client.query(checkCpfQuery, [cpf]);
  if (cpfExistente.rows.length > 0) {
    throw new Error('CPF já cadastrado.');
  }

  // Criptografa a senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Insere o novo usuário na tabela
  const insertQuery = `
    INSERT INTO usuarios (cpf, email, nome_completo, matricula, numero_celular, endereco, senha, tipo_usuario)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, cpf, email, nome_completo, matricula, tipo_usuario;
  `;

  const result = await client.query(insertQuery, [
    cpf,
    email,
    nome_completo,
    matricula,
    numero_celular,
    endereco,
    senhaHash,
    tipo_usuario,
  ]);

  return result.rows[0];  // Retorna os dados do usuário recém-criado
};

module.exports = { cadastrarUsuario };
