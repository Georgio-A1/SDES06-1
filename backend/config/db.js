const { Client } = require('pg');  // Importa o cliente do PostgreSQL
const mongoose = require('mongoose');  // Importa o mongoose para MongoDB
require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env

// Configuração do cliente PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Função para conectar ao PostgreSQL
const connectDbPostgres = async () => {
  try {
    await client.connect();  // Realiza a conexão com o banco de dados PostgreSQL
    console.log('Conectado ao banco de dados PostgreSQL');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados PostgreSQL', err.stack);
    process.exit(1); // Encerra o processo caso não consiga conectar
  }
};

// Função para conectar ao MongoDB
const connectDbMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao banco de dados MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB', err);
    process.exit(1); // Encerra o processo caso não consiga conectar
  }
};

// Chama as funções de conexão para ambos os bancos de dados
const connectDatabases = async () => {
  await connectDbPostgres();
  await connectDbMongo();
};

connectDatabases();

// Exporta o cliente PostgreSQL e o Mongoose para uso em outros arquivos
module.exports = { client, mongoose };
