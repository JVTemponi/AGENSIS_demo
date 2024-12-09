const express = require('express');
const ItemProjetoController = require('../controllers/ItemProjetoController');
const autenticacao = require('../utils/autenticacao');

class ItemProjetoRoutes {
    constructor() {
        this.itemProjetoController = ItemProjetoController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(
            '/itemProjeto',
            autenticacao(false, ''),
            this.itemProjetoController.criarItemProjeto.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/:id',
            autenticacao(false, ''),
            this.itemProjetoController.buscarItemProjetoPorId.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto',
            autenticacao(true, 'ListarKanban'),
            this.itemProjetoController.buscarTodosItemProjeto.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/projeto/:projeto_id',
            autenticacao(false, ''),
            this.itemProjetoController.buscarTodosItemProjetoPorIdProjeto.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/cliente/:cliente_id',
            autenticacao(false, ''),
            this.itemProjetoController.buscarTodosItemProjetoPorIdCliente.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/artista/:artista_id',
            autenticacao(false, ''),
            this.itemProjetoController.buscarTodosItemProjetoPorIdArtista.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/usuariologado/:usuario_id',
            autenticacao(false, ''),
            this.itemProjetoController.buscarTodosItemProjetoPorIdUsuario.bind(this.itemProjetoController)
        );
        this.router.get(
            '/itemProjeto/status/:status_nome',
            autenticacao(true, 'ListarKanban'),
            this.itemProjetoController.buscarTodosItemProjetoPorStatus.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/assumirItemProjeto/:id',
            autenticacao(false, 'EditarKanban'),
            this.itemProjetoController.assumirItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/adicionarPropostaItemProjeto/:id',
            autenticacao(false, 'EditarKanban'),
            this.itemProjetoController.adicionarPropostaItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/aceitarPropostaItemProjeto/:id',
            autenticacao(false, ''),
            this.itemProjetoController.aceitarPropostaItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/recusarPropostaItemProjeto/:id',
            autenticacao(false, ''),
            this.itemProjetoController.recusarPropostaItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/iniciarItemProjeto/:id',
            autenticacao(false, 'EditarKanban'),
            this.itemProjetoController.iniciarItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/concluirItemProjeto/:id',
            autenticacao(false, 'EditarKanban'),
            this.itemProjetoController.concluirItemProjeto.bind(this.itemProjetoController)
        );
        this.router.put(
            '/itemProjeto/cancelarItemProjeto/:id',
            autenticacao(false, 'EditarKanban'),
            this.itemProjetoController.cancelarItemProjeto.bind(this.itemProjetoController)
        );
    }
    getRouter() {
        return this.router;
    }
}

module.exports = new ItemProjetoRoutes().getRouter();
