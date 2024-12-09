import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTransacoes } from "@/hooks/useTransacoes";
import { Rocket } from "lucide-react";

interface AreafinProps {
  loading: boolean;
}

export default function Areafin({ loading }: AreafinProps) {
  const {
    calcularTotalUltimoMes,
    calcularPrevisaoProximoMes,
    proximasTresTransacoes,
    calcularVariacaoMensal,
  } = useTransacoes();

  const variacao = calcularVariacaoMensal();
  const totalUltimoMes = calcularTotalUltimoMes();
  const previsaoProximoMes = calcularPrevisaoProximoMes();
  const proxTransacoes = proximasTresTransacoes();

  return (
    <>
      <div className="mb-2">
        {loading ? (
          <Skeleton className="h-10 w-[125px]" />
        ) : (
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Finanças
          </h2>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Coluna 1: Entrada total do último mês e previsão do próximo mês */}
        <div className="space-y-4">
          {/* Entrada Total do Último Mês */}
          {loading ? (
            <Skeleton className="h-[125px] w-full rounded-xl" />
          ) : (
            <a href="/financeiro">
              <Card className="mb-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Entrada total do último mês
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {totalUltimoMes}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {variacao > 0 ? (
                      <>
                        Crescimento de {variacao.toFixed(1)}% este mês
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </>
                    ) : (
                      <>
                        Queda de {Math.abs(variacao).toFixed(1)}% este mês
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          )}

          {/* Previsão do Próximo Mês */}
          {loading ? (
            <Skeleton className="h-[125px] w-full rounded-xl" />
          ) : (
            <a href="/financeiro">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Previsão do próximo mês
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {previsaoProximoMes}</div>
                  <p className="text-xs text-muted-foreground">
                    Valor previsto baseado em transações planejadas
                  </p>
                </CardContent>
              </Card>
            </a>
          )}
        </div>

        {/* Coluna 2: Alerts de Próximas Transações */}
        <div className="space-y-4">
          {loading ? (
            <Skeleton className="h-[125px] w-full rounded-xl" />
          ) : (
            proxTransacoes.map((transacao, index) => (
              <a href="/financeiro" key={index}>
                <Alert className="flex-1 mb-3">
                  <Rocket className="h-5 w-5" />
                  <AlertTitle className="text-sm font-medium">{transacao.nome}</AlertTitle>
                  <AlertDescription>R$ {transacao.valor}</AlertDescription>
                </Alert>
              </a>
            ))
          )}
        </div>
      </div>
    </>
  );
}
