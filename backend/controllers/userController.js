// backend/controllers/userController.js
const Usuario = require('../models/Usuario');

// Função de controle para cadastrar usuário
const cadastrarUsuario = async (req, res) => {
  const { cpf, email, nome_completo, matricula, numero_celular, endereco, senha, tipo_usuario } = req.body;

  if (!cpf || !email || !nome_completo || !matricula || !senha || !tipo_usuario) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    // Verifica se o CPF já está cadastrado usando o modelo
    const cpfExistente = await Usuario.verificarCpf(cpf);
    if (cpfExistente) {
      return res.status(400).json({ error: 'CPF já cadastrado.' });
    }

    // Cadastra o usuário se não existir erro
    const novoUsuario = await Usuario.inserirUsuario({
      cpf,
      email,
      nome_completo,
      matricula,
      numero_celular,
      endereco,
      senha,
      tipo_usuario,
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

module.exports = { cadastrarUsuario };
