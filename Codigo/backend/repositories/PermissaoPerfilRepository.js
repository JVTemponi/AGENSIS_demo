const PermissaoPerfilModel = require("../models/PermissaoPerfilModel");
const PerfilModel = require("../models/PerfilModel");
const PermissaoModel = require("../models/PermissaoModel");

class PermissaoPerfilRepository {
  constructor() {
    this.permissaoPerfilModel = PermissaoPerfilModel;
  }

  async criarPermissaoPerfil(permissaoPerfilData) {
    return await this.permissaoPerfilModel.create(permissaoPerfilData);
  }

  async buscarPermissaoPerfil(perfilId, permissaoId) {
    return await this.permissaoPerfilModel.findOne({
      where: { perfil_id: perfilId, permissao_id: permissaoId },
    });
  }

  async buscarPermissoesPorPerfil(perfilId) {
    return await this.permissaoPerfilModel.findAll({
      where: { perfil_id: perfilId },
    });
  }

  async listarTodasPermissoesPerfil() {
    const perfis = await PerfilModel.findAll({
      include: {
        model: PermissaoModel,
        through: { model: PermissaoPerfilModel, attributes: [] },
        attributes: ["nome"],
      },
      attributes: ["nome"],
    });
    const resultadoTratado = perfis.map((perfil) => {
      return { [perfil.nome]: perfil.PermissaoModels ? perfil.PermissaoModels.map((perm) => perm.nome) : [] };
    });

    return resultadoTratado;
  }

  async permissaoPerfisPorNomePerfil(nome) {
    const perfil = await PerfilModel.findOne({
      where: { nome },
      include: {
        model: PermissaoModel,
        through: { model: PermissaoPerfilModel, attributes: [] },
        attributes: ["nome"],
      },
      attributes: ["nome"],
    });

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    const permissoes = perfil.PermissaoModels;
    const resultado = { [perfil.nome]: permissoes ? permissoes.map((perm) => perm.nome) : [] };

    return resultado;
  }

  async permissoesAcessoFuncionalidadesPorPerfil(nome) {
    const perfil = await PerfilModel.findOne({ where: { nome } });

    return await this.permissaoPerfilModel.findAll({
      where: { perfil_id: perfil.id },
    });
  }

  async deletarPermissaoPerfil(perfil_id, permissao_id) {
    return await this.permissaoPerfilModel.destroy({
      where: { perfil_id, permissao_id },
    });
  }
}

module.exports = new PermissaoPerfilRepository();
