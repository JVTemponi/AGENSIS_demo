const ItemProjetoService = require("../services/ItemProjetoService");

class ItemProjetoController {
    constructor() {
        this.itemProjetoService = ItemProjetoService;
    }

    async criarItemProjeto(req, res) {
        const { dadosItemCampos, projeto_id, servico_id, cliente_id } = req.body;
        try {
            const itemProjeto = await this.itemProjetoService.criarItemProjeto(
                dadosItemCampos, projeto_id, servico_id, cliente_id
            );
            res.status(201).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao criar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao criar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjeto(req, res) {
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjeto();
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjetoPorIdProjeto(req, res) {
        const { projeto_id } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjetoPorIdProjeto(projeto_id);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarItemProjetoPorId(req, res) {
        const { id } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarItemProjetoPorId(id);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjetoPorIdCliente(req, res) {
        const { cliente_id } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjetoPorIdCliente(cliente_id);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjetoPorIdArtista(req, res) {
        const { artista_id } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjetoPorIdArtista(artista_id);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjetoPorIdUsuario(req, res) {
        const { usuario_id } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjetoPorIdUsuario(usuario_id);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async buscarTodosItemProjetoPorStatus(req, res) {
        const { status_nome } = req.params;
        try {
            const itemProjeto = await this.itemProjetoService.buscarTodosItemProjetoPorStatus(status_nome);
            if (!itemProjeto) {
                return res.status(404).json({ error: "itemProjeto não encontrado" });
            }
            res.status(200).json(itemProjeto);
        } catch (error) {
            console.error("Erro ao buscar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao buscar itemProjeto: " + error.message });
        }
    }

    async assumirItemProjeto(req, res) {
        const { id } = req.params;
        const { artista_id } = req.body;
        try {
            await this.itemProjetoService.assumirItemProjeto(id, artista_id);
            res.status(200).json({ message: "Item do projeto assumido com sucesso" });
        } catch (error) {
            console.error("Erro ao assumir itemProjeto:", error);
            res.status(500).json({ error: "Erro ao assumir itemProjeto: " + error.message });
        }
    }

    async adicionarPropostaItemProjeto(req, res) {
        const { id } = req.params;
        const { descricao, valor, prazo } = req.body;
        try {
            await this.itemProjetoService.adicionarPropostaItemProjeto(id, descricao, valor, prazo);
            res.status(200).json({ message: "Proposta adicionada ao item do projeto com sucesso" });
        } catch (error) {
            console.error("Erro ao adicionar proposta ao itemProjeto:", error);
            res.status(500).json({ error: "Erro ao adicionar proposta ao itemProjeto: " + error.message });
        }
    }

    async aceitarPropostaItemProjeto(req, res) {
        const { id } = req.params;
        try {
            await this.itemProjetoService.aceitarPropostaItemProjeto(id);
            res.status(200).json({ message: "Proposta aprovada com sucesso" });
        } catch (error) {
            console.error("Erro ao aprovar proposta do itemProjeto:", error);
            res.status(500).json({ error: "Erro ao aprovar proposta do itemProjeto: " + error.message });
        }
    }

    async recusarPropostaItemProjeto(req, res) {
        const { id } = req.params;
        try {
            await this.itemProjetoService.recusarPropostaItemProjeto(id);
            res.status(200).json({ message: "Proposta recusada com sucesso" });
        } catch (error) {
            console.error("Erro ao recusar proposta do itemProjeto:", error);
            res.status(500).json({ error: "Erro ao recusar proposta do itemProjeto: " + error.message });
        }
    }

    async iniciarItemProjeto(req, res) {
        const { id } = req.params;
        try {
            await this.itemProjetoService.iniciarItemProjeto(id);
            res.status(200).json({ message: "Item do projeto iniciado com sucesso" });
        } catch (error) {
            console.error("Erro ao iniciar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao iniciar itemProjeto: " + error.message });
        }
    }

    async concluirItemProjeto(req, res) {
        const { id } = req.params;
        try {
            await this.itemProjetoService.concluirItemProjeto(id);
            res.status(200).json({ message: "Item do projeto concluído com sucesso" });
        } catch (error) {
            console.error("Erro ao concluir itemProjeto:", error);
            res.status(500).json({ error: "Erro ao concluir itemProjeto: " + error.message });
        }
    }

    async cancelarItemProjeto(req, res) {
        const { id } = req.params;
        const { artista_id } = req.body;
        try {
            await this.itemProjetoService.cancelarItemProjeto(id, artista_id);
            res.status(200).json({ message: "Item do projeto cancelado com sucesso" });
        } catch (error) {
            console.error("Erro ao cancelar itemProjeto:", error);
            res.status(500).json({ error: "Erro ao cancelar itemProjeto: " + error.message });
        }
    }

}

module.exports = new ItemProjetoController();
