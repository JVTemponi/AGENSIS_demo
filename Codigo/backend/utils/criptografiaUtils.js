const bcrypt = require("bcryptjs");

async function criptografar(palavra) {
  const salt = await bcrypt.genSalt(10);
  const palavraCriptografada = await bcrypt.hash(palavra, salt);
  return palavraCriptografada;
}

async function validarCriptografia(palavra, palavraCriptografada) {
  let comparacao = false;
  // Verificaa se a entrada é criptografada
  if (palavraCriptografada.startsWith("$2b$") || palavraCriptografada.startsWith("$2a$")) {
    // Compara a senha do parâmetro com a senha criptografada no banco de dados
    comparacao = await bcrypt.compare(palavra, palavraCriptografada);
  } else {
    // Compara com a senha não criptografada no banco de dados. Para o caso de usuário criados anteriormente à criptografia
    comparacao = palavra === palavraCriptografada;
  }
  return comparacao;
}

async function validarEmail(email) {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Testando o email na validação regex
  if (regexEmail.test(email)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  criptografar,
  validarCriptografia,
  validarEmail,
};
