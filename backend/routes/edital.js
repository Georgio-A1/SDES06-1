// backend/routes/edital.js
const express = require('express');
const router = express.Router();
const { cadastrarEdital } = require('../controllers/editalController');

// Rota para cadastro de edital
router.post('/cadastrar', cadastrarEdital);

module.exports = router;
