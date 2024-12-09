const ProjetoService = require("../services/ProjetoService");

class ProjetoController {
    constructor(ProjetoService) {
        this.ProjetoService = ProjetoService;
    }

    async criarProjeto(req, res) {
        const {nome, cliente_id} = req.body;
        try {
            const projeto = await this.ProjetoService.criarProjeto(
                nome,
                cliente_id
            );
            res.status(201).json(projeto);
        } catch (error) {
            console.error("Erro ao criar projeto:", error);
            res.status(500).json({ error: "Erro ao criar projeto: " + error });
        }
    }

    async listarTodosProjetos(req, res) {
        try {
            const projetos = await this.ProjetoService.buscarTodosProjetos();
            res.status(200).json(projetos);
        } catch (error) {
            console.error("Erro ao listar projetos:", error);
            res.status(500).json({ error: "Erro ao listar projetos: " + error });
        }
    }

    async buscarProjetoPorId(req, res) {
        const { id } = req.params;
        try {
            const projeto = await this.ProjetoService.buscarProjetoPorId(id);
            if (!projeto) {
                return res.status(404).json({ error: "Projeto não encontrado" });
            }
            res.status(200).json(projeto);
        } catch (error) {
            console.error("Erro ao buscar projeto:", error);
            res.status(500).json({ error: "Erro ao buscar projeto: " + error });
        }
    }


        async buscarTodosProjetosPorClienteId(req, res) {
        const { clienteId } = req.params;
        try {
            const projetos = await this.projetoService.buscarTodosProjetosPorClienteId(clienteId);
            res.json(projetos);
        } catch (error) {
            console.error("Erro ao buscar projetos por cliente ID:", error);
            res.status(500).json({ error: "Erro ao buscar projetos por cliente ID" });
        }
    }

    async atualizarProjeto(req, res) {
        const { id } = req.params;
        const dados = req.body;
        try {
            const atualizado = await this.ProjetoService.atualizarProjeto(id, dados);
            if (atualizado[0] === 0) {
                return res.status(404).json({ error: "Projeto não encontrado" });
            }
            res.status(200).json({ message: "Projeto atualizado com sucesso" });
        } catch (error) {
            console.error("Erro ao atualizar projeto:", error);
            res.status(500).json({ error: "Erro ao atualizar projeto: " + error });
        }
    }

    async deletarProjeto(req, res) {
        const { id } = req.params;
        try {
            const deletado = await this.ProjetoService.deletarProjeto(id);
            if (!deletado) {
                return res.status(404).json({ error: "Projeto não encontrado" });
            }
            res.status(200).json({ message: "Projeto deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar projeto:", error);
            res.status(500).json({ error: "Erro ao deletar projeto: " + error });
        }
    }
}

module.exports = new ProjetoController(require('../services/ProjetoService'));
