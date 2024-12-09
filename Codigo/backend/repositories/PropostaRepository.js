const PropostaModel = require('../models/PropostaModel');

class PropostaRepository {

    constructor() {
        this.propostaModel = PropostaModel;
    }

    async criarProposta(servico, cliente) {
        return this.propostaModel.create(
            {
                nome: `Proposta para ${servico} - ${cliente}`,
                valor: null,
                prazo: null,
                status: 'Incompleta'
            }
        );
    }

    async buscarTodasPropostas() {
        return this.propostaModel.findAll();
    }

    async buscarPropostaPorId(id) {
        return this.propostaModel.findByPk(id);
    }

    async preencherProposta(id, dadosProposta) {
        return this.propostaModel.update(dadosProposta, { where: { id } });
    }

    async limparProposta(id) {
        const dadosProposta = {
            descricao: null,
            valor: null,
            prazo: null,
            status: 'Incompleta'
        }
        return this.propostaModel.update(dadosProposta, { where: { id } });
    }

    async recusarProposta(id) {
        const dadosProposta = {
            status: 'Recusada'
        }
        return this.propostaModel.update(dadosProposta, { where: { id } });
    }

    async deletarProposta(id) {
        return this.propostaModel.destroy({ where: { id } });
    }
}

module.exports = new PropostaRepository();