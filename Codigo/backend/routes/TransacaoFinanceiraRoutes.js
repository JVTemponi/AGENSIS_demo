// TransacaoFinanceiraRoutes.js

const express = require('express');
const TransacaoFinanceiraController = require('../controllers/TransacaoFinanceiraController');
const autenticacao = require('../utils/autenticacao');

class TransacaoFinanceiraRoutes {
  constructor() {
    this.transacaoFinanceiraController = TransacaoFinanceiraController;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rotas adicionais com filtro por status, intervalo de data e valor
    this.router.get('/transacoes/status/:status', autenticacao(true, 'ListarFinancas'), this.transacaoFinanceiraController.buscarTransacoesPorStatus.bind(this.transacaoFinanceiraController));
    this.router.get('/transacoes/intervalo', autenticacao(true, 'ListarFinancas'), this.transacaoFinanceiraController.buscarTransacoesPorIntervalo.bind(this.transacaoFinanceiraController));
    this.router.get('/transacoes/valor', autenticacao(true, 'ListarFinancas'), this.transacaoFinanceiraController.buscarTransacoesPorValor.bind(this.transacaoFinanceiraController));

    // Rotas para transações financeiras, sem restrição de permissão
    this.router.post('/transacoes', autenticacao(true, 'CriarFinancas'), this.transacaoFinanceiraController.criarTransacao.bind(this.transacaoFinanceiraController));
    this.router.get('/transacoes', autenticacao(true, 'GerenciarFinancas'), this.transacaoFinanceiraController.buscarTodasTransacoes.bind(this.transacaoFinanceiraController));
    this.router.get('/transacoes/:id', autenticacao(true, 'ListarFinancas'), this.transacaoFinanceiraController.buscarTransacaoPorId.bind(this.transacaoFinanceiraController));
    this.router.put('/transacoes/:id', autenticacao(true, 'EditarFinancas'), this.transacaoFinanceiraController.atualizarTransacao.bind(this.transacaoFinanceiraController));
    this.router.delete('/transacoes/:id', autenticacao(true, 'GerenciarFinancas'), this.transacaoFinanceiraController.deletarTransacao.bind(this.transacaoFinanceiraController));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new TransacaoFinanceiraRoutes().getRouter();
