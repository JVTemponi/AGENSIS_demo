import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

export function Novatransacao() {
  const [nome, setNome] = React.useState("");
  const [descricao, setDescricao] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [valorFormatado, setValorFormatado] = React.useState("");
  const [date, setDate] = React.useState<Date>();
  const [recorrente, setRecorrente] = React.useState(false);
  const [intervalo, setIntervalo] = React.useState("mensal");
  const [tempo, setTempo] = React.useState("");
  const [status, setStatus] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Função para formatar valor como moeda
  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, "");
    const centavos = parseInt(numero) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos);
  };

  // Handler para o input de valor
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValor = e.target.value.replace(/\D/g, "");
    setValor(inputValor);
    if (inputValor) {
      setValorFormatado(formatarMoeda(inputValor));
    } else {
      setValorFormatado("");
    }
  };

  // Handler para o input de tempo
  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTempo = e.target.value.replace(/\D/g, "");
    setTempo(inputTempo);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const novaTransacao = {
      nome,
      descricao,
      tipo,
      valor: parseFloat(valor) / 100, // Converte centavos para reais
      data: date ? format(date, 'yyyy-MM-dd') : undefined, // Formata a data como YYYY-MM-DD
      recorrente,
      intervalo: recorrente ? intervalo : undefined,
      tempo: recorrente ? parseInt(tempo) : undefined,
      status: status ? 'concluido' : 'pendente'
    };

    const getToken = () => sessionStorage.getItem("authorization");

    try {
      const token = getToken();
      const response = await axios.post("http://localhost:3002/api/transacoes", novaTransacao, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.status === 201) {
        alert("Transação adicionada com sucesso!");
        // Resetar os campos
        setNome("");
        setDescricao("");
        setTipo("");
        setValor("");
        setValorFormatado("");
        setDate(undefined);
        setRecorrente(false);
        setIntervalo("mensal");
        setTempo("");
        setStatus(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`Erro ao adicionar transação: ${error.response?.data?.message || error.message}`);
      } else {
        alert("Erro ao adicionar transação");
      }
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar transação <CirclePlus className="ml-2" /> </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>
              Registre aqui uma nova transação
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Pagamento de Salário"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição da transação"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">Tipo</Label>
              <Select onValueChange={setTipo} required>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de transação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de transações</SelectLabel>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">Valor</Label>
              <Input
                id="valor"
                value={valorFormatado}
                onChange={handleValorChange}
                placeholder="R$ 0,00"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">Data</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Escolha a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                  <Calendar
                    className="z-50"
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recorrente" className="text-right">Recorrente</Label>
              <Checkbox
                id="recorrente"
                checked={recorrente}
                onChange={() => setRecorrente(!recorrente)}
              />
            </div>

            {recorrente && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="intervalo" className="text-right">Intervalo</Label>
                  <RadioGroup value={intervalo} onValueChange={setIntervalo} className="col-span-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diario" id="r1" />
                        <Label htmlFor="r1">Diário</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quinzenal" id="r2" />
                        <Label htmlFor="r2">Quinzenal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mensal" id="r3" />
                        <Label htmlFor="r3">Mensal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="semestral" id="r4" />
                        <Label htmlFor="r4">Semestral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem disabled value="anual" id="r5" />
                        <Label htmlFor="r5">Anual</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tempo" className="text-right">Tempo</Label>
                  <Input
                    id="tempo"
                    value={tempo}
                    onChange={handleTempoChange}
                    placeholder="3"
                    className="col-span-3"
                    required={recorrente}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Confirmado</Label>
              <Switch checked={status} onCheckedChange={setStatus} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar transação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}