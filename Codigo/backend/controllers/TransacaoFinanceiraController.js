// controllers/TransacaoFinanceiraController.js
const TransacaoFinanceiraService = require('../services/TransacaoFinanceiraService');

class TransacaoFinanceiraController {
  constructor() {
    this.transacaoService = TransacaoFinanceiraService;
  }

  async criarTransacao(req, res) {
    console.log('INICIO DA REQUISIÇÃO');
    console.log('Conteúdo do req.body CONTROLLER:', req.body);
    try {
      const transacao = await this.transacaoService.criarTransacao(req.body);
      res.status(201).json(transacao);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({ error: 'Erro ao criar transação: ' + error.message });
    }
  }

  async buscarTransacaoPorId(req, res) {
    try {
      const transacao = await this.transacaoService.buscarTransacaoPorId(req.params.id);
      res.json(transacao);
    } catch (error) {
      console.error('Erro ao buscar transação por ID:', error);
      res.status(404).json({ error: 'Transação não encontrada ' + error.message });
    }
  }

  async buscarTodasTransacoes(req, res) {
    try {
      const transacoes = await this.transacaoService.buscarTodasTransacoes();
      res.json(transacoes);
    } catch (error) {
      console.error('Erro ao listar transações:', error);
      res.status(500).json({ error: 'Erro ao listar transações ' + error.message });
    }
  }
  async atualizarTransacao(req, res) {
    const { id } = req.params; // Pega o ID da transação a ser atualizada
    console.log('Atualizando transação com ID:', id);

    try {
      // Envie todos os dados do req.body para o serviço
      const transacaoAtualizada = await this.transacaoService.atualizarTransacao(id, req.body);
      res.status(200).json(transacaoAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      res.status(500).json({ error: 'Erro ao atualizar transação: ' + error.message });
    }
  }

  async deletarTransacao(req, res) {
    try {
      const { id } = req.params;
      
      await this.transacaoService.deletarTransacao(id);
      
      return res.status(204).end();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      
      if (error.message === "Transação não encontrada") {
        return res.status(404).json({ 
          error: 'Transação não encontrada'
        });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao deletar transação: ' + error.message 
      });
    }
  }

  async buscarTransacoesPorStatus(req, res) {

    try {
      const { status } = req.params;
      const transacoes = await this.transacaoService.buscarTransacoesPorStatus(status);
      res.json(transacoes);
    } catch (error) {
      console.error('Erro ao buscar transações por status:', error);
      res.status(500).json({ error: 'Erro ao buscar transações por status ' + error.message });
    }
  }


  async buscarTransacoesPorIntervalo(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;

      // Validação das datas
      if (!dataInicio || !dataFim) {
        return res.status(400).json({ 
          error: 'As datas de início e fim são obrigatórias' 
        });
      }

      // Validar formato das datas
      const dataInicioValid = new Date(dataInicio);
      const dataFimValid = new Date(dataFim);

      if (isNaN(dataInicioValid.getTime()) || isNaN(dataFimValid.getTime())) {
        return res.status(400).json({ 
          error: 'Formato de data inválido. Use YYYY-MM-DD' 
        });
      }

      // Garantir que a data final não seja menor que a inicial
      if (dataFimValid < dataInicioValid) {
        return res.status(400).json({ 
          error: 'A data final não pode ser menor que a data inicial' 
        });
      }

      const transacoes = await this.transacaoService.buscarTransacoesPorIntervalo(
        dataInicio,
        dataFim
      );

      return res.status(200).json(transacoes);
    } catch (error) {
      console.error('Erro ao buscar transações por intervalo:', error);
      return res.status(500).json({ 
        error: 'Erro ao buscar transações por intervalo' 
      });
    }
  }

  async buscarTransacoesPorValor(req, res) {
    try {
      const { valor, operador } = req.query;

      if (!valor) {
        return res.status(400).json({
          error: 'O valor é obrigatório'
        });
      }

      const transacoes = await this.transacaoService.buscarTransacoesPorValor(valor, operador);

      return res.status(200).json(transacoes);
    } catch (error) {
      console.error('Erro ao buscar transações por valor:', error);
      return res.status(500).json({
        error: error.message || 'Erro ao buscar transações por valor'
      });
    }
  }

}

module.exports = new TransacaoFinanceiraController();
