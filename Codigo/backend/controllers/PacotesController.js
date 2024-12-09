const PacotesService = require('../services/PacotesService');

class PacotesController {

    async criarPacote(req, res) {
        const { titulo, descricao, servicosIds } = req.body;
 
        try {
            const pacote = await PacotesService.criarPacote(titulo, descricao, servicosIds);
            res.status(201).json(pacote);
        } catch (error) {
            console.error('Erro ao criar pacote:', error);
            res.status(500).json({ error: error.message });
        }
    } 

    async listarTodosPacotes(req, res) {
        try {
            const pacotes = await PacotesService.buscarTodosPacotes();
            res.status(200).json(pacotes);
        } catch (error) {
            console.error('Erro ao listar pacotes:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPacotePorId(req, res) {
        const { id } = req.params;

        try {
            const pacote = await PacotesService.buscarPacotePorId(id);
            if (!pacote) {
                return res.status(404).json({ error: 'Pacote não encontrado' });
            }
            res.status(200).json(pacote);
        } catch (error) {
            console.error('Erro ao buscar pacote:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async atualizarPacote(req, res) {
        const { id } = req.params;
        const { titulo, descricao, servicosIds } = req.body;

        try {
            const pacoteAtualizado = await PacotesService.atualizarPacote(id, titulo, descricao, servicosIds);
            if (!pacoteAtualizado) {
                return res.status(404).json({ error: 'Pacote não encontrado' });
            }
            res.status(200).json({ message: 'Pacote atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar pacote:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deletarPacote(req, res) {
        const { id } = req.params;

        try {
            const deletado = await PacotesService.deletarPacote(id);
            if (!deletado) {
                return res.status(404).json({ error: 'Pacote não encontrado' });
            }
            res.status(200).json({ message: 'Pacote deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar pacote:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PacotesController();
