const UsuarioModel = require("../models/UsuarioModel");

class UsuarioRepository {
  constructor() {
    this.usuarioModel = UsuarioModel;
  }

  async criarUsuario(usuarioData) {
    return await this.usuarioModel.create(usuarioData);
  }

  async buscarUsuarioPorId(id) {
    return await this.usuarioModel.findByPk(id);
  }

  async buscarlUsuarioPorEmail(email) {
    return await this.usuarioModel.findOne({ where: { email } });
  }

  async atualizarUsuario(id, updateData) {
    return await this.usuarioModel.update(updateData, { where: { id } });
  }

  async buscarTodosUsuarios() {
    return await this.usuarioModel.findAll();
  }

  async deletarUsuarioTotal(id) {
    return await this.usuarioModel.destroy({ where: { id } });
  }
}

module.exports = new UsuarioRepository();
