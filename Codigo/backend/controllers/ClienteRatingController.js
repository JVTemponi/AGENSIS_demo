const ArtistaService = require('../services/ArtistaService');
const ClienteRatingService = require('../services/ClienteRatingService');

class ClienteRatingController {
  async listarClientes(req, res) {
    try {
      const { userId } = req.params;
      const artista = await ArtistaService.buscarArtistaPorUsuarioId(userId);
      if (!artista) {
        return res.status(404).json({ message: "Artista não encontrado" });
      }
      const clientes = await ClienteRatingService.obterClientes(artista.id);
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async criarAvaliacao(req, res) {
    try {
      const { cliente_id, user_id, rate } = req.body;
      
      const artista = await ArtistaService.buscarArtistaPorUsuarioId(user_id);
      if (!artista) {
        return res.status(404).json({ message: "Artista não encontrado" });
      }
      const novaAvaliacao = await ClienteRatingService.criarAvaliacao({
        cliente_id: cliente_id,
        artista_id: artista.id,
        rate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(201).json(novaAvaliacao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizarAvaliacao(req, res) {
    try {
      const { clienteId, userId } = req.params;
      const { rate } = req.body;

      const artista = await ArtistaService.buscarArtistaPorUsuarioId(userId);
      if (!artista) {
        return res.status(404).json({ message: "Artista não encontrado" });
      }

      const atualizacaoRealizada = await ClienteRatingService.atualizarAvaliacao(
        clienteId,
        artista.id,
        { 
          rate
          //updatedAt: new Date()
        }
      );
      res.status(200).json(atualizacaoRealizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new ClienteRatingController();