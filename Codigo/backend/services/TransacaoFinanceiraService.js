const TransacaoFinanceiraRepository = require("../repositories/TransacaoFinanceiraRepository");

class TransacaoFinanceiraService {
  constructor() {
    this.transacaoRepository = TransacaoFinanceiraRepository;
  }

  formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
  }

  calcularProximasDatas(dataInicial, intervalo, quantidade) {
    const datas = [];
    let dataAtual = new Date(dataInicial);
    
    for (let i = 0; i < quantidade; i++) {
      const novaData = new Date(dataAtual);
      
      switch (intervalo.toLowerCase()) {
        case 'diario':
          novaData.setDate(dataAtual.getDate() + i);
          break;
        case 'quinzenal':
          novaData.setDate(dataAtual.getDate() + (i * 15));
          break;
        case 'mensal':
          novaData.setMonth(dataAtual.getMonth() + i);
          break;
        case 'semestral':
          novaData.setMonth(dataAtual.getMonth() + (i * 6));
          break;
        case 'anual':
          novaData.setFullYear(dataAtual.getFullYear() + i);
          break;
        default:
          throw new Error("Intervalo inválido");
      }
      
      datas.push(novaData);
    }
    
    return datas;
  }

  async criarTransacao({ nome, descricao, tipo, valor, data, recorrente, intervalo, tempo, status }) {
    // Validações
    if (!nome || nome.trim() === '') {
      throw new Error("O nome da transação é obrigatório.");
    }

    if (!['entrada', 'saida'].includes(tipo)) {
      throw new Error("O tipo de transação deve ser 'entrada' ou 'saida'.");
    }

    if (valor <= 0) {
      throw new Error("O valor da transação deve ser positivo.");
    }

    if (recorrente && !intervalo) {
      throw new Error("O intervalo é obrigatório para transações recorrentes.");
    }

    if (recorrente && (!tempo || tempo <= 0)) {
      throw new Error("O tempo (quantidade de repetições) deve ser um número positivo para transações recorrentes.");
    }

    // Criar a transação principal
    const transacaoPrincipal = await this.transacaoRepository.criarTransacao({
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

    // Se for recorrente, criar as transações futuras
    if (recorrente) {
      const dataInicial = new Date(data);
      const quantidade = tempo || 12; // Usa o valor de tempo informado ou 12 como padrão
      const datasFuturas = this.calcularProximasDatas(dataInicial, intervalo, quantidade);
      
      // Remove a primeira data pois já criamos a transação principal
      datasFuturas.shift();
      
      // Criar transações futuras com nome modificado
      const transacoesFuturas = await Promise.all(
        datasFuturas.map(dataFutura => 
          this.transacaoRepository.criarTransacao({
            nome: `${nome} - ${this.formatarData(dataFutura)}`,
            descricao,
            tipo,
            valor,
            data: dataFutura,
            recorrente: false,
            intervalo: null,
            tempo: null,
            status: 'pendente'
          })
        )
      );

      return {
        transacaoPrincipal,
        transacoesFuturas
      };
    }

    return transacaoPrincipal;
  }  
  // Busca uma transação pelo ID
  async buscarTransacaoPorId(id) {
    const transacao = await this.transacaoRepository.buscarTransacaoPorId(id);
    if (!transacao) {
      throw new Error("Transação não encontrada.");
    }
    return transacao;
  }


  // Busca todas as transações
  async buscarTodasTransacoes() {
    try {
      return await this.transacaoRepository.buscarTodasTransacoes();
    } catch (error) {
      console.error("Erro ao listar transações:", error);
      throw new Error("Erro ao listar transações");
    }
  }

  // Atualizar uma transação
  async atualizarTransacao(id, dados) {
    // Validação do nome se estiver sendo atualizado
    if (dados.nome !== undefined && (!dados.nome || dados.nome.trim() === '')) {
      throw new Error("O nome da transação é obrigatório.");
    }

    if (dados.tipo && !['entrada', 'saida'].includes(dados.tipo)) {
      throw new Error("O tipo de transação deve ser 'entrada' ou 'saida'.");
    }
  
    const transacaoAtualizada = await this.transacaoRepository.atualizarTransacao(id, dados);
    return transacaoAtualizada;
  }

  async finalizarTransacao(id, updateData) {
    // Validar se a transação existe
    const transacao = await this.transacaoRepository.buscarTransacaoPorId(id);
    if (!transacao) {
      throw new Error("Transação não encontrada");
    }

    if(updateData.status !== 'concluido' && updateData.status !== 'cancelado') {
      throw new Error("Status inválido. Use 'concluido' ou 'cancelado'");
    }

    return await this.transacaoRepository.finalizarTransacao(transacao.id, updateData);
  }


  

  // Excluir uma transação de forma permanente
  async deletarTransacao(id) {
    const transacao = await this.transacaoRepository.buscarTransacaoPorId(id);
    if (!transacao) {
      throw new Error("Transação não encontrada");
    }

    const deletado = await this.transacaoRepository.deletarTransacao(id);
    if (!deletado) {
      throw new Error("Não foi possível deletar a transação");
    }

    return true;
  }

  // Buscar transações por status
  async buscarTransacoesPorIntervalo(dataInicio, dataFim) {
    console.log('Dados recebidos pelo services:', dataInicio, 'e', dataFim);
    const transacoes = await this.transacaoRepository.buscarTransacoesPorIntervalo(dataInicio, dataFim);
    return transacoes;
  }

  async buscarTransacoesPorValor(valor, operador) {
    // Validar se o valor é um número válido
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico)) {
      throw new Error("O valor deve ser um número válido");
    }

    // Validar o operador
    const operadoresValidos = ['>=', '>', '<=', '<', '='];
    if (operador && !operadoresValidos.includes(operador)) {
      throw new Error("Operador inválido. Use: >=, >, <=, <, ou =");
    }

    return await this.transacaoRepository.buscarTransacoesPorValor(valorNumerico, operador);
  }
}

module.exports = new TransacaoFinanceiraService();
