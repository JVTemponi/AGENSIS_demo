const { UsuarioModel } = require("../models");
const ReuniaoModel = require("../models/ReuniaoModel");

class ReuniaoRepository {
    constructor() {
      this.reuniaoModel = ReuniaoModel;
      this.usuarioModel = UsuarioModel;
    }
  
    async buscarReunioes() {
      return await this.reuniaoModel.findAll();
    }

    async buscarReunioesPorIdUsuario(usuario_id) {
      return await this.reuniaoModel.findAll({
        where: { usuario_id },
        include: [{ model: this.usuarioModel, as: 'usuario' }], 
      });
    }
    

  
    async buscarReuniaoPorId(id) {
      return await this.reuniaoModel.findByPk(id);
    }
  
    async criarReuniao(dados) {
      return await this.reuniaoModel.create(dados);
    }
  
    async atualizarReuniao(id, dados) {
      return await this.reuniaoModel.update(dados, { where: { id } });
    }
  
    async deletarReuniao(id) {
      return await this.reuniaoModel.destroy({ where: { id } });
    }
}

  module.exports = new ReuniaoRepository(require('../models/ReuniaoModel'));
  