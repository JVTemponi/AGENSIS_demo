//Importação de dependências
require('dotenv').config();
const express = require('express');
const db = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

//Importação das rotas
const PacotesRoutes = require('./routes/PacotesRoutes');
const UsuarioRoutes = require('./routes/UsuarioRoutes');
const PerfilRoutes = require('./routes/PerfilRoutes');
const PermissaoRoutes = require('./routes/PermissaoRoutes');
const PermissaoPerfilRoutes = require('./routes/PermissaoPerfilRoutes');
const ClienteRoutes = require('./routes/ClienteRoutes');
const ArtistaRoutes = require('./routes/ArtistaRoutes');
const ProjetoRoutes = require('./routes/ProjetoRoutes');
const ReuniaoRoutes = require('./routes/ReuniaoRoutes');
const TransacaoFinanceiraRoutes = require('./routes/TransacaoFinanceiraRoutes');
const ServicoRoutes = require('./routes/ServicoRoutes');
const ItemProjetoRoutes = require('./routes/ItemProjetoRoutes');
//const AgendaRoutes = require('./routes/AgendaRoutes');
const ClienteRatingRoutes = require('./routes/ClienteRatingRoutes');

//Endereçamento das rotas
app.use('/api', PacotesRoutes);
app.use('/api', UsuarioRoutes);
app.use('/api', PerfilRoutes);
app.use('/api', PermissaoRoutes);
app.use('/api', PermissaoPerfilRoutes);
app.use('/api', ClienteRoutes);
app.use('/api', ArtistaRoutes);
app.use('/api', ProjetoRoutes);
app.use('/api', ReuniaoRoutes);
app.use('/api', TransacaoFinanceiraRoutes);
app.use('/api', ServicoRoutes);
app.use('/api', ItemProjetoRoutes);
app.use('/api', ClienteRatingRoutes);
//app.use('/', AgendaRoutes);


// Importação dos modelos e definições de associações
//require('./models/index');

console.log("Ambiente:", process.env.NODE_ENV);
console.log("URL do Banco (Railway):", process.env.MYSQL_PUBLIC_URL);

db.connect();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });