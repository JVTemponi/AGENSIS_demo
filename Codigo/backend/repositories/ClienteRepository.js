const ClienteModel = require("../models/ClienteModel");
const UsuarioRepository = require("./UsuarioRepository");

class ClienteRepository {
  constructor() {
    this.clienteModel = ClienteModel;
    this.usuarioRepository = UsuarioRepository;
  }

  async criarCliente(dadosCliente) {
    return await this.clienteModel.create(dadosCliente);
  }

  async buscarClientePorId(id) {
    return await this.clienteModel.findByPk(id);
  }

  async buscarClientePorUsuarioId(usuarioId) {
    const usuario = await this.usuarioRepository.buscarUsuarioPorId(usuarioId);
    const cliente = await this.clienteModel.findOne({ where: { usuario_id: usuarioId } });

    const clienteComUsuario = {
      ...cliente.dataValues,
      usuario_email: usuario.email,
      usuario_status: usuario.status === "1" ? "ativo" : "inativo",
    };

    return clienteComUsuario;
  }

  async atualizarCliente(id, updateData) {
    return await this.clienteModel.update(updateData, { where: { id } });
  }

  async buscarTodosClientes() {
    return await this.clienteModel.findAll();
  }

  async deletarCliente(id) {
    return await this.clienteModel.destroy({ where: { id } });
  }
}

module.exports = new ClienteRepository();
