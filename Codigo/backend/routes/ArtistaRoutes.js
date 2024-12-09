const express = require('express');
const ArtistaController = require('../controllers/ArtistaController');
const autenticacao = require('../utils/autenticacao');

class ArtistaRoutes {
  constructor() {
    this.artistaController = ArtistaController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {

    //Rotas com restrição e permissão necessária
    this.router.post(
      '/artistas',
      autenticacao(false, 'CriarArtistas'),
      this.artistaController.criarArtista.bind(this.artistaController)
    );
    this.router.get(
      '/artistas/:id',
      autenticacao(false, ''),
      this.artistaController.buscarArtistaPorId.bind(this.artistaController)
    );
    this.router.get(
      '/artistas',
      autenticacao(false, 'ListarArtistas'),
      this.artistaController.listarTodosArtistas.bind(this.artistaController)
    );
    this.router.get(
      '/artistas/usuario/:usuarioId',
      autenticacao(false, 'ListarArtistas'),
      this.artistaController.buscarArtistaPorUsuarioId.bind(this.artistaController)
    );
    this.router.put(
      '/artistas/completarCadastro/:id',
      autenticacao(false, ''),
      this.artistaController.completarCadastroArtista.bind(this.artistaController)
    );
    this.router.put(
      '/artistaPerfil/:id',
      autenticacao(false, 'GerenciarArtistas'),
      this.artistaController.atualizarPerfilArtista.bind(this.artistaController)
    );
    this.router.put(
      '/artistas/:id',
      autenticacao(false, 'GerenciarArtistas'),
      this.artistaController.atualizarArtista.bind(this.artistaController)
    );
    this.router.delete(
      '/artistas/:id',
      autenticacao(false, 'GerenciarArtistas'),
      this.artistaController.excluirArtista.bind(this.artistaController)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new ArtistaRoutes().getRouter();
