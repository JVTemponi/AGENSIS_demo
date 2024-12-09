const express = require('express');
const ServicoController = require('../controllers/ServicoController');
const autenticacao = require("../utils/autenticacao");

class ServicoRoutes {
    constructor() {
        this.servicoController = ServicoController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            '/servicos', autenticacao(false, ''),
            this.servicoController.listarTodosServicos.bind(this.servicoController)
        );
        this.router.post(
            '/servicos', autenticacao(false, ''),
            this.servicoController.criarServico.bind(this.servicoController)
        );
        this.router.get(
            '/servicos/:id', autenticacao(false, ''),
            this.servicoController.buscarServicoPorId.bind(this.servicoController)
        );
        this.router.put(
            '/servicos/:id', autenticacao(false, ''),
            this.servicoController.atualizarServico.bind(this.servicoController)
        );
        this.router.delete(
            '/servicos/:id', autenticacao(false, ''),
            this.servicoController.deletarServico.bind(this.servicoController)
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ServicoRoutes().getRouter();
