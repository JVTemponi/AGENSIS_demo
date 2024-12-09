
const PermissaoPerfil = require("../repositories/PermissaoPerfilRepository");
const Perfil = require("../repositories/PerfilRepository");
const Permissao = require("../repositories/PermissaoRepository");


async function checarPermissao(nomePerfil, nomePermissao) {

    const perfil = await Perfil.buscarPerfilPorNome(nomePerfil);
    const permissao = await Permissao.buscarPermissaoPorNome(nomePermissao);
    const permissaoGerenciar = await Permissao.buscarPermissaoPorNome(`Gerenciar${permissao.recurso}`);

    if (await PermissaoPerfil.buscarPermissaoPerfil(perfil.id, permissaoGerenciar.id)) {
        return true;
    }
    else if (!await PermissaoPerfil.buscarPermissaoPerfil(perfil.id, permissao.id)) {
        console.log("Acesso negado");
        return false;
    }
    else {
        return true;
    }
}

module.exports = checarPermissao;