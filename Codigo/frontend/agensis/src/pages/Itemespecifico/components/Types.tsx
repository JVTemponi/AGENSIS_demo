export interface Proposta {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  valor: number;
  prazo: string; // ISO date string
}

export interface Projeto {
  id: number;
  nome: string;
  cliente_id: number;
}

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
}

export interface Campo {
  id: number;
  nome_campo: string;
  valor_digitado: string;
  item_projeto_id: number;
}

export interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string | null;
  data_nascimento: string | null; // ISO date string
  telefone: string | null;
  usuario_id: number;
}

export interface Item {
  id: number;
  nome: string;
  responsavel: string | null;
  valor: number | null;
  prazo: string | null; // ISO date string
  status: string;
  data_criacao: string; // ISO date string
  data_finalizacao: string | null; // ISO date string
  projeto_id: number;
  servico_id: number;
  artista_id: number | null;
  cliente_id: number;
  proposta_id: number;
  projeto?: Projeto; // Adicionando relação com projeto
  servico?: Servico; // Adicionando relação com serviço
  campos?: Campo[]; // Adicionando relação com campos
  cliente?: Cliente; // Adicionando relação com cliente
  proposta?: Proposta; // Adicionando relação com proposta
}

export const statusGroups = {
  novo: ["Novo"],
  negociacao: ["Em Análise", "Aguardando Cliente", "Aprovado", "Recusado"],
  andamento: ["Em Progresso"],
  finalizado: ["Concluído", "Cancelado"],
};

export const statusOrder = [
  "Novo",
  "Em Análise",
  "Aguardando Cliente",
  "Aprovado",
  "Recusado",
  "Em Progresso",
  "Concluído",
  "Cancelado",
];
