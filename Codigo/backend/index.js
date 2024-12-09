//Importação de dependências
require('dotenv').config({ path: '../.env' });
const express = require('express');
//const sessionGoogleApi = require('./utils/criarSessionExpress');
const session = require('express-session');
const db = require('./config/database');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const port = 3000;

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
const AgendaRoutes = require('./routes/AgendaRoutes');
const ClienteRatingRoutes = require('./routes/ClienteRatingRoutes');

// Middleware para log de requisições
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(session({
  secret: process.env.SECRET_ID,
  resave: false,
  saveUninitialized: true, // 'true' para forçar a criação de uma sessão
  cookie: { secure: false } // Para desenvolvimento, defina como 'false'
}));


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
app.use('/', AgendaRoutes);


// Importação dos modelos e definições de associações
require('./models/index');

db.connect();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
