const express = require("express");
const ClienteController = require("../controllers/ClienteController");
const autenticacao = require("../utils/autenticacao");

class ClienteRoutes {
  constructor() {
    this.clienteController = ClienteController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas sem restrição
    this.router.post(
      "/clientes",
      this.clienteController.criarCliente.bind(this.clienteController)
    );

    // Rotas com restrição e permissão necessária
    this.router.get(
      "/clientes/usuario/:usuarioId",
      autenticacao(false, ""), 
      this.clienteController.buscarClientePorUsuarioId.bind(this.clienteController)
    );
    this.router.get(
      "/clientes/:id",
      autenticacao(false, ""),
      this.clienteController.buscarClientePorId.bind(this.clienteController)
    );
    this.router.get(
      "/clientes",
      autenticacao(false, ""),
      this.clienteController.listarTodosClientes.bind(this.clienteController)
    );
    this.router.put(
      "/clientes/completarCadastro/:id",
      autenticacao(false, ""),
      this.clienteController.completarCadastroCLiente.bind(this.clienteController)
    );
    this.router.put(
      "/clientes/:id",
      autenticacao(true, ""),
      this.clienteController.atualizarCliente.bind(this.clienteController)
    );
    this.router.delete(
      "/clientes/:id",
      autenticacao(true, ""),
      this.clienteController.excluirCliente.bind(this.clienteController)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new ClienteRoutes().getRouter();
