// backend/models/Usuario.js
const client = require('../config/db'); // Importa o cliente do PostgreSQL
const bcrypt = require('bcrypt');

// Função para criptografar e salvar um novo usuário
const inserirUsuario = async ({ cpf, email, nome_completo, matricula, numero_celular, endereco, senha, tipo_usuario }) => {
  const senhaHash = await bcrypt.hash(senha, 10);
  
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

  return result.rows[0];
};

// Função para verificar se o CPF existe
const verificarCpf = async (cpf) => {
  const checkCpfQuery = 'SELECT * FROM usuarios WHERE cpf = $1';
  const result = await client.query(checkCpfQuery, [cpf]);
  return result.rows.length > 0;
};

module.exports = { inserirUsuario, verificarCpf };
