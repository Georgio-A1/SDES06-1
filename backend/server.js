const app = require('./app');

const PORT = process.env.PORT || 5000;  // Verifique se a porta está configurada corretamente
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});