const { ProjetoModel, ItemProjetoModel, ItemProjetoCamposModel, ClienteModel, PropostaModel, ServicoModel } = require('../models/index');

class ItemProjetoRepository {

    constructor() {
        this.projetoModel = ProjetoModel;
        this.itemProjetoModel = ItemProjetoModel;
        this.itemProjetoCamposModel = ItemProjetoCamposModel;
        this.clienteModel = ClienteModel;
        this.propostaModel = PropostaModel;
        this.servicoModel = ServicoModel;
    }

    async criarItemProjeto(dadosItemProjeto) {

        const itemProjeto = await this.itemProjetoModel.create(
            dadosItemProjeto,
        );
        return itemProjeto;
    }

    async criarItemProjetoCampos(item_projeto_id, campo) {
        return await this.itemProjetoCamposModel.create({
            item_projeto_id: item_projeto_id,
            nome_campo: campo.nome_campo,
            valor_digitado: campo.valor_digitado,
        });
    }

    async buscarTodosItemProjeto() {
        return await this.itemProjetoModel.findAll({
            include: [
                { model: this.projetoModel, as: 'projeto' },
                { model: this.servicoModel, as: 'servico' },
                { model: this.itemProjetoCamposModel, as: 'campos' },
                { model: this.clienteModel, as: 'cliente' },
                { model: this.propostaModel, as: 'proposta' }
            ],
        });
    }

    async buscarTodosItemProjetoPorIdProjeto(projeto_id) {
        return await this.itemProjetoModel.findAll({
            where: { projeto_id },
            include: [
                { model: this.projetoModel, as: 'projeto' },
                { model: this.servicoModel, as: 'servico' },
                { model: this.itemProjetoCamposModel, as: 'campos' },
                { model: this.clienteModel, as: 'cliente' },
                { model: this.propostaModel, as: 'proposta' }
            ],
        });
    }

    async buscarTodosItemProjetoPorIdCliente(cliente_id) {
        return await this.itemProjetoModel.findAll({
            where: { cliente_id: cliente_id },
            include: [
                { model: this.projetoModel, as: 'projeto' }],
        });
    }

    async buscarTodosItemProjetoPorIdArtista(artista_id) {
        return await this.itemProjetoModel.findAll({
            where: { artista_id: artista_id },
            include: [
                { model: this.projetoModel, as: 'projeto' },
                { model: this.servicoModel, as: 'servico' },
                { model: this.itemProjetoCamposModel, as: 'campos' },
                { model: this.clienteModel, as: 'cliente' },
                { model: this.propostaModel, as: 'proposta' }
            ],
        });
    }

    async buscarItemProjetoPorId(id) {
        return await this.itemProjetoModel.findOne({
            where: { id },
            include: [
                { model: this.projetoModel, as: 'projeto' },
                { model: this.servicoModel, as: 'servico' },
                { model: this.itemProjetoCamposModel, as: 'campos' },
                { model: this.clienteModel, as: 'cliente' },
                { model: this.propostaModel, as: 'proposta' }
            ],
        });
    }

    async buscarTodosItemProjetoPorStatus(status) {
        return await this.itemProjetoModel.findAll({
            where: { status },
            include: [
                { model: this.projetoModel, as: 'projeto' },
                { model: this.servicoModel, as: 'servico' },
                { model: this.itemProjetoCamposModel, as: 'campos' },
                { model: this.clienteModel, as: 'cliente' },
                { model: this.propostaModel, as: 'proposta' }
            ],
        });
    }

    async atualizarItemProjeto(id, itemProjeto) {

        return await this.itemProjetoModel.update(itemProjeto, { where: { id }, returning: true });
    }
}

module.exports = new ItemProjetoRepository();

