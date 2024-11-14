const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT e diferenciar acesso por tipo de usuário
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Erro de verificação do token:", err);  // Adicionado para depuração
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = decoded; // O usuário é decodificado do token

    //console.log("Token decodificado:", decoded);  // Verifique o conteúdo do token

    if (req.user.role && req.user.role === 'Administrador') {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }

    next();
  });
};

module.exports = authMiddleware;