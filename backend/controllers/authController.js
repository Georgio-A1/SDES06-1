const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const client = require('../config/db'); // Conexão com o banco
const { client } = require('../config/db');

// Função para realizar o login
const login = async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    try {
        // Consulta o banco de dados PostgreSQL para encontrar o usuário
        const result = await client.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const usuario = result.rows[0]; // Pega o primeiro (e único) usuário encontrado

        // Compara a senha informada com a senha armazenada (hash)
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo_usuario: usuario.tipo_usuario,
                nome_completo: usuario.nome_completo
            },
            process.env.JWT_SECRET, // Usando a variável do .env
            { expiresIn: '1h' } // O token expira em 1 hora
        );


        // Retorna o token para o frontend
        return res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    login,
};
