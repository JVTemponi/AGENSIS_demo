const ProjetoModel = require('../models/ProjetoModel');

class ProjetoRepository {
    constructor() {
        this.projetoModel = ProjetoModel;
    }

    async criarProjeto(projetoData) {
        return await this.projetoModel.create(projetoData);
    }

    async buscarProjetoPorId(id) {
        return await this.projetoModel.findByPk(id);
    }

    async buscarProjetoPorNome(nome) {
        return await this.projetoModel.findOne({ where: { nome } });
    }


        async buscarTodosProjetosPorClienteId(clienteId) {
        const query = 'SELECT * FROM projetos WHERE cliente_id = $1';
        const values = [clienteId];
        try {
            const result = await this.db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error("Erro ao buscar projetos por cliente ID:", error);
            throw new Error("Erro ao buscar projetos por cliente ID");
        }
    }

    async retornaIdProjetoPorNome(nome) {
        const id = await this.projetoModel.findOne({ where: { nome } });
        return id.id_projeto;
    }

    async buscarTodosProjetos() {
        return await this.projetoModel.findAll();
    }

    async deletarProjeto(id) {
        return await this.projetoModel.destroy({ where: { id } });
    }
}

module.exports = new ProjetoRepository(require('../models/ProjetoModel'));