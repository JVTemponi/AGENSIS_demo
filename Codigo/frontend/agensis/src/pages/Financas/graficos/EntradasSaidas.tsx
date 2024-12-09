import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTransacoes } from "@/hooks/useTransacoes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const chartConfig = {
  entradas: {
    label: "Entradas Pendentes",
    color: "hsl(var(--chart-3))",
  },
  saidas: {
    label: "Saídas Pendentes",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ComparativoEntradasSaidas() {
  const {
    loading,
    error,
    processarEntradasPendentesPorMes,
    processarSaidasPendentesPorMes,
    calcularVariacaoPendencias,
    transacoes,
    buscarTransacoes
  } = useTransacoes();

  const chartDataConfirmadas = processarEntradasPendentesPorMes();
  const chartDataPendentes = processarSaidasPendentesPorMes();
  const variacaoPendencias = calcularVariacaoPendencias();

  if (loading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[400px]">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => buscarTransacoes()} className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!transacoes.length) {
    return (
      <Card className="w-full h-[400px]">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Nenhuma transação encontrada.
              <p>Cadastre uma nova transação para visualizar os dados.</p>
            </AlertDescription>
          </Alert>
          <Button onClick={() => buscarTransacoes()} className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Obter todos os meses únicos de ambas as transações de saídas
  const allMonths = new Set([
    ...chartDataConfirmadas.map(entry => entry.month),
    ...chartDataPendentes.map(entry => entry.month),
  ]);

  // Criar um conjunto de dados unificado
  const combinedChartData = Array.from(allMonths).map(month => {
    const confirmedEntry = chartDataConfirmadas.find(entry => entry.month === month) || { total: 0 };
    const pendingEntry = chartDataPendentes.find(entry => entry.month === month) || { total: 0 };

    return {
      month,
      totalConfirmadas: confirmedEntry.total || 0, // Total de saídas confirmadas
      totalPendentes: pendingEntry.total || 0 // Total de saídas pendentes
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação Entradas e Saidas</CardTitle>
        <CardDescription>
          Mostrando as principais entradas e saidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={combinedChartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`R$ ${value.toLocaleString()}`, " Total"]}
            />
            <Area
              dataKey="totalConfirmadas"
              type="monotone"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
            />
            <Area
              dataKey="totalPendentes"
              type="monotone"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.3}
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-4 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Variação: {variacaoPendencias > 0 ? (
              <>
                As entradas previstas são {variacaoPendencias.toFixed(1)}% a mais do que as saidas previstas
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                As entradas previstas são {Math.abs(variacaoPendencias).toFixed(1)}% a menos do que as saidas previstas
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
