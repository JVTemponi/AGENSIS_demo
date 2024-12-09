const { ProjetoModel, ItemProjetoModel } = require("../models");
const ClienteModel = require("../models/ClienteModel");
const ClienteRatingModel = require("../models/ClienteRatingModel");
const UsuarioModel = require("../models/UsuarioModel");

class ClienteRatingRepository {
  constructor() {
    this.clienteRatingModel = ClienteRatingModel;
  }

  async buscarClientes(artista_id) {
    return await ClienteModel.findAll({
        include: [
            {
              model: ClienteRatingModel,
              where: {
              artista_id
              },
              required: false,
              as: 'avaliacao'
            },
            {
              model: UsuarioModel,
              as: 'usuario'
            },
            {
              model: ItemProjetoModel,
              as: 'itensProjeto'
            }
        ]
    });
  }
  
  async criarAvaliacao(dadosAvaliacao) {
    return await this.clienteRatingModel.create(dadosAvaliacao);
  }

  async atualizarAvaliacao(cliente_id, artista_id, updateData) {
    return await this.clienteRatingModel.update(updateData, {
      where: {
        cliente_id,
        artista_id
      }
    });
  }

}

module.exports = new ClienteRatingRepository();