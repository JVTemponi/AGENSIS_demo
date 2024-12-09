const PerfilService = require('../services/PerfilService');

class PerfilController {
  constructor() {
    this.perfilService = PerfilService;
  }

  async criarPerfil(req, res) {
    const { nome } = req.body;
    try {
      const perfil = await this.perfilService.criarPerfil(nome);
      res.status(201).json(perfil);
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      res.status(500).json({ error: "Erro ao criar perfil " + error });
    }
  }

  async listarTodosPerfis(req, res) {
    try {
      const perfis = await this.perfilService.buscarTodosPerfis();
      res.json(perfis);
    } catch (error) {
      console.error("Erro ao listar perfis:", error);
      res.status(500).json({ error: "Erro ao listar perfis " + error });
    }
  }

  async buscarPerfilPorId(req, res) {
    const { id } = req.params;
    try {
      const perfil = await this.perfilService.buscarPerfilPorId(id);
      if (!perfil) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      res.json(perfil);
    } catch (error) {
      console.error("Erro ao buscar perfil por ID:", error);
      res.status(500).json({ error: "Erro ao buscar perfil por ID " + error });
    }
  }

  
  async buscarPerfilPorNome(req, res) {
    const { nome } = req.params;
    try {
      const perfil = await this.perfilService.buscarPerfilPorNome(nome);
      if (!perfil) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }
      res.json(perfil);
    } catch (error) {
      console.error("Erro ao buscar perfil por nome:", error);
      res.status(500).json({ error: "Erro ao buscar perfil por nome " + error });
    }
  }


  async atualizarPerfil(req, res) {
    const { id } = req.params;
    const { nome } = req.body;
    try {
      const perfil = await this.perfilService.atualizarPerfil(id, nome);
      res.json(perfil);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ error: "Erro ao atualizar perfil " + error });
    }
  }

  async deletarPerfil(req, res) {
    const { id } = req.params;
    try {
      await this.perfilService.deletarPerfil(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
      res.status(500).json({ error: "Erro ao excluir perfil " + error });
    }
  }
}

module.exports = new PerfilController();
