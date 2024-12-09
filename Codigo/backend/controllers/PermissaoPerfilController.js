const PermissaoPerfilService = require('../services/PermissaoPerfilService');

class PermissaoPerfilController {
  constructor() {
    this.permissaoPerfilService = PermissaoPerfilService;
  }

  // Método para criar um novo relacionamento entre Permissão e Perfil
  async criarPermissaoPerfil(req, res) {
    const { perfil, permissao } = req.body;
    try {
      const permissaoPerfil = await this.permissaoPerfilService.criarPermissaoPerfil(perfil, permissao);
      res.status(201).json(permissaoPerfil);
    } catch (error) {
      console.error("Erro ao criar relação Permissão-Perfil:", error);
      res.status(500).json({ error: "Erro ao criar relação Permissão-Perfil " + error });
    }
  }

  async buscarPermissoesPorPerfil(req, res) {
    const { perfilId } = req.params;
    try {
      const permissoes = await this.permissaoPerfilService.buscarPermissoesPorPerfil(perfilId);
      res.json(permissoes);
    } catch (error) {
      console.error("Erro ao listar permissões por perfil:", error);
      res.status(500).json({ error: "Erro ao listar permissões por perfil " + error });
    }
  }

  async listarTodasPermissoesPerfil(req, res) {
    try {
      const permissoesPerfil = await this.permissaoPerfilService.listarTodasPermissoesPerfil();
      res.json(permissoesPerfil);
    } catch (error) {
      console.error("Erro ao listar permissões por perfil:", error);
      res.status(500).json({ error: "Erro ao listar permissões por perfil " + error });
    }
  }

  async permissoesAcessoFuncionalidadesPorPerfil(req, res) {
    const { nomePerfil } = req.params;
    try {
      const permissoesPerfil = await this.permissaoPerfilService.permissoesAcessoFuncionalidadesPorPerfil(nomePerfil);
      res.json(permissoesPerfil);
    } catch (error) {
      console.error("Erro ao listar permissões por perfil:", error);
      res.status(500).json({ error: "Erro ao listar permissões por perfil " + error });
    }
  }

  async permissaoPerfisPorNomePerfil(req, res) {
    const { nome } = req.params;
    try {
      const permissoes = await this.permissaoPerfilService.permissaoPerfisPorNomePerfil(nome);
      res.json(permissoes);
    } catch (error) {
      console.error("Erro ao listar permissões por perfil:", error);
      res.status(500).json({ error: "Erro ao listar permissões por perfil " + error });
    }
  }


  // Método para remover a associação entre uma permissão e um perfil
  async deletarPermissaoPerfil(req, res) {
    const { perfilId, permissaoId } = req.params;
    try {
      await this.permissaoPerfilService.deletarPermissaoPerfil(perfilId, permissaoId);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover relação Permissão-Perfil:", error);
      res.status(500).json({ error: "Erro ao remover relação Permissão-Perfil " + error });
    }
  }
}

module.exports = new PermissaoPerfilController();
