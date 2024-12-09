const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const autenticacao = require('../utils/autenticacao');

class UsuarioRoutes {
  constructor() {
    this.usuarioController = UsuarioController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas sem autenticação
    this.router.post('/login', this.usuarioController.login.bind(this.usuarioController));


    // Rotas com autenticação, mas sem permissão
    this.router.get('/usuarios/:id', autenticacao(true, ''), this.usuarioController.buscarUsuarioPorId.bind(this.usuarioController));
    this.router.put('/usuarios/:id', autenticacao(true, ''), this.usuarioController.atualizarUsuario.bind(this.usuarioController));
    this.router.put('/usuarios/alterarSenha/:id', autenticacao(true, ''), this.usuarioController.alterarSenha.bind(this.usuarioController));

    // Rotas com restrição e permissão necessária
    this.router.post('/usuarios', autenticacao(true, 'GerenciarUsuarios'), this.usuarioController.criarUsuario.bind(this.usuarioController));
    this.router.get('/usuarios', autenticacao(true, 'ListarUsuarios'), this.usuarioController.listarTodosUsuarios.bind(this.usuarioController));
    this.router.get('/usuarios/email/:email', autenticacao(true, 'ListarUsuarios'), this.usuarioController.buscarUsuarioPorEmail.bind(this.usuarioController));
    this.router.delete('/usuarios/:id', autenticacao(true, 'GerenciarUsuarios'), this.usuarioController.excluirUsuario.bind(this.usuarioController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new UsuarioRoutes().getRouter();
