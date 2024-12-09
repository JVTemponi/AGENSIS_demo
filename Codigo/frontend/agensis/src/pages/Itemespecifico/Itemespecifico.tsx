import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline } from './components/Timeline';
import { PedidoInfo } from './components/PedidoInfo';
import { Item, statusOrder } from "./components/Types";

export default function ItemEspecifico() {
  const location = useLocation();
  const { id } = location.state || {};

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3002/api/itemProjeto/${id}`)
        .then((response) => {
          const itemData = response.data;
          setItem(itemData);
        })
        .catch((err) => {
          setError(err.message || "Erro ao buscar o item.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleItemChange = (updatedItem: Item) => {
    setItem(updatedItem);
  };

  const saveChanges = () => {
    if (!item) return;
    axios
      .put(`http://localhost:3002/api/itemProjeto/${item.id}`, item)
      .then(() => {
        console.log("Alterações salvas com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao salvar alterações:", err);
      });
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Novo': 'bg-primary text-primary-foreground',
      'Em Análise': 'bg-warning text-warning-foreground',
      'Aguardando Cliente': 'bg-warning text-warning-foreground',
      'Aprovado': 'bg-success text-success-foreground',
      'Recusado': 'bg-destructive text-destructive-foreground',
      'Em Progresso': 'bg-primary text-primary-foreground',
      'Concluído': 'bg-success text-success-foreground',
      'Cancelado': 'bg-destructive text-destructive-foreground'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-full px-4 py-6 lg:px-8 lg:py-8">
        {/* Header Section */}
        <Card className="mb-6 border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ID #{item?.id}</p>
                <h1 className="text-3xl font-bold text-foreground">{item?.nome}</h1>
              </div>
              <Badge
                className={`${getStatusColor(item?.status || 'Novo')} px-4 py-2`}
              >
                {item?.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>
        
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-6">
            <PedidoInfo 
              item={item} 
              onItemChange={handleItemChange}
              onSave={saveChanges}
            />
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:sticky lg:top-6 overflow-y-auto">
            <Timeline item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}