const ClienteRepository = require("../repositories/ClienteRepository");
const UsuarioService = require("../services/UsuarioService");

class ClienteService {
  constructor() {
    this.clienteRepository = ClienteRepository;
    this.usuarioService = UsuarioService;
  }

  async criarCliente(nome, sobrenome, usuarioCLiente) {
    if (!nome || !sobrenome || !usuarioCLiente.email || !usuarioCLiente.senha) {
      throw new Error("Dados insuficientes para criação do cliente");
    }
    let usuarioCriado;
    try {
      usuarioCriado = await this.usuarioService.criarUsuario(
        usuarioCLiente.email,
        usuarioCLiente.senha,
        "cliente"
      );

      const dadosCliente = {
        nome,
        sobrenome,
        cpf: null,
        data_nascimento: null,
        telefone: null,
        usuario_id: usuarioCriado.id,
      };
      const cliente = await this.clienteRepository.criarCliente(dadosCliente);

      return cliente;
    } catch (error) {
      if (usuarioCriado) {
        try {
          await this.usuarioService.deletarUsuarioTotal(usuarioCriado.id);
        } catch (excluirError) {
          console.error(
            "Erro ao excluir usuário após falha na criação do cliente:",
            excluirError
          );
        }
      }
    }
    throw new Error("Erro ao criar cliente");
  }

  async buscarTodosClientes() {
    return await this.clienteRepository.buscarTodosClientes();
  }

  async buscarClientePorId(id) {
    const cliente = await this.clienteRepository.buscarClientePorId(id);
    if (!cliente) throw new Error("Cliente não encontrado");
    return cliente;
  }

  async buscarClientePorUsuarioId(usuarioId) {
    const cliente = await this.clienteRepository.buscarClientePorUsuarioId(usuarioId);
    if (!cliente) throw new Error("Cliente não encontrado");
    return cliente;
  }

  async completarCadastroCLiente(id, cpf, data_nascimento, telefone) {
    const cliente = await this.clienteRepository.buscarClientePorId(id);
    if (!cliente) throw new Error("Cliente não encontrado");

    if (!cpf || !data_nascimento || !telefone) {
      throw new Error("Existem campos obrigatórios não preenchidos");
    }
    else {
      const dadosCliente = {
        cpf,
        data_nascimento,
        telefone
      };
      await this.clienteRepository.atualizarCliente(cliente.id, dadosCliente);
    }
    return cliente;
  }

  async atualizarCliente(id, nome, sobrenome, cpf, data_nascimento, telefone) {
    const cliente = await this.clienteRepository.buscarClientePorId(id);
    if (!cliente) throw new Error("Cliente não encontrado");

    const dadosCliente = { nome, sobrenome, cpf, data_nascimento, telefone };

    //Para utilizar apenas os campos preenchidos
    const camposPrenchidos = Object.fromEntries(
      Object.entries(dadosCliente).filter(([_, value]) => value != null && value != "")
    );

    // Atualiza o cliente apenas com os campos peenchidos
    Object.assign(cliente, camposPrenchidos);
    await cliente.save();
    return cliente;
  }

  //Limpeza dos dados sensíveis, sem a exclusão total do registro
  async excluirCliente(id) {
    try {
      const cliente = await this.clienteRepository.buscarClientePorId(id);
      if (!cliente) throw new Error("Cliente não encontrado");

      const usuario = await this.usuarioService.buscarUsuarioPorId(cliente.usuario_id);

      //Verifica se o usuário já não foi excluído
      if (usuario.status !== "3") {
        //Limpeza dos dados sensíveis de cliente
        cliente.nome = `${cliente.nome} -> (cliente excluído)`;
        cliente.sobrenome = `${cliente.sobrenome} -> (cliente excluído)`;
        cliente.cpf = `$ID:${cliente.id}_cpf`;
        cliente.data_nascimento = null;
        cliente.telefone = null;

        await cliente.save();
        //Limpando dados do usuário
        await this.usuarioService.excluirUsuario(cliente.usuario_id);
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      throw new Error("Erro ao excluir cliente");
    }
  }
}

module.exports = new ClienteService();
