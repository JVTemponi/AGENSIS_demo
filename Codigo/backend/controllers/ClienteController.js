const ClienteService = require('../services/ClienteService');

class ClienteController {
  constructor() {
    this.clienteService = ClienteService;
  }

  async criarCliente(req, res) {
    const { nome, sobrenome, usuarioCLiente } = req.body;
    try {
      const cliente = await this.clienteService.criarCliente(
        nome,
        sobrenome,
        usuarioCLiente
      );
      res.status(201).json(cliente);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      res.status(500).json({ error: "Erro ao criar cliente " + error });
    }
  }

  async listarTodosClientes(req, res) {
    try {
      const clientes = await this.clienteService.buscarTodosClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      res.status(500).json({ error: "Erro ao listar clientes " + error });
    }
  }

  async buscarClientePorId(req, res) {
    const { id } = req.params;
    try {
      const cliente = await this.clienteService.buscarClientePorId(id);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente por ID:", error);
      res.status(500).json({ error: "Erro ao buscar cliente por ID " + error });
    }
  }

  async buscarClientePorUsuarioId(req, res) {
    const { usuarioId } = req.params;
    try {
      const cliente = await this.clienteService.buscarClientePorUsuarioId(usuarioId);
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente por ID de usuário:", error);
      res.status(500).json({ error: "Erro ao buscar cliente por ID de usuário " + error });
    }
  }

  async completarCadastroCLiente(req, res) {
    const { id } = req.params;
    const { cpf, data_nascimento, telefone } = req.body;
    try {
      const cliente = await this.clienteService.completarCadastroCLiente(id, cpf, data_nascimento, telefone);
      res.json(cliente);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      res.status(500).json({ error: "Erro ao atualizar cliente " + error });
    }
  }


  async atualizarCliente(req, res) {
    const { id } = req.params;
    const { nome, sobrenome, cpf, data_nascimento, telefone } = req.body;
    try {
      const cliente = await this.clienteService.atualizarCliente(id, nome, sobrenome, cpf, data_nascimento, telefone);
      res.json(cliente);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      res.status(500).json({ error: "Erro ao atualizar cliente " + error });
    }
  }

  async excluirCliente(req, res) {
    const { id } = req.params;
    try {
      await this.clienteService.excluirCliente(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      res.status(500).json({ error: "Erro ao excluir cliente " + error });
    }
  }
}

module.exports = new ClienteController();
