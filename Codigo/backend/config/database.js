
const { Sequelize } = require("sequelize");
 
// Conexão com o banco de dados da Railway
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, // Nome do banco de dados
  process.env.MYSQL_USER,     // Usuário do banco
  process.env.MYSQL_PASSWORD, // Senha
  {
    host: process.env.MYSQL_HOST, // Host da Railway
    port: process.env.MYSQL_PORT, // Porta da Railway (normalmente 3306 para MySQL)
    dialect: "mysql",            // Dialeto do banco de dados
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,                // Railway exige SSL
        rejectUnauthorized: false,   // Permitir certificados autoassinados
      },
    },
    retry: {
      max: 9,                         // Tenta reconectar até 5 vezes em caso de falha
    },
  }
);


// Teste de conexão
async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
}

module.exports = { sequelize, connect };
