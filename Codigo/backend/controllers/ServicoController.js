const ServicoService = require("../services/ServicoService");

class ServicoController {
    constructor() {
        this.ServicoService = ServicoService;
    }

    async criarServico(req, res) {
        const { nome, descricao, campos } = req.body;
        try {
            const servico = await this.ServicoService.criarServico(nome, descricao, campos);
            res.status(201).json(servico);
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            res.status(500).json({ error: "Erro ao criar serviço: " + error.message });
        }
    }

    async listarTodosServicos(req, res) {
        try {
            const servicos = await this.ServicoService.buscarTodosServicos();
            res.status(200).json(servicos);
        } catch (error) {
            console.error("Erro ao listar serviços:", error);
            res.status(500).json({ error: "Erro ao listar serviços: " + error.message });
        }
    }

    async buscarServicoPorId(req, res) {
        const { id } = req.params;
        try {
            const servico = await this.ServicoService.buscarServicoPorId(id);
            if (!servico) {
                return res.status(404).json({ error: "Serviço não encontrado" });
            }
            res.status(200).json(servico);
        } catch (error) {
            console.error("Erro ao buscar serviço:", error);
            res.status(500).json({ error: "Erro ao buscar serviço: " + error.message });
        }
    }

    async atualizarServico(req, res) {
        const { id } = req.params;
        const { nome, descricao, campos } = req.body;
        try {
            const dadosServico = { nome, descricao };
            const dadosCamposServico = campos;
            const servico = await this.ServicoService.atualizarServico(id, dadosServico, dadosCamposServico);
            if (!servico) {
                return res.status(404).json({ error: "Serviço não encontrado" });
            }
            res.status(200).json(servico);
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            res.status(500).json({ error: "Erro ao atualizar serviço: " + error.message });
        }
    }

    async deletarServico(req, res) {
        const { id } = req.params;
        try {
            const resultado = await this.ServicoService.deletarServico(id);
            if (!resultado) {
                return res.status(404).json({ error: "Serviço não encontrado" });
            }
            res.status(200).json({ message: "Serviço deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar serviço:", error);
            res.status(500).json({ error: "Erro ao deletar serviço: " + error.message });
        }
    }
}

module.exports = new ServicoController();
