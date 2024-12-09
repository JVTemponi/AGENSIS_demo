const ArtistaModel = require("../models/ArtistaModel");
const UsuarioRepository = require("./UsuarioRepository");
class ArtistaRepository {
  constructor() {
    this.artistaModel = ArtistaModel;
    this.usuarioRepository = UsuarioRepository;
  }

  async criarArtista(dadosArtista) {
    return await this.artistaModel.create(dadosArtista);
  }

  async buscarArtistaPorId(id) {
    return await this.artistaModel.findByPk(id);
  }

  async buscarArtistaPorUsuarioId(usuarioId) {
    return await this.artistaModel.findOne({ where: { usuario_id: usuarioId } });
  }

  async atualizarArtista(id, updateData) {
    return await this.artistaModel.update(updateData, { where: { id } });
  }

  async buscarTodosArtistas() {
    return await this.artistaModel.findAll();
  }

  async deletarArtista(id) {
    return await this.artistaModel.destroy({ where: { id } });
  }
}

module.exports = new ArtistaRepository();
