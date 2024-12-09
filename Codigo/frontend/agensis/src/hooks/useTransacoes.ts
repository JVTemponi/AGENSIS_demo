import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transacao {
  id: number;
  nome: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  data: string;
  status: 'concluido' | 'pendente' | 'cancelado';
}


interface TransacoesPorMes {
  month: string;
  total: number;
  timestamp: number;
}

const API_URL = 'http://localhost:3002/api';

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const getToken = () => sessionStorage.getItem("authorization");

  const buscarTransacoes = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${API_URL}/transacoes`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
      });
      // Garantir que os valores são números
      const transacoesFormatadas = response.data.map((t: Transacao) => ({
        ...t,
        valor: Number(t.valor)
      }));
      setTransacoes(transacoesFormatadas);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      const mensagemErro = err.response?.data?.error || err.message || 'Erro ao buscar transações';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTransacoes();
  }, []);


  // Funções para entradas

  const processarEntradasPorMes = (dataInicio?: Date, dataFim?: Date): TransacoesPorMes[] => {
    const entradasFiltradas = transacoes.filter(t => {
      const dataTransacao = new Date(t.data);
      return (
        t.tipo === 'entrada' &&
        t.status === 'concluido' &&
        (!dataInicio || dataTransacao >= dataInicio) &&
        (!dataFim || dataTransacao <= dataFim)
      );
    });

    if (entradasFiltradas.length === 0) return [];

    const entradasPorMes = entradasFiltradas.reduce((acc, transaction) => {
      const date = new Date(transaction.data);
      const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
      const valor = Number(transaction.valor);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          timestamp: date.getTime()
        };
      }
      acc[monthYear].total += valor;

      return acc;
    }, {} as Record<string, { total: number; timestamp: number }>);

    return Object.entries(entradasPorMes)
      .map(([month, { total, timestamp }]) => ({
        month,
        total,
        timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const calcularVariacaoMensal = (): number => {
    const dadosMensais = processarEntradasPorMes();
    if (dadosMensais.length < 2) return 0;

    const mesAtual = dadosMensais[dadosMensais.length - 1].total;
    const mesAnterior = dadosMensais[dadosMensais.length - 2].total;

    return ((mesAtual - mesAnterior) / mesAnterior) * 100;
  };

  const processarEntradasPendentesPorMes = (): TransacoesPorMes[] => {
    const pendentesFiltradas = transacoes.filter(t => t.tipo === 'entrada' && t.status === 'pendente');
    if (pendentesFiltradas.length === 0) return [];

    const pendentesPorMes = pendentesFiltradas.reduce((acc, transaction) => {
      const date = new Date(transaction.data);
      const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
      const valor = Number(transaction.valor);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          timestamp: date.getTime()
        };
      }
      acc[monthYear].total += valor;

      return acc;
    }, {} as Record<string, { total: number; timestamp: number }>);

    return Object.entries(pendentesPorMes)
      .map(([month, { total, timestamp }]) => ({
        month,
        total,
        timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const calcularVariacaoMensalPendentes = (): number => {
    const dadosPendentes = processarEntradasPendentesPorMes();
    if (dadosPendentes.length < 2) return 0;

    const mesAtual = dadosPendentes[dadosPendentes.length - 1].total;
    const mesAnterior = dadosPendentes[dadosPendentes.length - 2].total;

    return ((mesAtual - mesAnterior) / mesAnterior) * 100;
  };

  // Funções para saídas

  const processarSaidasPorMes = (dataInicio?: Date, dataFim?: Date): TransacoesPorMes[] => {
    const saidasFiltradas = transacoes.filter(t => {
      const dataTransacao = new Date(t.data);
      return (
        t.tipo === 'saida' &&
        t.status === 'concluido' &&
        (!dataInicio || dataTransacao >= dataInicio) &&
        (!dataFim || dataTransacao <= dataFim)
      );
    });

    if (saidasFiltradas.length === 0) return [];

    const saidasPorMes = saidasFiltradas.reduce((acc, transaction) => {
      const date = new Date(transaction.data);
      const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
      const valor = Number(transaction.valor);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          timestamp: date.getTime()
        };
      }
      acc[monthYear].total += valor;

      return acc;
    }, {} as Record<string, { total: number; timestamp: number }>);

    return Object.entries(saidasPorMes)
      .map(([month, { total, timestamp }]) => ({
        month,
        total,
        timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const calcularVariacaoMensalSaidas = (): number => {
    const dadosMensais = processarSaidasPorMes();
    if (dadosMensais.length < 2) return 0;

    const mesAtual = dadosMensais[dadosMensais.length - 1].total;
    const mesAnterior = dadosMensais[dadosMensais.length - 2].total;

    return ((mesAtual - mesAnterior) / mesAnterior) * 100;
  };

  const processarSaidasPendentesPorMes = (): TransacoesPorMes[] => {
    const pendentesFiltradas = transacoes.filter(t => t.tipo === 'saida' && t.status === 'pendente');
    if (pendentesFiltradas.length === 0) return [];

    const pendentesPorMes = pendentesFiltradas.reduce((acc, transaction) => {
      const date = new Date(transaction.data);
      const monthYear = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
      const valor = Number(transaction.valor);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          timestamp: date.getTime()
        };
      }
      acc[monthYear].total += valor;

      return acc;
    }, {} as Record<string, { total: number; timestamp: number }>);

    return Object.entries(pendentesPorMes)
      .map(([month, { total, timestamp }]) => ({
        month,
        total,
        timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const calcularVariacaoMensalPendentesSaidas = (): number => {
    const dadosPendentes = processarSaidasPendentesPorMes();
    if (dadosPendentes.length < 2) return 0;

    const mesAtual = dadosPendentes[dadosPendentes.length - 1].total;
    const mesAnterior = dadosPendentes[dadosPendentes.length - 2].total;

    return ((mesAtual - mesAnterior) / mesAnterior) * 100;
  };

  // Função para comparar entradas e saídas

  const calcularVariacaoPendencias = (): number => {
    const entradasPendentes = processarEntradasPendentesPorMes();
    const saidasPendentes = processarSaidasPendentesPorMes();

    if (entradasPendentes.length === 0 && saidasPendentes.length === 0) return 0;

    const totalEntradasPendentes = entradasPendentes.reduce((acc, item) => acc + item.total, 0);
    const totalSaidasPendentes = saidasPendentes.reduce((acc, item) => acc + item.total, 0);

    if (totalSaidasPendentes === 0) return totalEntradasPendentes > 0 ? 100 : 0; // Evita divisão por zero.

    return ((totalEntradasPendentes - totalSaidasPendentes) / totalSaidasPendentes) * 100;
  };

  const calcularVariacaoConfirmadas = (): number => {
    const entradasConfirmadas = processarEntradasPorMes();
    const saidasConfirmadas = processarSaidasPorMes();

    if (entradasConfirmadas.length === 0 && saidasConfirmadas.length === 0) return 0;

    const totalEntradasConfirmadas = entradasConfirmadas.reduce((acc, item) => acc + item.total, 0);
    const totalSaidasConfirmadas = saidasConfirmadas.reduce((acc, item) => acc + item.total, 0);

    if (totalSaidasConfirmadas === 0) return totalEntradasConfirmadas > 0 ? 100 : 0; // Evita divisão por zero.

    return ((totalEntradasConfirmadas - totalSaidasConfirmadas) / totalSaidasConfirmadas) * 100;
  };

  // Função auxiliar para garantir valores numéricos
  const garantirNumero = (valor: number | string): number => {
    if (typeof valor === 'string') {
      return parseFloat(valor) || 0;
    }
    return valor || 0;
  };


  const processarEntradasConfirmadas = (): number => {
    return transacoes
      .filter(t => t.tipo === 'entrada' && t.status === 'concluido')
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  const processarEntradasPendentes = (): number => {
    return transacoes
      .filter(t => t.tipo === 'entrada' && t.status === 'pendente')
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  const processarSaidasPendentes = (): number => {
    return transacoes
      .filter(t => t.tipo === 'saida' && t.status === 'pendente')
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  const processarSaidasConfirmadas = (): number => {
    return transacoes
      .filter(t => t.tipo === 'saida' && t.status === 'concluido')
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  const processarTransacoesCanceladas = (): number => {
    return transacoes
      .filter(t => t.status === 'cancelado')
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  // Calcula o valor total de transações do último mês
  const calcularTotalUltimoMes = (): number => {
    const now = new Date();
    const ultimoMes = new Date(now.getFullYear(), now.getMonth() - 1);

    const transacoesUltimoMes = transacoes.filter(t => {
      const dataTransacao = new Date(t.data);
      return (
        dataTransacao.getFullYear() === ultimoMes.getFullYear() &&
        dataTransacao.getMonth() === ultimoMes.getMonth() &&
        t.status === 'concluido'
      );
    });

    return transacoesUltimoMes.reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);
  };

  // Retorna as três próximas transações
  const proximasTresTransacoes = (): Transacao[] => {
    const now = new Date();
    return transacoes
      .filter(t => new Date(t.data) > now && t.status === 'pendente')
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 3);
  };

  // Calcula a previsão do próximo mês (entradas previstas - saídas previstas)
  const calcularPrevisaoProximoMes = (): number => {
    const now = new Date();
    const proximoMes = new Date(now.getFullYear(), now.getMonth() + 1);

    const entradasPrevistas = transacoes
      .filter(t => t.tipo === 'entrada' && t.status === 'pendente' && new Date(t.data).getMonth() === proximoMes.getMonth() && new Date(t.data).getFullYear() === proximoMes.getFullYear())
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);

    const saidasPrevistas = transacoes
      .filter(t => t.tipo === 'saida' && t.status === 'pendente' && new Date(t.data).getMonth() === proximoMes.getMonth() && new Date(t.data).getFullYear() === proximoMes.getFullYear())
      .reduce((acc, transacao) => acc + garantirNumero(transacao.valor), 0);

    return entradasPrevistas - saidasPrevistas;
  };


  return {
    transacoes,
    loading,
    error,
    processarEntradasPorMes,
    calcularVariacaoMensal,
    processarEntradasPendentesPorMes,
    calcularVariacaoMensalPendentes,
    processarSaidasPorMes,
    calcularVariacaoMensalSaidas,
    processarSaidasPendentesPorMes,
    calcularVariacaoMensalPendentesSaidas,
    calcularVariacaoPendencias,
    calcularVariacaoConfirmadas,
    processarEntradasConfirmadas,
    processarEntradasPendentes,
    processarSaidasPendentes,
    processarSaidasConfirmadas,
    processarTransacoesCanceladas,
    buscarTransacoes,
    calcularTotalUltimoMes,
    proximasTresTransacoes,
    calcularPrevisaoProximoMes
  };
}
