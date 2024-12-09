const ServicoRepository = require("../repositories/ServicoRepository");

class ServicoService {
    constructor() {
        this.servicoRepository = ServicoRepository;
    }

    async criarServico(nome, descricao, campos) {
        try {

            const dadosServico = { nome, descricao };
            const dadosCamposServico = campos;

            const servico = await this.servicoRepository.criarServico(
                dadosServico,
                dadosCamposServico
            );
            return servico;
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            throw new Error("Erro ao criar serviço");
        }
    }

    async buscarTodosServicos() {
        return await this.servicoRepository.buscarTodosServicos();
    }

    async buscarServicoPorId(id) {
        return await this.servicoRepository.buscarServicoPorId(id);
    }

    async atualizarServico(id, dadosServico, dadosCamposServico) {
        const servico = await this.servicoRepository.buscarServicoPorId(id);
        if (!servico) { throw new Error("ID Serviço não identificado"); }

        try {
            const servicoAtualizado = await this.servicoRepository.atualizarServico(id, dadosServico, dadosCamposServico);
            return servicoAtualizado;
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            throw new Error("Erro ao atualizar serviço");
        }
    }

    async deletarServico(id) {
        try {
            const deletado = await this.servicoRepository.deletarServico(id);
            return deletado;
        } catch (error) {
            console.error("Erro ao deletar serviço:", error);
            throw new Error("Erro ao deletar serviço");
        }
    }
}

module.exports = new ServicoService();
