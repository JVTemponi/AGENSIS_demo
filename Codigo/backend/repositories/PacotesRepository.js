const PacotesModel = require('../models/PacotesModel');
const PacotesServicoModel = require('../models/PacotesServicoModel');
const ServicoModel = require('../models/ServicoModel');

class PacotesRepository {
    
    async buscarTodosPacotes() {
        return await PacotesModel.findAll({
            include: [{
                model: ServicoModel,  
                as: 'servicos',
                 
            }]
        });
    }

    async buscarPacotePorId(id) {
        return await PacotesModel.findByPk(id, {
            include: [{
                model: ServicoModel,
                as: 'servicos',  
                through: { attributes: [] }, 
            }]
        });
    }

    // Função atualizarPacote sem transaction
    async atualizarPacote(id, titulo, descricao, servicosIds) { 
        try {
            const pacote = await PacotesModel.findByPk(id);
            if (!pacote) return null;

            // 1. Atualiza os dados básicos do pacote
            pacote.titulo = titulo;
            pacote.descricao = descricao;
            await pacote.save();

            // 2. Remove todas as associações existentes
            await PacotesServicoModel.destroy({
                where: { pacote_id: id }
            });

            // 3. Se foram enviados novos serviços, cria as novas associações
            if (servicosIds && servicosIds.length > 0) {
                // Verifica se todos os serviços existem
                const servicos = await ServicoModel.findAll({
                    where: { id: servicosIds }
                });

                if (servicos.length !== servicosIds.length) {
                    throw new Error('Alguns serviços não foram encontrados');
                }

                // Cria as novas associações
                const novasAssociacoes = servicosIds.map(servicoId => ({
                    pacote_id: id,
                    servico_id: servicoId
                }));

                await PacotesServicoModel.bulkCreate(novasAssociacoes);
            }

            // 4. Busca o pacote atualizado com os novos serviços
            const pacoteAtualizado = await PacotesModel.findByPk(id, {
                include: [{
                    model: ServicoModel,
                    as: 'servicos',
                    attributes: ['id', 'nome']
                }]
            });

            return pacoteAtualizado;

        } catch (error) {
            console.error('Erro ao atualizar pacote:', error);
            throw error;
        }
    }

    // Função criarPacote sem transaction
    async criarPacote(titulo, descricao, servicosIds) {
        try {
            // 1. Cria o pacote
            const pacote = await PacotesModel.create({
                titulo,
                descricao
            });

            // 2. Se foram enviados serviços, cria as associações
            if (servicosIds && servicosIds.length > 0) {
                // Verifica se todos os serviços existem
                const servicos = await ServicoModel.findAll({
                    where: { id: servicosIds }
                });

                if (servicos.length !== servicosIds.length) {
                    throw new Error('Alguns serviços não foram encontrados');
                }

                // Cria as associações
                const associacoes = servicosIds.map(servicoId => ({
                    pacote_id: pacote.id,
                    servico_id: servicoId
                }));

                await PacotesServicoModel.bulkCreate(associacoes);
            }

            // 3. Retorna o pacote com os serviços incluídos
            const pacoteCompleto = await PacotesModel.findByPk(pacote.id, {
                include: [{
                    model: ServicoModel,
                    as: 'servicos',
                    attributes: ['id', 'nome']
                }]
            });

            return pacoteCompleto;

        } catch (error) {
            console.error('Erro ao criar pacote:', error);
            throw error;
        }
    }

    async deletarPacote(id) {
        return await PacotesModel.destroy({ where: { id } });
    }
}

module.exports = new PacotesRepository();
