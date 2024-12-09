import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import {
  User, DollarSign, Clock, CheckCircle, Calendar, Tag
} from "lucide-react";
import { Item } from './Types';
import { Edicao } from './Edicao';
import { ViewCliente } from './ViewCliente';

interface PedidoInfoProps {
  item: Item | null;
  onItemChange: (updatedItem: Item) => void;
  onSave: () => void;
}

export const PedidoInfo: React.FC<PedidoInfoProps> = ({ item, onItemChange, onSave }) => {
  const [perfil, setPerfil] = useState<string | null>(null);

  const formatDate = (date: string | null) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Recuperar o perfil do sessionStorage
    const storedPerfil = sessionStorage.getItem("perfil");
    setPerfil(storedPerfil); // Atualizar o estado com o valor do sessionStorage
  }, []);

  return (
    <>
      {/* Informações Básicas */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Tag className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Responsável</p>
                <p className="font-medium text-foreground">
                  {item?.responsavel || 'Não definido'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-medium text-foreground">
                  {item?.valor ? `R$ ${item.valor}` : 'Não informado'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prazo</p>
                <p className="font-medium text-foreground">
                  {formatDate(item?.prazo ?? null) || 'Não especificado'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle className="h-5 w-5" />
            Área do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="">
            {/* Diferenciar tipo de perfil */}
            {perfil === 'cliente' ? (
                <>
              <ViewCliente item={item} />
              </>
            ) : (
              <>
            <Edicao 
              item={item} 
              onItemChange={(updatedItem) => console.log(updatedItem)} 
              onSave={() => console.log('Save clicked')} 
              />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Datas */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5" />
            Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Data de Criação</p>
              <p className="text-lg font-medium text-foreground">
                {new Date(item?.data_criacao || '').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Data de Finalização</p>
              <p className="text-lg font-medium text-foreground">
                {item?.data_finalizacao
                  ? new Date(item.data_finalizacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                  : 'Em andamento'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
