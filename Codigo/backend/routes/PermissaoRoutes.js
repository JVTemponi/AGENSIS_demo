const express = require('express');
const PermissaoController = require('../controllers/PermissaoController');
const autenticacao = require('../utils/autenticacao');

class PermissaoRoutes {
  constructor() {
    this.permissaoController = PermissaoController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas com autenticação
    this.router.get('/permissoes', autenticacao(true, ''), this.permissaoController.listarTodasPermissoes.bind(this.permissaoController));
    this.router.get('/permissoes/:id', autenticacao(false, ''), this.permissaoController.buscarPermissaoPorId.bind(this.permissaoController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PermissaoRoutes().getRouter();
