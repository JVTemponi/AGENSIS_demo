const express = require('express');
const PacotesController = require('../controllers/PacotesController');

class PacotesRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/pacotes', PacotesController.criarPacote.bind(PacotesController));
        this.router.get('/pacotes', PacotesController.listarTodosPacotes.bind(PacotesController));
        this.router.get('/pacotes/:id', PacotesController.buscarPacotePorId.bind(PacotesController));
        this.router.put('/pacotes/:id', PacotesController.atualizarPacote.bind(PacotesController));
        this.router.delete('/pacotes/:id', PacotesController.deletarPacote.bind(PacotesController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new PacotesRoutes().getRouter();
