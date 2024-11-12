// backend/controllers/userController.js
const Usuario = require('../models/Usuario');  // Importe o model

// Função para cadastrar um novo usuário
const cadastrarUsuario = async (req, res) => {
  const { cpf, email, nome_completo, matricula, numero_celular, endereco, senha, tipo_usuario } = req.body;

  // Validação dos campos obrigatórios
  if (!cpf || !email || !nome_completo || !matricula || !senha || !tipo_usuario) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    // Chama a função do model para cadastrar o usuário
    const usuario = await Usuario.cadastrarUsuario({
      cpf,
      email,
      nome_completo,
      matricula,
      numero_celular,
      endereco,
      senha,
      tipo_usuario,
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: error.message || 'Erro ao cadastrar usuário' });
  }
};

module.exports = {
  cadastrarUsuario,
};
