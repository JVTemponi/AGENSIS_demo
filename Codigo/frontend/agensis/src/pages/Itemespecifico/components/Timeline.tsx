import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Clock4, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { Item, statusGroups, statusOrder } from "./Types";

interface TimelineProps {
  item: Item | null;
}

export const Timeline: React.FC<TimelineProps> = ({ item }) => {
  const isStatusCompleted = (status: string) => {
    const currentStatusOrder = statusOrder.indexOf(item?.status || '');
    const checkStatusOrder = statusOrder.indexOf(status);
    return checkStatusOrder < currentStatusOrder;
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'Novo': <Circle className="h-6 w-6" />,
      'Em Análise': <AlertCircle className="h-6 w-6" />,
      'Aguardando Cliente': <Clock4 className="h-6 w-6" />,
      'Aprovado': <CheckCircle2 className="h-6 w-6" />,
      'Recusado': <XCircle className="h-6 w-6" />,
      'Em Progresso': <Clock className="h-6 w-6" />,
      'Concluído': <CheckCircle className="h-6 w-6" />,
      'Cancelado': <XCircle className="h-6 w-6" />
    };
    return icons[status] || <Circle className="h-6 w-6" />;
  };

  const statusColors = {
    'Novo': 'bg-primary text-primary-foreground',
    'Em Análise': 'bg-warning text-warning-foreground',
    'Aguardando Cliente': 'bg-warning text-warning-foreground',
    'Aprovado': 'bg-success text-success-foreground',
    'Recusado': 'bg-destructive text-destructive-foreground',
    'Em Progresso': 'bg-primary text-primary-foreground',
    'Concluído': 'bg-success text-success-foreground',
    'Cancelado': 'bg-destructive text-destructive-foreground'
  };

  const getStatusColor = (status: keyof typeof statusColors) => {
    return statusColors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">
          Progresso do Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(statusGroups).map(([group, statuses]) => (
            <div key={group} className="relative">
              <h3 className="mb-4 text-lg font-semibold text-foreground capitalize">
                {group.replace('_', ' ')}
              </h3>
              <div className="space-y-6">
                {statuses.map((status, index) => {
                  const isCurrentStatus = item?.status === status;
                  const isPastStatus = isStatusCompleted(status);

                  return (
                    <div
                      key={status}
                      className={`relative flex items-center ${index !== statuses.length - 1 ? 'pb-6' : ''}`}
                    >
                      {/* Linha vertical conectora */}
                      {index !== statuses.length - 1 && (
                        <div
                          className={`absolute left-3 top-6 h-full w-0.5 ${isPastStatus ? 'bg-primary' : 'bg-muted'}`}
                        />
                      )}

                      {/* Status atual */}
                      <div
                        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
                          isCurrentStatus
                            ? 'text-primary'
                            : isPastStatus
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {isPastStatus ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          getStatusIcon(status)
                        )}
                      </div>

                      <div className="ml-4 flex min-w-0 flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium transition-colors duration-200 ${
                              isCurrentStatus || isPastStatus
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {status}
                          </span>
                          {isCurrentStatus && (
                            <Badge
                              className={`${getStatusColor(status as keyof typeof statusColors)} text-xs`}
                            >
                              Atual
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};