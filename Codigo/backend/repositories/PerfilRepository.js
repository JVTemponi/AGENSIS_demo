const PerfilModel = require("../models/PerfilModel");

class PerfilRepository {
  constructor() {
    this.perfilModel = PerfilModel;
  }

  async criarPerfil(perfilData) {
    return await this.perfilModel.create(perfilData);
  }

  async buscarPerfilPorId(id) {
    return await this.perfilModel.findByPk(id);
  }

  async buscarPerfilPorNome(nome) {
    return await this.perfilModel.findOne({ where: { nome } });
  }

  async atualizarPerfil(id, updateData) {
    return await this.perfilModel.update(updateData, { where: { id } });
  }

  async buscarTodosPerfis() {
    return await this.perfilModel.findAll();
  }

  async deletarPerfil(id) {
    return await this.perfilModel.destroy({ where: { id } });
  }
}

module.exports = new PerfilRepository();