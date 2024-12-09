const ProjetoRepository = require("../repositories/ProjetoRepository");
const ItemProjetoService = require("./ItemProjetoService");

class ProjetoService {
    constructor() {
        this.projetoRepository = ProjetoRepository;
        this.itemProjetoService = ItemProjetoService;
    }

    async criarProjeto(nome, cliente_id, itensProjeto) {
        try {
            const projeto = await this.projetoRepository.criarProjeto({ nome, cliente_id });

            if (itensProjeto && itensProjeto.length > 0) {
                for (const item of itensProjeto) {
                    await this.itemProjetoService.criarItemProjeto({
                        ...item,
                        projetoId: projeto.id
                    });
                }
            }

            return projeto;
        } catch (error) {
            console.error("Erro ao criar projeto:", error);
            throw new Error("Erro ao criar projeto");
        }
    }

    async buscarTodosProjetos() {
        return await this.projetoRepository.buscarTodosProjetos();
    }

    async buscarProjetoPorId(id) {
        return await this.projetoRepository.buscarProjetoPorId(id);
    }

        async buscarTodosProjetosPorClienteId(clienteId) {
        try {
            return await this.projetoRepository.buscarTodosProjetosPorClienteId(clienteId);
        } catch (error) {
            console.error("Erro ao buscar projetos por cliente ID:", error);
            throw new Error("Erro ao buscar projetos por cliente ID");
        }
    }

    async atualizarProjeto(id, dados) {
        try {
            const atualizado = await this.projetoRepository.atualizarProjeto(id, dados);
            return atualizado;
        } catch (error) {
            console.error("Erro ao atualizar projeto:", error);
            throw new Error("Erro ao atualizar projeto");
        }
    }

    async deletarProjeto(id) {
        try {
            const deletado = await this.projetoRepository.deletarProjeto(id);
            return deletado;
        } catch (error) {
            console.error("Erro ao deletar projeto:", error);
            throw new Error("Erro ao deletar projeto");
        }
    }
}

module.exports = new ProjetoService();
