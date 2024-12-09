import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Tag, User, DollarSign, Clock, FileText, CalendarIcon, Check } from "lucide-react";
import { Item } from "./Types";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from 'axios';


interface EdicaoProps {
  item: Item | null;
  onItemChange: (updatedItem: Item) => void;
  onSave: () => void;
}

const token = sessionStorage.getItem('token');
const usuario_id = sessionStorage.getItem('user_id');

export const Edicao: React.FC<EdicaoProps> = ({ item, onItemChange, onSave }) => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [valorFormatado, setValorFormatado] = useState("");
  const [prazo, setPrazo] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const formatarMoeda = (value: string) => {
    const numero = value.replace(/\D/g, '');
    const numeroFormatado = (parseInt(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return numeroFormatado;
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValor = e.target.value.replace(/\D/g, "");
    setValor(inputValor);
    if (inputValor) {
      setValorFormatado(formatarMoeda(inputValor));
    } else {
      setValorFormatado("");
    }
  };

  // const handleVerificarProposta = async () => {
  //   if (!item) {
  //     alert("Item não encontrado!");
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3002/api/itemProjeto/${item.id}`
  //     );

  //     console.log('Resposta da API:', response.data);
  //     alert("Proposta verificada com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao verificar proposta:", error);
  //     alert("Erro ao verificar proposta. Por favor, tente novamente.");
  //   } finally {
  //     window.location.reload();
  //   }


  // }

  const handleAdicionarProposta = async () => {
    if (!item) {
      alert("Item não encontrado!");
      return;
    }

    if (!descricao.trim()) {
      alert("Por favor, preencha a descrição da proposta!");
      return;
    }

    const valorNumerico = parseFloat(valor) / 100;
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert("Por favor, informe um valor válido para a proposta!");
      return;
    }

    if (!prazo) {
      alert("Por favor, selecione um prazo para a proposta!");
      return;
    }

    setLoading(true);

    const propostaData = {
      descricao: descricao.trim(),
      valor: valorNumerico,
      prazo: format(prazo, 'yyyy-MM-dd')
    };

    try {
      const response = await axios.put(
        `http://localhost:3002/api/itemProjeto/adicionarPropostaItemProjeto/${item.id}`,
        propostaData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta da API:', response.data);
      alert("Proposta adicionada com sucesso!");

      setDescricao("");
      setValor("");
      setValorFormatado("");
      setPrazo(undefined);

      onSave();
    } catch (error) {
      console.error("Erro ao adicionar proposta:", error);
      alert("Erro ao adicionar proposta. Por favor, tente novamente.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleIniciarProjeto = async () => {

    if (!item) {
      alert("Item não encontrado!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3002/api/itemProjeto/iniciarItemProjeto/${item.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta da API:', response.data);
      alert("Projeto iniciado com sucesso!");

    } catch (error) {
      console.error("Erro ao iniciar projeto:", error);
      alert("Erro ao iniciar projeto. Por favor, tente novamente.");
    } finally {
      window.location.reload();
    }
  }

  const handlecancelarProjeto = async () => {
        
      if (!item) {
        alert("Item não encontrado!");
        return;
      }
  
      try {

        const artista = await axios.get(`http://localhost:3002/api/artistas/usuario/${usuario_id}`);

        const response = await axios.put(
          `http://localhost:3002/api/itemProjeto/cancelarItemProjeto/${item.id}`,
          {artista_id : artista.data.id},
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Resposta da API:', response.data);
        alert("Projeto cancelado com sucesso!");
  
      } catch (error) {
        console.error("Erro ao cancelar projeto:", error);
        alert("Erro ao cancelar projeto. Por favor, tente novamente.");
      } finally {
        window.location.reload();
      }
    }



  const handleconcluirProjeto = async () => {
      
      if (!item) {
        alert("Item não encontrado!");
        return;
      }
  
      try {
        const response = await axios.put(
          `http://localhost:3002/api/itemProjeto/concluirItemProjeto/${item.id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Resposta da API:', response.data);
        alert("Projeto concluído com sucesso!");
  
      } catch (error) {
        console.error("Erro ao concluir projeto:", error);
        alert("Erro ao concluir projeto. Por favor, tente novamente.");
      } finally {
        window.location.reload();
      }
    }

  const handleResponsavel = async () => {
    if (!item) return;

    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
      console.error("ID do usuário não encontrado no sessionStorage");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3002/api/artistas/usuario/${userId}`);
      const artista = response.data;

      if (!artista || !artista.id) {
        console.error("Artista não encontrado para o usuário fornecido");
        return;
      } else {
        console.log("Item id:", item.id);
        console.log("Id do artista:", artista.id);
      }

    
      const updatedItem = { ...item, responsavel: "Agensis" };
      await axios.put(`http://localhost:3002/api/itemProjeto/assumirItemProjeto/${item.id}`, {
        artista_id: artista.id,
      });

      onItemChange(updatedItem);
      console.log("Responsabilidade assumida com sucesso.");
    } catch (error) {
      console.error("Erro ao assumir responsabilidade:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
    
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  
  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
  );

  const StatusHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-2 mb-6">
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );

  const CancelButton = () => (
    <Button
      variant="outline"
      onClick={handlecancelarProjeto}
      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
    >
      Cancelar projeto
    </Button>
  );
  if (item?.status === "Em Análise") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Nova Proposta" icon={FileText} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <label className="text-sm font-medium">Descrição</label>
              </div>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao?.(e.target.value)}
                className="min-h-[120px] bg-background/50 border-2 border-border/50 focus:border-primary transition-colors"
                placeholder="Descreva sua proposta detalhadamente..."
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <label className="text-sm font-medium">Valor</label>
              </div>
              <Input
                type="text"
                value={valorFormatado}
                onChange={handleValorChange}
                className="bg-background/50 border-2 border-border/50 focus:border-primary transition-colors"
                placeholder="R$ 0,00"
              />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <label className="text-sm font-medium">Prazo</label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-background/50 border-2 border-border/50 hover:bg-background/80",
                      !prazo && "text-muted-foreground"
                    )}
                  >
                    {prazo ? format(prazo, "dd/MM/yyyy") : "Selecione uma data"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={prazo}
                    onSelect={setPrazo}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-6">
          <CancelButton />
          <Button
            onClick={handleAdicionarProposta}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span>Enviando...</span>
              </div>
            ) : (
              "Adicionar Proposta"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (item?.status === "Novo") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Assumir Responsabilidade" icon={User} />
        <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
          <User className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-3">
              Responsável pelo Projeto
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleResponsavel}
                disabled={loading}
                className="border-2 hover:bg-primary hover:text-primary-foreground"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    <span>Processando...</span>
                  </div>
                ) : (
                  "Assumir responsabilidade"
                )}
              </Button>
              <CancelButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item?.status === "Aguardando Cliente") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Aguardando Cliente" icon={Info} />
        <div className="space-y-4">
          {[
            { icon: FileText, label: "Nome", value: item.proposta?.nome },
            { icon: Tag, label: "Descrição", value: item.proposta?.descricao },
            { icon: CalendarIcon, label: "Prazo", value: formatDate(item.proposta?.prazo ?? null) },
            { icon: Info, label: "Status", value: item.proposta?.status },
            { 
              icon: DollarSign, 
              label: "Valor", 
              value: item.proposta?.valor ? `R$ ${item.proposta.valor.toFixed(2)}` : null 
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">
                <strong className="font-medium">{label}:</strong>{" "}
                {value || "Não informado"}
              </p>
            </div>
          ))}
        </div>
        <div className="pt-4">
          <CancelButton />
        </div>
      </div>
    );
  }

  if (item?.status === "Recusado") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Projeto Recusado" icon={Info} />
        <div className="flex gap-4">
          <CancelButton />
        </div>
      </div>
    );
  }

  if (item?.status === "Concluído") {
    return (
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
      <Check className="text-primary h-6 w-6" />
      <h3 className="text-xl font-semibold text-card-foreground">
        Projeto finalizado
      </h3>
    </div>
    );
  }

  if (item?.status === "Aprovado") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Projeto Aprovado" icon={Info} />
        <div className="flex gap-4">
          <Button
            onClick={handleIniciarProjeto}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Iniciar projeto
          </Button>
          <CancelButton />
        </div>
      </div>
    );
  }

  if (item?.status === "Em Progresso") {
    return (
      <div className="space-y-6">
        <StatusHeader title="Projeto em Andamento" icon={Info} />
        <div className="flex gap-4">
          <Button
            onClick={handleconcluirProjeto}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Finalizar projeto
          </Button>
          <CancelButton />
        </div>
      </div>
    );
  }

  return null;
  
};