const express = require('express');
const ReuniaoController = require('../controllers/ReuniaoController');

class ReuniaoRoutes {
    constructor() {
        this.reuniaoController = ReuniaoController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/reunioes', this.reuniaoController.listarReunioes.bind(this.reuniaoController));
        this.router.get('/reunioes/:usuario_id', this.reuniaoController.buscarReunioesPorIdUsuario.bind(this.reuniaoController));
        this.router.post('/reunioes', this.reuniaoController.criarReuniao.bind(this.reuniaoController));
        this.router.get('/reunioes/:id', this.reuniaoController.buscarReuniaoPorId.bind(this.reuniaoController));
        this.router.put('/reunioes/:id', this.reuniaoController.atualizarReuniao.bind(this.reuniaoController));
        this.router.delete('/reunioes/:id', this.reuniaoController.deletarReuniao.bind(this.reuniaoController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ReuniaoRoutes().getRouter();