const express = require('express');
const router = express.Router();

// Importar o controlador de autenticação (onde você define a lógica de login)
const { login } = require('../controllers/authController');

// Definir a rota POST para login
router.post('/login', login);

module.exports = router;
