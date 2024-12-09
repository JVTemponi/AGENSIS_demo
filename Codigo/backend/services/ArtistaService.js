const ArtistaRepository = require("../repositories/ArtistaRepository");
const UsuarioService = require("../services/UsuarioService");
const PerfilService = require("../services/PerfilService");

class ArtistaService {
  constructor() {
    this.artistaRepository = ArtistaRepository;
    this.usuarioService = UsuarioService;
    this.perfilService = PerfilService;
  }

  async criarArtista(nome, sobrenome, cpf, habilidades, experiencia, usuarioArtista, perfilArtista) {
    if (!nome || !sobrenome || !cpf) {
      throw new Error("Dados insuficientes para criação do artista, necessário nome, sobrenome e cpf");
    }
    if (!perfilArtista || !usuarioArtista.email || !usuarioArtista.senha) {
      throw new Error("Dados insuficientes para criação do artista, necessário perfil, email e senha");
    }

    let usarioCriado;
    const perfil = await this.perfilService.buscarPerfilPorNome(perfilArtista);

    try {
      usarioCriado = await this.usuarioService.criarUsuario(
        usuarioArtista.email,
        usuarioArtista.senha,
        perfil.nome
      );

      const dadosArtista = {
        nome,
        sobrenome,
        cpf,
        habilidades: habilidades || 'Não informadas',
        experiencia: experiencia || 'Não informada',
        usuario_id: usarioCriado.id
      };

      const artista = await this.artistaRepository.criarArtista(dadosArtista);

      return artista;
    } catch (error) {
      if (usarioCriado) {
        try {
          await this.usuarioService.deletarUsuarioTotal(usarioCriado.id);
        } catch (excluirError) {
          console.error(
            "Erro ao excluir usuário após falha na criação do artista:",
            excluirError
          );
        }
      }
    }
    throw new Error("Erro ao criar artista");
  }

  async buscarTodosArtistas() {
    return await this.artistaRepository.buscarTodosArtistas();
  }

  async buscarArtistaPorId(id) {
    const artista = await this.artistaRepository.buscarArtistaPorId(id);
    if (!artista) throw new Error("Artista não encontrado");
    return artista;
  }

  async buscarArtistaPorUsuarioId(usuarioId) {
    const artista = await this.artistaRepository.buscarArtistaPorUsuarioId(usuarioId);
    if (!artista) throw new Error("artista não encontrado");

    const usuario = await this.usuarioService.buscarUsuarioPorId(artista.usuario_id);

    const artistaComUsuario = {
      ...artista.dataValues,
      usuario_perfil: usuario.perfil,
      usuario_email: usuario.email,
      usuario_status: usuario.status === "1" ? "ativo" : "inativo",
    };

    return artistaComUsuario;
  }

  async completarCadastroArtista(id, habilidades, experiencia) {
    const artista = await this.artistaRepository.buscarArtistaPorId(id);
    if (!artista) throw new Error("Artista não encontrado");

    if (!habilidades || !experiencia) {
      throw new Error("Informe o tempo de experiência e habilidades do artista");
    }
    else {
      const dadosArtista = {
        habilidades,
        experiencia
      };
      await this.artistaRepository.atualizarArtista(artista.id, dadosArtista);
    }

    return await this.artistaRepository.buscarArtistaPorId(id);
  }

  async atualizarPerfilArtista(id, perfilArtista) {
    let usuario;
    const artista = await this.artistaRepository.buscarArtistaPorId(id);
    if (!artista) throw new Error("Artista não encontrado");

    if (!perfilArtista) {
      throw new Error("Informe o novo perfil do artista");
    }
    else {
      await this.usuarioService.alterarPerfil(artista.usuario_id, perfilArtista);
      usuario = await this.usuarioService.buscarUsuarioPorId(artista.usuario_id);
    }

    return {
      ...artista.dataValues,
      usuario_email: usuario.email,
      perfilUsuario: usuario.perfil
    };
  }

  async atualizarArtista(id, dadosAtualizados) {
    const artista = await this.artistaRepository.buscarArtistaPorId(id);
    if (!artista) throw new Error("Artista não encontrado");

    Object.assign(artista, dadosAtualizados);
    await artista.save();
    return artista;
  }

  //Limpeza dos dados sensíveis, sem a exclusão total do registro
  async excluirArtista(id) {
    try {
      const artista = await this.artistaRepository.buscarArtistaPorId(id);
      if (!artista) throw new Error("Artista não encontrado");

      const usuario = await this.usuarioService.buscarUsuarioPorId(artista.usuario_id);

      //Verifica se o usuário já não foi excluído
      if (usuario.status !== "3") {
        //Limpeza dos dados sensíveis de artista
        artista.nome = `${artista.nome} -> (artista excluído)`;
        artista.sobrenome = `${artista.sobrenome} -> (artista excluído)`;
        artista.cpf = `$ID:${artista.id}_cpf`;
        artista.habilidades = null;
        artista.experiencia = null;

        await artista.save();
        //Limpando dados do usuário
        await this.usuarioService.excluirUsuario(artista.usuario_id);
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir artista:", error);
      throw new Error("Erro ao excluir artista");
    }
  }
}

module.exports = new ArtistaService();
