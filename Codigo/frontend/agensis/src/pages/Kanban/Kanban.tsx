import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from "axios";
// import { Button } from '@/components/ui/button';
// import { Plus, MoreVertical } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Separator } from '@/components/ui/separator';

import { useNavigate } from 'react-router-dom';


interface ItemProjeto {
  id: string;
  nome: string;
  status: 'Novo' | 'Em Análise' | 'Aguardando Cliente' | 'Aprovado' | 'Recusado' | 'Em Progresso' | 'Concluído' | 'Cancelado';
  responsavel?: string;
  valor?: number;
  prazo?: string;
  data_finalizacao?: string;
}

// Updated status mapping to match backend statuses with frontend display
const statusMapping = {
  'novo': ['Novo'],
  'negociacao': ['Em Análise', 'Aguardando Cliente', 'Aprovado', 'Recusado'],
  'andamento': ['Em Progresso'],
  'finalizado': ['Concluído', 'Cancelado']
};

// Helper function to get frontend display status
const getFrontendStatus = (backendStatus: ItemProjeto['status']) => {
  if (statusMapping.novo.includes(backendStatus)) return 'Novo';
  if (statusMapping.negociacao.includes(backendStatus)) return 'Negociação';
  if (statusMapping.andamento.includes(backendStatus)) return 'Em Andamento';
  if (statusMapping.finalizado.includes(backendStatus)) return 'Finalizado';
  return backendStatus;
};

const KanbanBoard = ({ projetoId }: { projetoId: string }) => {
  const [items, setItems] = useState<ItemProjeto[]>([]);
  const navigate = useNavigate();


  const getToken = () => sessionStorage.getItem("authorization");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:3002/api/itemProjeto', {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Erro ao buscar itens do projeto:", error);
      }
    };

    fetchItems();
  }, [projetoId]);

  // const moveItem = async (itemId: string, newAction: string) => {
  //   try {
  //     let endpoint = '';
  //     let newStatus: ItemProjeto['status'] = 'Novo';

  //     switch (newAction) {
  //       case 'iniciar_negociacao':
  //         endpoint = `/api/itemProjeto/adicionarPropostaItemProjeto/${itemId}`;
  //         newStatus = 'Em Análise';
  //         break;
  //       case 'iniciar_projeto':
  //         endpoint = `/api/itemProjeto/iniciarItemProjeto/${itemId}`;
  //         newStatus = 'Em Progresso';
  //         break;
  //       case 'finalizar':
  //         endpoint = `/api/itemProjeto/concluirItemProjeto/${itemId}`;
  //         newStatus = 'Concluído';
  //         break;
  //       case 'retornar_novo':
  //         endpoint = `/api/itemProjeto/cancelarItemProjeto/${itemId}`;
  //         newStatus = 'Novo';
  //         break;
  //       default:
  //         throw new Error('Ação inválida');
  //     }

  //     const response = await fetch(endpoint, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     if (response.ok) {
  //       setItems((prevItems) =>
  //         prevItems.map((item) =>
  //           item.id === itemId
  //             ? { ...item, status: newStatus }
  //             : item
  //         )
  //       );
  //     } else {
  //       console.error('Erro ao atualizar status do item');
  //     }
  //   } catch (error) {
  //     console.error('Erro:', error);
  //   }
  // };

  const getItemsByStatus = (status: 'novo' | 'negociacao' | 'andamento' | 'finalizado') => {
    return items.filter(item => statusMapping[status].includes(item.status));
  };

  const getAvailableActions = (item: ItemProjeto) => {
    const actions = [];
    const frontendStatus = getFrontendStatus(item.status);

    switch (frontendStatus) {
      case 'Novo':
        actions.push({ label: 'Iniciar Negociação', action: 'iniciar_negociacao' });
        break;
      case 'Negociação':
        if (item.status === 'Aprovado') {
          actions.push({ label: 'Iniciar Projeto', action: 'iniciar_projeto' });
        }
        if (!['Aprovado', 'Recusado', 'Cancelado'].includes(item.status)) {
          actions.push({ label: 'Retornar para Novo', action: 'retornar_novo' });
        }
        break;
      case 'Em Andamento':
        actions.push({ label: 'Finalizar', action: 'finalizar' });
        break;
    }

    return actions;
  };

  const TaskColumn = ({ status, title }: {
    status: 'novo' | 'negociacao' | 'andamento' | 'finalizado';
    title: string
  }) => (
    <div className="flex-1 min-h-[475px]">
      <div className="bg-muted/50 rounded-lg p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
              {getItemsByStatus(status).length}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {getItemsByStatus(status).map((item) => (
            <a onClick={() => navigate('/myitem', { state: { id: item.id } })}>
              <Card key={item.id} className="mb-3 bg-card transition-all hover:ring-1 hover:ring-ring">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-sm font-medium">{item.nome}</CardTitle>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {item.responsavel && (
                    <p className="text-sm text-muted-foreground">
                      Responsável: {item.responsavel}
                    </p>
                  )}
                  {item.valor && (
                    <p className="text-sm text-muted-foreground">
                      Valor: R$ {item.valor}
                    </p>
                  )}
                  {item.prazo && (
                    <p className="text-sm text-muted-foreground">
                      Prazo: {item.prazo}
                    </p>
                  )}
                  {item.data_finalizacao && (
                    <p className="text-sm text-muted-foreground">
                      Finalizado em: {item.data_finalizacao}
                    </p>
                  )}
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col p-6 bg-background text-foreground">
      <div className="mb-5">
        <h2 className="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Kanban
        </h2>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Quadro de Itens do Projeto</h2>
          <p className="text-sm text-muted-foreground">Gerencie os itens do seu projeto</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <TaskColumn status="novo" title="Novo" />
        <TaskColumn status="negociacao" title="Negociação" />
        <TaskColumn status="andamento" title="Em Andamento" />
        <TaskColumn status="finalizado" title="Finalizado" />
      </div>
    </div>
  );
};

export default KanbanBoard;