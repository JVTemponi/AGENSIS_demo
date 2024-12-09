const PacotesRepository = require('../repositories/PacotesRepository');

class PacotesService {
    async criarPacote(titulo, descricao, servicosIds, desconto) {
        return await PacotesRepository.criarPacote(titulo, descricao, servicosIds, desconto);
    }

    async buscarTodosPacotes() {
        return await PacotesRepository.buscarTodosPacotes();
    }

    async buscarPacotePorId(id) {
        return await PacotesRepository.buscarPacotePorId(id);
    }

    async atualizarPacote(id, titulo, descricao, servicosIds, desconto) {
        return await PacotesRepository.atualizarPacote(id, titulo, descricao, servicosIds, desconto);
    }

    async deletarPacote(id) {
        return await PacotesRepository.deletarPacote(id);
    }
}

module.exports = new PacotesService();
