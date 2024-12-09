const ServicoModel = require('../models/ServicoModel');
const ServicoCamposModel = require('../models/ServicoCamposModel');


class ServicoRepository {
    constructor() {
        this.servicoModel = ServicoModel;
        this.servicoCamposModel = ServicoCamposModel;
    }

    async buscarTodosServicos() {
        return await this.servicoModel.findAll({
            include: [{ model: this.servicoCamposModel, as: 'campos' }]
        });
    }

    async buscarServicoPorId(id) {
        return await this.servicoModel.findByPk(id, {
            include: [{ model: this.servicoCamposModel, as: 'campos' }]
        });
    }

    async criarServico(dadosServico, dadosCamposServico) {
        const servico = await this.servicoModel.create(dadosServico);

        if (dadosCamposServico) {
            // Processa os campos removendo o id (chega negativo) e adicionando o servico_id
            const camposParaCriar = dadosCamposServico.map(({ id, ...campo }) => ({
                ...campo,
                servico_id: servico.id 
            }));

            // Realiza a inserção em massa dos campos processados
            await this.servicoCamposModel.bulkCreate(camposParaCriar);
        }
        return servico;
    }

    async atualizarServico(serviceId, dadosServico, dadosCamposServico) {
        // Atualiza o ServicoModel
        await this.servicoModel.update(dadosServico, { where: { id: serviceId } });
    
        if (dadosCamposServico && dadosCamposServico.length > 0) {
            // Obtém todos os campos existentes relacionados ao serviço
            const camposExistentes = await this.servicoCamposModel.findAll({
                where: { servico_id: serviceId },
            });
    
            // Cria um mapa de campos existentes para facilitar a busca
            const camposMap = new Map(camposExistentes.map(campo => [campo.id, campo]));
    
            // Verificar se deve criar ou atualizar campos
            for (const campo of dadosCamposServico) {
                const campoExistente = camposMap.get(campo.id);
    
                if (campo.id > 0 && campoExistente) {
                    console.log(`====== CAMPO ID ${campo.id} =========`)
                    // Atualizar o campo se algum dado tiver sido alterado
                    if (
                        campoExistente.nome !== campo.nome ||
                        campoExistente.tipo !== campo.tipo ||
                        campoExistente.obrigatorio !== campo.obrigatorio
                    ) {
                        console.log(`====== ALTERACAO ${campo.id} =========`)
                        await this.servicoCamposModel.update(
                            {
                                nome: campo.nome,
                                tipo: campo.tipo,
                                obrigatorio: campo.obrigatorio,
                            },
                            { where: { id: campoExistente.id } }
                        );
                    }
                } else if (campo.id <= 0) {
                    console.log(`====== NOVO CAMPO ID ${campo.id} =========`)
                    // Criar o campo se ele não existir
                    const { id, ...campoParaCriar } = campo; // Desestruturar para remover o id
                    await this.servicoCamposModel.create({
                        ...campoParaCriar,
                        servico_id: serviceId,
                    });
                }
            }
    
            // Remover campos que não estão mais presentes em `dadosCamposServico`
            const novosIdsCampos = dadosCamposServico.map(campo => campo.id);
            for (const campoExistente of camposExistentes) {
                if (!novosIdsCampos.includes(campoExistente.id)) {
                    console.log(`====== REMOVENDO ${campoExistente.id} =========`)
                    await this.servicoCamposModel.destroy({
                        where: { id: campoExistente.id },
                    });
                }
            }
        }
    
        // Retornar o serviço atualizado com os novos dados
        return this.buscarServicoPorId(serviceId);
    }

    async deletarServico(id) {
        await this.servicoCamposModel.destroy({ where: { servico_id: id } });
        return await this.servicoModel.destroy({ where: { id } });
    }
}

module.exports = new ServicoRepository();