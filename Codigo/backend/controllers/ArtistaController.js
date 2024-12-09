const ArtistaService = require('../services/ArtistaService');

class ArtistaController {
  constructor() {
    this.artistaService = ArtistaService;
  }

  async criarArtista(req, res) {
    const { nome, sobrenome, cpf, habilidades, experiencia, usuarioArtista, perfilArtista } = req.body;
    try {
      const artista = await this.artistaService.criarArtista(
        nome,
        sobrenome,
        cpf,
        habilidades,
        experiencia,
        usuarioArtista,
        perfilArtista
      );
      res.status(201).json(artista);
    } catch (error) {
      console.error("Erro ao criar artista:", error);
      res.status(500).json({ error: "Erro ao criar artista " + error });
    }
  }

  async listarTodosArtistas(req, res) {
    try {
      const artistas = await this.artistaService.buscarTodosArtistas();
      res.json(artistas);
    } catch (error) {
      console.error("Erro ao listar artistas:", error);
      res.status(500).json({ error: "Erro ao listar artistas " + error });
    }
  }

  async buscarArtistaPorId(req, res) {
    const { id } = req.params;
    try {
      const artista = await this.artistaService.buscarArtistaPorId(id);
      if (!artista) {
        return res.status(404).json({ message: "Artista não encontrado" });
      }
      res.json(artista);
    } catch (error) {
      console.error("Erro ao buscar artista por ID:", error);
      res.status(500).json({ error: "Erro ao buscar artista por ID " + error });
    }
  }

  async buscarArtistaPorUsuarioId(req, res) {
    const { usuarioId } = req.params;
    try {
      const artista = await this.artistaService.buscarArtistaPorUsuarioId(usuarioId);
      if (!artista) {
        return res.status(404).json({ message: "Artista não encontrado" });
      }
      res.json(artista);
    } catch (error) {
      console.error("Erro ao buscar artista por ID de usuário:", error);
      res.status(500).json({ error: "Erro ao buscar artista por ID de usuário " + error });
    }
  }

  async completarCadastroArtista(req, res) {
    const { id } = req.params;
    const { habilidades, experiencia } = req.body;
    try {
      const artista = await this.artistaService.completarCadastroArtista(id, habilidades, experiencia);
      res.json(artista);
    } catch (error) {
      console.error("Erro ao atualizar artista:", error);
      res.status(500).json({ error: "Erro ao atualizar artista " + error });
    }
  }

  async atualizarPerfilArtista(req, res) {
    const { id } = req.params;
    const { perfilArtista } = req.body;
    try {
      const artista = await this.artistaService.atualizarPerfilArtista(id, perfilArtista);
      res.json(artista);
    } catch (error) {
      console.error("Erro ao atualizar artista:", error);
      res.status(500).json({ error: "Erro ao atualizar artista " + error });
    }
  }

  async atualizarArtista(req, res) {
    const { id } = req.params;
    const { nome, especialidade } = req.body;
    try {
      const artista = await this.artistaService.atualizarArtista(id, nome, especialidade);
      res.json(artista);
    } catch (error) {
      console.error("Erro ao atualizar artista:", error);
      res.status(500).json({ error: "Erro ao atualizar artista " + error });
    }
  }

  async excluirArtista(req, res) {
    const { id } = req.params;
    try {
      await this.artistaService.excluirArtista(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao excluir artista:", error);
      res.status(500).json({ error: "Erro ao excluir artista " + error });
    }
  }
}

module.exports = new ArtistaController();
