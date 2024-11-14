// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { client } = require('../config/db'); // Conexão com o PostgreSQL
const nodemailer = require('nodemailer'); // Para enviar e-mails
const crypto = require('crypto'); // Para gerar senhas aleatórias

// Função de login existente
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

        // Verifica se há um chamado respondido
        const chamado = await client.query(
            'SELECT * FROM chamados_senha WHERE usuario_id = $1 AND status = $2',
            [usuario.id, 'respondida']
        );

        if (chamado.rows.length > 0) {
            // Gera um token temporário para permitir a redefinição de senha
            const token = jwt.sign(
                { id: usuario.id, requireNewPassword: true },
                process.env.JWT_SECRET,
                { expiresIn: '15m' } // Token válido por 15 minutos
            );

            return res.status(200).json({ message: 'Redefina sua senha', token, requireNewPassword: true });
        }

        // Gera o token JWT normal
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

// Função para abrir um chamado de redefinição de senha
const forgotPassword = async (req, res) => {
    const { cpf, email } = req.body;

    if (!cpf || !email) {
        return res.status(400).json({ message: 'Por favor, preencha CPF e email.' });
    }

    try {
        // Verifica se o usuário existe no sistema
        const result = await client.query('SELECT * FROM usuarios WHERE cpf = $1 AND email = $2', [cpf, email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const usuario = result.rows[0];

        if (usuario.tipo_usuario === 'Administrador') {
            // Para administradores, gerar uma senha aleatória e enviar por e-mail
            const novaSenha = crypto.randomBytes(4).toString('hex'); // 8 caracteres
            const senhaHash = await bcrypt.hash(novaSenha, 10);

            // Atualiza a senha no banco de dados
            await client.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [senhaHash, usuario.id]);

            // Envia o e-mail com a senha temporária
            await sendEmail(usuario.email, 'Recuperação de Senha', `Sua nova senha temporária é: ${novaSenha}. Por favor, altere-a após o login.`);

            return res.status(200).json({ message: 'Senha temporária enviada para o seu e-mail.' });
        } else {
            // Para Aluno e Funcionário, criar um chamado com status 'pendente'
            await client.query(
                'INSERT INTO chamados_senha (usuario_id, tipo, status, email) VALUES ($1, $2, $3, $4)',
                [usuario.id, 'reset de senha', 'pendente', email] // Incluindo o email no chamado
            );

            return res.status(200).json({ message: 'Foi criado um chamado, por favor aguarde e sua senha temporária será enviada para você no e-mail cadastrado!' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao processar a recuperação de senha.' });
    }
};

// Função para o administrador responder ao chamado de redefinição de senha
const respondPasswordRequest = async (req, res) => {
    const { chamadoId, novaSenha } = req.body;

    if (!chamadoId || !novaSenha) {
        return res.status(400).json({ message: 'Por favor, forneça o ID do chamado e a nova senha temporária.' });
    }

    try {
        // Verifica se o chamado existe e está pendente
        const chamadoResult = await client.query('SELECT * FROM chamados_senha WHERE id = $1 AND status = $2', [chamadoId, 'pendente']);
        if (chamadoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Chamado não encontrado ou já respondido.' });
        }
        //console.log(chamadoResult.rows[0]);
        const chamado = chamadoResult.rows[0];

        // Busca o usuário pelo ID
        const usuarioResult = await client.query('SELECT * FROM usuarios WHERE id = $1', [chamado.usuario_id]);
        if (usuarioResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const usuario = usuarioResult.rows[0];

        // Gera a senha temporária
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualiza a senha do usuário no banco de dados
        await client.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [senhaHash, usuario.id]);

        // Atualiza o status do chamado para 'respondida'
        await client.query('UPDATE chamados_senha SET status = $1 WHERE id = $2', ['respondida', chamadoId]);

        // Envia o e-mail com a senha temporária
        //console.log(chamado);
        await sendEmail(chamado.email, 'Senha Temporária', `Sua senha temporária é: ${novaSenha}. Por favor, faça login e altere sua senha.`);

        return res.status(200).json({ message: 'Senha temporária gerada e enviada por e-mail.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao responder ao chamado de redefinição de senha.' });
    }
};


// Função para o usuário redefinir sua senha
const resetPassword = async (req, res) => {
    const { novaSenha } = req.body;
    const usuarioId = req.user.id;

    if (!novaSenha) {
        return res.status(400).json({ message: 'Por favor, insira uma nova senha.' });
    }

    try {
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualiza a senha no banco de dados
        await client.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [senhaHash, usuarioId]);

        // Atualiza o status do chamado para 'concluída'
        await client.query(
            'UPDATE chamados_senha SET status = $1 WHERE usuario_id = $2 AND status = $3',
            ['concluída', usuarioId, 'respondida']
        );

        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
};

// Função auxiliar para enviar e-mails usando Mailtrap
const sendEmail = async (to, subject, text) => {
    // Configura o transportador com as credenciais do Mailtrap
    let transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    const mailOptions = {
        from: '"Suporte Acadêmico" <no-reply@universidade.edu>',
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

const getChamadosSenha = async (req, res) => {
    const { tipo_usuario } = req.user;

    if (tipo_usuario !== 'Administrador') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    try {
        const result = await client.query('SELECT * FROM chamados_senha WHERE status = $1', ['pendente']);
        return res.status(200).json({ chamados: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao buscar chamados.' });
    }
};

module.exports = {
    login,
    forgotPassword,
    respondPasswordRequest,
    resetPassword,
    getChamadosSenha,
};