  // TransacaoFinanceiraRepository.js

  const TransacaoFinanceiraModel = require("../models/TransacaoFinanceiraModel");
const { Op } = require('sequelize');

class TransacaoFinanceiraRepository {
  constructor() {
    this.transacaoModel = TransacaoFinanceiraModel;
  }

  async criarTransacao({ nome, descricao, tipo, valor, data, recorrente, intervalo, tempo, status }) {
    console.log("Valores no repositório:", { nome, descricao, tipo, valor, data, recorrente, intervalo, tempo, status });

    const transacao = await TransacaoFinanceiraModel.create({
      nome,
      descricao,
      tipo,
      valor,
      data,
      recorrente,
      intervalo,
      tempo,
      status
    });

    return transacao;
  }

    async atualizarTransacao(id, updateData) {
      return await this.transacaoModel.update(updateData, { where: { id } });
    }

    async finalizarTransacao(id, updateData) {
      return await this.transacaoModel.update(updateData, { where: { id } });
    }

    async buscarTodasTransacoes() {
      return await this.transacaoModel.findAll();
    }

    async buscarTransacaoPorId(id) {
      const transacao = await this.transacaoModel.findByPk(id);
      return transacao;
    }

    async deletarTransacao(id) {
      const resultado = await this.transacaoModel.destroy({
        where: { id }
      });
      return resultado > 0;
    }

    async buscarTransacoesPorStatus(status) {
      return await this.transacaoModel.findAll({ where: { status } });
    }

    async buscarTransacoesPorIntervalo(dataInicio, dataFim) {
      const transacoes = await TransacaoFinanceiraModel.findAll({
        where: {
          data: {
            [Op.between]: [new Date(dataInicio), new Date(dataFim)]
          }
        }
      });
      return transacoes;
    }

    async buscarTransacoesPorValor(valorMinimo, operador = '>=') {
      const operadores = {
        '>=': Op.gte,
        '>': Op.gt,
        '<=': Op.lte,
        '<': Op.lt,
        '=': Op.eq
      };

      const sequelizeOp = operadores[operador] || Op.gte;

      return await this.transacaoModel.findAll({
        where: {
          valor: {
            [sequelizeOp]: valorMinimo
          }
        },
        order: [['valor', 'ASC']]
      });
    }
    
  }

  module.exports = new TransacaoFinanceiraRepository();
