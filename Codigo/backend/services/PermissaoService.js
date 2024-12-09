const PermissaoRepository = require("../repositories/PermissaoRepository");

class PermissaoService {
  constructor() {
    this.permissaoRepository = PermissaoRepository;
  }

  async buscarTodasPermissoes() {
    return await this.permissaoRepository.buscarTodasPermissoes();
  }

  async buscarPermissaoPorNome(nome) {
    return await this.permissaoRepository.buscarPermissaoPorNome(nome);
  }

  async buscarPermissaoPorId(id) {
    const permissao = await this.permissaoRepository.buscarPermissaoPorId(id);
    if (!permissao) throw new Error("Permissão não encontrada");
    return permissao;
  }

  async carregarPermissoes() {
    const configuracao = {
      Usuarios: ['Listar', 'Editar', 'Inativar', 'Gerenciar'],
      Perfis: ['Criar', 'Listar', 'Editar', 'Gerenciar'],
      Artistas: ['Criar', 'Listar', 'Editar', 'Gerenciar'],
      Clientes: ['Listar', 'Editar', 'Gerenciar'],
      Servicos: ['Criar', 'Listar', 'Editar', 'Gerenciar'],
      Projeto: ['Listar', 'Editar', 'Gerenciar'],
      Kanban: ['Listar', 'Editar', 'Gerenciar'],
      Financas: ['Criar', 'Listar', 'Editar', 'Gerenciar'],
    };

    for (const [recurso, acoes] of Object.entries(configuracao)) {
      for (const acao of acoes) {

        let nomePermissao;
        let existente = true;

        if (acao && recurso) {
          nomePermissao = `${acao.trim()}${recurso.trim()}`;
          existente = await this.permissaoRepository.buscarPermissaoPorNome(nomePermissao);
        }

        if (!existente && nomePermissao) {
          // Validação final antes de criar
          const permissao = {
            nome: nomePermissao,
            acao,
            recurso,
          };
          await this.permissaoRepository.criarPermissao(permissao);
        }
      }
    }
  }

}

module.exports = new PermissaoService();
