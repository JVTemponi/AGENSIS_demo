const express = require('express');
const PerfilController = require('../controllers/PerfilController');
const autenticacao = require('../utils/autenticacao');

class PerfilRoutes {
  constructor() {
    this.perfilController = PerfilController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas com autenticação
    this.router.get('/perfis', autenticacao(true, ''), this.perfilController.listarTodosPerfis.bind(this.perfilController));
    this.router.get('/perfis/:id', autenticacao(true, ''), this.perfilController.buscarPerfilPorId.bind(this.perfilController));
    this.router.get('/perfilNome/:nome', autenticacao(true, ''), this.perfilController.buscarPerfilPorNome.bind(this.perfilController));
    this.router.post('/perfis', autenticacao(true, ''), this.perfilController.criarPerfil.bind(this.perfilController));
    this.router.put('/perfis/:id', autenticacao(false, ''), this.perfilController.atualizarPerfil.bind(this.perfilController));
    this.router.delete('/perfis/:id', autenticacao(false, ''), this.perfilController.deletarPerfil.bind(this.perfilController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PerfilRoutes().getRouter();
