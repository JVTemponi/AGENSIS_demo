const PerfilRepository = require("../repositories/PerfilRepository");

class PerfilService {
  constructor() {
    this.perfilRepository = PerfilRepository;
  }

  async criarPerfil(nome) {
    try {
      const perfil = await this.perfilRepository.criarPerfil({ nome });
      return perfil;
    } catch (error) {
      throw new Error("Erro ao criar perfil");
    }
  }

  async buscarTodosPerfis() {
    return await this.perfilRepository.buscarTodosPerfis();
  }

  async buscarPerfilPorId(id) {
    const perfil = await this.perfilRepository.buscarPerfilPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");
    return perfil;
  }

  async buscarPerfilPorNome(nome) {
    const perfil = await this.perfilRepository.buscarPerfilPorNome(nome);
    if (!perfil) throw new Error("Perfil não encontrado");
    return perfil;
  }

  async atualizarPerfil(id, nome) {
    const perfil = await this.perfilRepository.buscarPerfilPorId(id);
    if (!perfil) throw new Error("Perfil não encontrado");

    perfil.nome = nome;
    await perfil.save();
    return perfil;
  }

  async deletarPerfil(id) {
    return await this.perfilRepository.deletarPerfil(id);
  }
}

module.exports = new PerfilService();
