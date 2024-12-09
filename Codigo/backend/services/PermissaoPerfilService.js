const PermissaoPerfilRepository = require("../repositories/PermissaoPerfilRepository");
const Perfil = require("../services/PerfilService");
const Permissao = require("../services/PermissaoService");

class PermissaoPerfilService {
  constructor() {
    this.permissaoPerfilRepository = PermissaoPerfilRepository;
    this.perfilService = Perfil;
    this.permissaoService = Permissao;
  }

  async criarPermissaoPerfil(nomePerfil, nomePermissao) {

    const perfil = await this.perfilService.buscarPerfilPorNome(nomePerfil);
    const permissao = await this.permissaoService.buscarPermissaoPorNome(nomePermissao);

    return await this.permissaoPerfilRepository.criarPermissaoPerfil({
      perfil_id: perfil.id,
      permissao_id: permissao.id
    });
  }

  async permissoesAcessoFuncionalidadesPorPerfil(nomePerfil) {

    const perfil = await this.perfilService.buscarPerfilPorNome(nomePerfil);

    if (perfil.nome === 'admin') {
      return ["Usuarios", "Perfis", "Artistas", "Clientes", "Servicos", "Projeto", "Kanban", "Financas"];
    }

    const permissoesPerfil = await this.permissaoPerfilRepository.permissoesAcessoFuncionalidadesPorPerfil(nomePerfil);

    let AcessosPermitidos = [];

    await Promise.all(permissoesPerfil.map(async (permPerfil) => {
      const permissao = await this.permissaoService.buscarPermissaoPorId(permPerfil.permissao_id);

      if (permissao.acao === 'Listar' || permissao.acao === 'Gerenciar') {

        if (!AcessosPermitidos.includes(permissao.recurso)) {
          AcessosPermitidos.push(permissao.recurso);
        }
      }

    }));

    return AcessosPermitidos;
  }

  async buscarPermissoesPorPerfil(perfil_id) {

    const perfil = await this.perfilService.buscarPerfilPorId(perfil_id);

    if (perfil.nome === 'admin') {
      return { "O perfil admin tem acesso a todas as permissões": "Acesso Máximo" };
    }
    return await this.permissaoPerfilRepository.buscarPermissoesPorPerfil(perfil_id);
  }

  async listarTodasPermissoesPerfil() {
    const perfis = await this.permissaoPerfilRepository.listarTodasPermissoesPerfil();

    // Regra adicional para não exibir o perfil admin
    const perfisFiltrados = perfis.filter(perfil => !perfil.hasOwnProperty('admin'));


    console.log(perfisFiltrados);

    return perfisFiltrados;
  }

  async permissaoPerfisPorNomePerfil(nome) {

    if (nome === 'admin') {
      return { "O perfil admin tem acesso a todas as permissões": "Acesso Máximo" };
    }
    return await this.permissaoPerfilRepository.permissaoPerfisPorNomePerfil(nome);
  }

  async deletarPermissaoPerfil(perfil_id, permissao_id) {
    return await this.permissaoPerfilRepository.deletarPermissaoPerfil(perfil_id, permissao_id);
  }
}

module.exports = new PermissaoPerfilService();
