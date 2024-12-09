const express = require('express');
const PermissaoPerfilController = require('../controllers/PermissaoPerfilController');
const autenticacao = require('../utils/autenticacao');

class PermissaoPerfilRoutes {
  constructor() {
    this.permissaoPerfilController = PermissaoPerfilController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas com autenticação
    this.router.get('/acessosPerfil/:nomePerfil', autenticacao(false, ''), this.permissaoPerfilController.permissoesAcessoFuncionalidadesPorPerfil.bind(this.permissaoPerfilController));
    this.router.get('/permissaoPerfis/:perfilId', autenticacao(false, ''), this.permissaoPerfilController.buscarPermissoesPorPerfil.bind(this.permissaoPerfilController));
    this.router.get('/permissaoPerfis', autenticacao(false, ''), this.permissaoPerfilController.listarTodasPermissoesPerfil.bind(this.permissaoPerfilController));
    this.router.get('/permissaoPerfisPorNomePerfil/:nome', autenticacao(false, ''), this.permissaoPerfilController.permissaoPerfisPorNomePerfil.bind(this.permissaoPerfilController));
    this.router.post('/permissaoPerfis', autenticacao(true, ''), this.permissaoPerfilController.criarPermissaoPerfil.bind(this.permissaoPerfilController));
    this.router.delete('/permissaoPerfis/:perfilId/:permissaoId', autenticacao(false, ''), this.permissaoPerfilController.deletarPermissaoPerfil.bind(this.permissaoPerfilController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PermissaoPerfilRoutes().getRouter();
