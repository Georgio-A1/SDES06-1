// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const { cadastrarUsuario } = require('../controllers/userController');

// Rota para cadastrar usuário
router.post('/cadastrar', cadastrarUsuario);

module.exports = router;
