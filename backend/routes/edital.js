const express = require('express');
const router = express.Router();
const { cadastrarEdital, excluirEdital, listarEditais, editarEdital } = require('../controllers/editalController');
const Edital = require('../models/Edital');

// Rota para cadastrar edital
router.post('/cadastrar', cadastrarEdital);

// Rota para excluir edital
router.delete('/excluir/:id', excluirEdital);

// Rota para listar todos os editais
router.get('/listar', listarEditais);

// Rota para editar edital
router.put('/editar/:id', editarEdital); // Adicionando a rota para editar

// Rota para obter um edital específico pelo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('ID recebido na requisição:', id);  // Verificar se o ID é passado corretamente
        const edital = await Edital.findById(id);

        if (!edital) {
            return res.status(404).json({ error: 'Edital não encontrado.' });
        }

        res.json(edital);
    } catch (error) {
        console.error('Erro ao buscar edital:', error);
        res.status(500).json({ error: 'Erro ao buscar o edital.' });
    }
});



module.exports = router;
