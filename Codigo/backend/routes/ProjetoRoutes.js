const express = require('express');
const ProjetoController = require('../controllers/ProjetoController');

class ProjetoRoutes {
    constructor() {
        this.projetoController = ProjetoController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/projetos', this.projetoController.listarTodosProjetos.bind(this.projetoController));
        this.router.post('/projetos', this.projetoController.criarProjeto.bind(this.projetoController));
        this.router.get('/projetos/:id', this.projetoController.buscarProjetoPorId.bind(this.projetoController));
        this.router.put('/projetos/:id', this.projetoController.atualizarProjeto.bind(this.projetoController));
        this.router.delete('/projetos/:id', this.projetoController.deletarProjeto.bind(this.projetoController));
        this.router.get('/projetos/cliente/:clienteId', this.projetoController.buscarTodosProjetosPorClienteId.bind(this.projetoController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ProjetoRoutes().getRouter();
