// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth'); // Rota de autenticação
const usuariosRoutes = require('./routes/usuarios'); // Rota de usuários
const editalRoutes = require('./routes/edital'); // Rota de editais (nova)
require('dotenv').config();

app.use(cors());
app.use(express.json()); // Para processar JSON

// Rota de autenticação
app.use('/api/auth', authRoutes);  // Rota para login e outras ações de autenticação

// Rota de usuários
app.use('/api/usuarios', usuariosRoutes);  // Rota para cadastro e gerenciamento de usuários

// Rota de editais
app.use('/api/editais', editalRoutes);  // Rota para cadastrar e gerenciar editais

// Outras rotas...
app.get('/', (req, res) => {
  res.send('Bem-vindo à API!');
});

module.exports = app;
