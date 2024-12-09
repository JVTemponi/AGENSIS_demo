const PermissaoModel = require("../models/PermissaoModel");

class PermissaoRepository {
  constructor() {
    this.permissaoModel = PermissaoModel;
  }

  async criarPermissao(permissao) {
    return await this.permissaoModel.create(permissao);
  }

  async buscarPermissaoPorId(id) {
    return await this.permissaoModel.findByPk(id);
  }

  async buscarPermissaoPorNome(nome) {
    return await this.permissaoModel.findOne({ where: { nome } });
  }

  async retornaIdPermissaoPorNome(nome) {
    const id = await this.permissaoModel.findOne({ where: { nome } });
    return id.id_permissao;
  }

  async buscarTodasPermissoes() {
    return await this.permissaoModel.findAll();
  }

}

module.exports = new PermissaoRepository();