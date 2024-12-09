const express = require('express');
const ClienteRatingController = require('../controllers/ClienteRatingController');

class ClienteRatingRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/ratingclientes/:userId', ClienteRatingController.listarClientes.bind(ClienteRatingController));

    this.router.post('/ratingclientes', ClienteRatingController.criarAvaliacao.bind(ClienteRatingController));

    this.router.put('/ratingclientes/:clienteId/:userId', ClienteRatingController.atualizarAvaliacao.bind(ClienteRatingController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new ClienteRatingRoutes().getRouter();
