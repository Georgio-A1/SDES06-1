// routes/auth.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

// Importar funções do controlador de autenticação
const { login, forgotPassword, respondPasswordRequest, resetPassword, getChamadosSenha } = require('../controllers/authController');

// Definir a rota POST para login
router.post('/login', login);

// Definir a rota POST para esquecimento de senha
router.post('/forgot-password', forgotPassword);

// Definir a rota POST para o administrador responder ao chamado de redefinição
router.post('/respond-password-request', authenticate, respondPasswordRequest);

// Definir a rota POST para o usuário redefinir sua senha
router.post('/reset-password', authenticate, resetPassword);

// Definir a rota GET para buscar chamados de redefinição de senha (apenas administradores)
router.get('/chamados-senha', authenticate, getChamadosSenha);

module.exports = router;
