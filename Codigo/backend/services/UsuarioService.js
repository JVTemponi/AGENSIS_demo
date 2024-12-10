const jwt = require("jsonwebtoken");
const UsuarioRepository = require("../repositories/UsuarioRepository");
const PerfilService = require("../services/PerfilService");
const {
  criptografar,
  validarCriptografia,
  validarEmail,
} = require("../utils/criptografiaUtils");

class UsuarioService {
  constructor() {
    this.usuarioRepository = UsuarioRepository;
    this.perfilService = PerfilService;
  }

  async criarUsuario(email, senha, nomePerfil) {
    if (!(await validarEmail(email))) {
      throw new Error("Email inválido");
    }

    try {
      const senhaCriptografada = await criptografar(senha);
      console.log(senhaCriptografada);

      const perfil = await this.perfilService.buscarPerfilPorNome(nomePerfil);

      const usuario = await this.usuarioRepository.criarUsuario({
        email,
        senha: senhaCriptografada,
        perfil_id: perfil.id,
      });
      console.log(usuario);
      return usuario;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Erro ao criar usuário");
    }
  }

  async buscarTodosUsuarios() {
    try {
      return await this.usuarioRepository.buscarTodosUsuarios();
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw new Error("Erro ao listar usuários");
    }
  }

  async buscarUsuarioPorId(id) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      const perfil = await this.perfilService.buscarPerfilPorId(usuario.perfil_id);

      return { ...usuario.dataValues, perfil: perfil.nome };


    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw new Error("Erro ao buscar usuário por ID");
    }
  }

  async buscarUsuarioPorEmail(email) {
    try {
      const usuario = await this.usuarioRepository.buscarlUsuarioPorEmail(email);
      return usuario;
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw new Error("Erro ao buscar usuário por email");
    }
  }

  async login(email, senha) {
    try {
      const usuario = await this.usuarioRepository.buscarlUsuarioPorEmail(
        email
      );
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      const senhaValida = await validarCriptografia(senha, usuario.senha);
      if (!senhaValida) {
        throw new Error("Senha incorreta");
      }
      if (usuario.status !== "1") {
        throw new Error("Usuário inativo");
      }

      const perfil = await this.perfilService.buscarPerfilPorId(
        usuario.perfil_id
      );

      const token = jwt.sign(
        {
          user_id: usuario.id,
          perfil: perfil.nome,
          status: usuario.status,
          email: usuario.email,
        },
        'artespro',
        { expiresIn: "3h" }
      );

      return { token };
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Erro ao fazer login");
    }
  }

  async atualizarUsuario(id, senha, status) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      if (senha) {
        usuario.senha = await criptografar(senha);
      }
      if (status) {
        usuario.status = status;
      }

      await usuario.save();
      return usuario;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw new Error("Erro ao atualizar usuário");
    }
  }

  async alterarSenha(id, senhaAtual, novaSenha) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) { throw new Error("Usuário não encontrado"); }
      const senhaValida = await validarCriptografia(senhaAtual, usuario.senha);
      if (!senhaValida) { throw new Error("Senha incorreta"); }

      const senhaCriptografada = await criptografar(novaSenha);

      usuario.senha = senhaCriptografada;
      await usuario.save();
      return usuario;

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw new Error("Erro ao alterar senha");
    }
  }

  async alterarPerfil(id, nomePerfil) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) { throw new Error("Usuário não encontrado"); }

      let perfil;

      if (nomePerfil) {
        perfil = await this.perfilService.buscarPerfilPorNome(nomePerfil);
      }
      if (perfil) {
        usuario.perfil_id = perfil.id;
        await usuario.save();
      }
      else {
        throw new Error("Erro ao identificar e associar o novo perfil ao usuário");
      }

      return usuario;
    } catch (error) {
      console.error("Erro ao alterar perfil do usuário:", error);
      throw new Error("Erro ao alterar perfil do usuário");
    }
  }

  //Metodo para exclusão simbólica do usuário, removendo o status e colocado uma senha segura padrao
  // Senha padrão: "dXN1YXJpbyBleGNsdWlkbyBjb20gc3VjZXNzbw==" -> formatação base64 para "usuario excluido com sucesso"
  async excluirUsuario(id) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      usuario.email = `${usuario.id}@usuario_deletado.com`;
      usuario.senha = "dXN1YXJpbyBleGNsdWlkbyBjb20gc3VjZXNzbw==";
      usuario.status = 3;

      await usuario.save();

      return true;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw new Error("Erro ao excluir usuário");
    }
  }

  async deletarUsuarioTotal(id) {
    try {
      const usuario = await this.usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      this.usuarioRepository.deletarUsuarioTotal(usuario.id);
      return true;
    } catch (error) {
      console.error("Erro ao destruir totalmente usuário", error);
      throw new Error("Erro ao destruir usuário");
    }
  }
}

module.exports = new UsuarioService();
