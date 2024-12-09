import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransacoes } from "@/hooks/useTransacoes";

interface ChartData {
  category: React.ReactNode;
  value: number;
  fill: string;
}

// Configuração das cores e labels do gráfico
const chartConfig = {
  entradasConfirmadas: {
    label: "Entradas Confirmadas",
    color: "hsl(142, 76%, 36%)",
  },
  entradasPrevistas: {
    label: "Entradas Previstas",
    color: "hsl(182, 76%, 36%)",
  },
  saidasPrevistas: {
    label: "Saídas Previstas",
    color: "hsl(332, 76%, 36%)",
  },
  saidasConfirmadas: {
    label: "Saídas Confirmadas",
    color: "hsl(0, 76%, 36%)",
  },
  transacoesCanceladas: {
    label: "Transações Canceladas",
    color: "hsl(45, 76%, 36%)",
  },
};

export function ComparativoTransacoesDonut() {
  const {
    processarEntradasConfirmadas,
    processarEntradasPendentes,
    processarSaidasPendentes,
    processarSaidasConfirmadas,
    processarTransacoesCanceladas,
    loading,
    error,
  } = useTransacoes();

  const chartData: ChartData[] = React.useMemo(() => {
    if (loading) return [];

    return [
      {
        category: chartConfig.entradasConfirmadas.label,
        value: processarEntradasConfirmadas(),
        fill: chartConfig.entradasConfirmadas.color,
      },
      {
        category: chartConfig.entradasPrevistas.label,
        value: processarEntradasPendentes(),
        fill: chartConfig.entradasPrevistas.color,
      },
      {
        category: chartConfig.saidasPrevistas.label,
        value: processarSaidasPendentes(),
        fill: chartConfig.saidasPrevistas.color,
      },
      {
        category: chartConfig.saidasConfirmadas.label,
        value: processarSaidasConfirmadas(),
        fill: chartConfig.saidasConfirmadas.color,
      },
      {
        category: chartConfig.transacoesCanceladas.label,
        value: processarTransacoesCanceladas(),
        fill: chartConfig.transacoesCanceladas.color,
      },
    ].filter((item) => item.value > 0);
  }, [
    loading,
    processarEntradasConfirmadas,
    processarEntradasPendentes,
    processarSaidasPendentes,
    processarSaidasConfirmadas,
    processarTransacoesCanceladas,
  ]);

  const totalTransacoes = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [chartData]);

  const CustomLabel = (props: any) => {
    const { viewBox } = props;
    const { cx = 0, cy = 0 } = viewBox || {};

    return (
      <g>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-lg font-bold"
        >
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalTransacoes)}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-sm opacity-70"
        >
          Total
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>Carregando dados...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-red-500">Erro ao carregar dados</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center">
        <CardHeader className="items-center pb-0">
          <CardTitle>Sem dados disponíveis</CardTitle>
          <CardDescription>Nenhuma transação encontrada</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição das Transações</CardTitle>
        <CardDescription>Resumo das transações por categoria</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={(props) => {
                  if (props.payload && props.payload.length > 0) {
                    const data = props.payload[0].payload;
                    return (
                      <ChartTooltipContent>
                        <p className="font-medium">{data.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(data.value)}
                        </p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
              >
                <Label content={CustomLabel} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="h-4 w-4" />
          {chartData.length} categorias encontradas
        </div>
        <div className="text-muted-foreground">
          Exibindo distribuição das transações em diferentes categorias
        </div>
        <div className="mt-2 space-y-1">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></span>
              <span>{item.category}</span>
              <span className="ml-auto font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
