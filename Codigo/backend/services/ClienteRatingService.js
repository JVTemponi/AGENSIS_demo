const ClienteRatingRepository = require('../repositories/ClienteRatingRepository');

class ClienteRatingService {
  async obterClientes(artistaId) {
    return await ClienteRatingRepository.buscarClientes(artistaId);
  }

  async criarAvaliacao(dadosAvaliacao) {
    return await ClienteRatingRepository.criarAvaliacao(dadosAvaliacao);
  }

  async atualizarAvaliacao(clienteId, artistaId, novasInfos) {
    return await ClienteRatingRepository.atualizarAvaliacao(clienteId, artistaId, novasInfos);
  }

}

module.exports = new ClienteRatingService();