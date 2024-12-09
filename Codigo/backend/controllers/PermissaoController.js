const PermissaoService = require('../services/PermissaoService');

class PermissaoController {
  constructor() {
    this.permissaoService = PermissaoService;
  }

  // async criarPermissao(req, res) {
  //   const { nome } = req.body;
  //   try {
  //     const permissao = await this.permissaoService.criarPermissao(nome);
  //     res.status(201).json(permissao);
  //   } catch (error) {
  //     console.error("Erro ao criar permissão:", error);
  //     res.status(500).json({ error: "Erro ao criar permissão " + error });
  //   }
  // }

  async listarTodasPermissoes(req, res) {
    try {
      const permissoes = await this.permissaoService.buscarTodasPermissoes();
      res.json(permissoes);
    } catch (error) {
      console.error("Erro ao listar permissões:", error);
      res.status(500).json({ error: "Erro ao listar permissões " + error });
    }
  }

  async buscarPermissaoPorId(req, res) {
    const { id } = req.params;
    try {
      const permissao = await this.permissaoService.buscarPermissaoPorId(id);
      if (!permissao) {
        return res.status(404).json({ message: "Permissão não encontrada" });
      }
      res.json(permissao);
    } catch (error) {
      console.error("Erro ao buscar permissão por ID:", error);
      res.status(500).json({ error: "Erro ao buscar permissão por ID " + error });
    }
  }

  // async atualizarPermissao(req, res) {
  //   const { id } = req.params;
  //   const { nome } = req.body;
  //   try {
  //     const permissao = await this.permissaoService.atualizarPermissao(id, nome);
  //     res.json(permissao);
  //   } catch (error) {
  //     console.error("Erro ao atualizar permissão:", error);
  //     res.status(500).json({ error: "Erro ao atualizar permissão " + error });
  //   }
  // }

  // async excluirPermissao(req, res) {
  //   const { id } = req.params;
  //   try {
  //     await this.permissaoService.excluirPermissao(id);
  //     res.status(204).end();
  //   } catch (error) {
  //     console.error("Erro ao excluir permissão:", error);
  //     res.status(500).json({ error: "Erro ao excluir permissão " + error });
  //   }
  // }
}

module.exports = new PermissaoController();
