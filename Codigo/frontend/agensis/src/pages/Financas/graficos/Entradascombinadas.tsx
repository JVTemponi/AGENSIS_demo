import { TrendingDown, TrendingUp, Loader2 } from "lucide-react"; 
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, /*ResponsiveContainer*/ } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTransacoes } from "@/hooks/useTransacoes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const chartConfig = {
  confirmadas: {
    label: "Entradas Confirmadas",
    color: "hsl(var(--chart-2))",
  },
  pendentes: {
    label: "Entradas Pendentes",
    color: "hsl(var(--chart-pending))",
  },
} satisfies ChartConfig;

export function EntradasCombinadas() {
  const {
    loading,
    error,
    processarEntradasPorMes,
    processarEntradasPendentesPorMes,
    calcularVariacaoMensal,
    calcularVariacaoMensalPendentes,
    transacoes,
    buscarTransacoes
  } = useTransacoes();

  const chartDataConfirmadas = processarEntradasPorMes();
  const chartDataPendentes = processarEntradasPendentesPorMes();
  const variacaoConfirmadas = calcularVariacaoMensal();
  const variacaoPendentes = calcularVariacaoMensalPendentes();

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

  // Obter todos os meses únicos de ambas as transações
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
      totalConfirmadas: confirmedEntry.total || 0, // Total de entradas confirmadas
      totalPendentes: pendingEntry.total || 0 // Total de entradas pendentes
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entradas Combinadas</CardTitle>
        <CardDescription>
          Mostrando entradas confirmadas e pendentes dos últimos meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* <ResponsiveContainer width="100%" height={300}> */}
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
                dataKey="totalConfirmadas" // Usando uma chave única para entradas confirmadas
                type="monotone"
                fill="var(--color-confirmadas)"
                fillOpacity={0.4}
                stroke="var(--color-confirmadas)"
                strokeWidth={2}
              />
              <Area
                dataKey="totalPendentes" // Usando uma chave única para entradas pendentes
                type="monotone"
                fill="var(--color-pending)"
                fillOpacity={0.3}
                stroke="var(--color-pending)"
                strokeWidth={2}
              />
            </AreaChart>
          {/* </ResponsiveContainer> */}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-4 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Confirmadas: {variacaoConfirmadas > 0 ? (
                <>
                  Crescimento de {variacaoConfirmadas.toFixed(1)}% este mês
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  Queda de {Math.abs(variacaoConfirmadas).toFixed(1)}% este mês
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              Pendentes: {variacaoPendentes > 0 ? (
                <>
                  Crescimento de {variacaoPendentes.toFixed(1)}% este mês
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                </>
              ) : (
                <>
                  Queda de {Math.abs(variacaoPendentes).toFixed(1)}% este mês
                  <TrendingDown className="h-4 w-4 text-yellow-500" />
                </>
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
