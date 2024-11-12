const { Client } = require('pg');  // Importa o cliente do PostgreSQL
const mongoose = require('mongoose');  // Importa o mongoose para MongoDB
require('dotenv').config();        // Carrega as variáveis de ambiente do arquivo .env

// Configurações de conexão com o PostgreSQL
const client = new Client({
  user: process.env.DB_USER,       // Usuário do banco de dados (do .env)
  host: process.env.DB_HOST,       // Host do banco de dados (do .env)
  database: process.env.DB_DATABASE, // Nome do banco de dados (do .env)
  password: process.env.DB_PASSWORD, // Senha do banco de dados (do .env)
  port: process.env.DB_PORT,       // Porta do banco de dados (do .env)
});

// Configurações de conexão com o MongoDB
const mongoUri = process.env.MONGO_URI; // URL de conexão do MongoDB no arquivo .env

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
    await mongoose.connect(mongoUri);
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

// Exporta os clientes e funções de conexão para uso em outros arquivos
module.exports = {
  client, // Cliente PostgreSQL
  mongoose, // Mongoose para MongoDB
};
