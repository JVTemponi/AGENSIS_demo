import { Item } from './Types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Info, FileText, Tag, Calendar, DollarSign, Check } from "lucide-react";
import axios from 'axios';


interface ViewClienteProps {
  item: Item | null;
}

export const ViewCliente: React.FC<ViewClienteProps> = ({ item }) => {

  const handleAceitarProposta = async () => {
    if (!item) {
      alert("Item não encontrado!");
      return;
    }


    try {
      const response = await axios.put(
        `http://localhost:3002/api/itemProjeto/aceitarPropostaItemProjeto/${item.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta da API:', response.data);
      alert("Proposta aceitada com sucesso!");




    } catch (error) {
      console.error("Erro ao aceitar proposta:", error);
      alert("Erro ao aceitar proposta. Por favor, tente novamente.");
    } finally {
      window.location.reload();
    }
  };

  const handleRecusarProposta = async () => {
    if (!item) {
      alert("Item não encontrado!");
      return;
    }


    try {
      const response = await axios.put(
        `http://localhost:3002/api/itemProjeto/recusarPropostaItemProjeto/${item.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta da API:', response.data);
      alert("Proposta recusada com sucesso!");




    } catch (error) {
      console.error("Erro ao recusar proposta:", error);
      alert("Erro ao recusar proposta. Por favor, tente novamente.");
    } finally {
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

  if (!item) {
    return <div>Item não encontrado!</div>;
  }

  return (
    <>
      {item?.status === "Aguardando Cliente" ? (
        <>
          <div className="p-6">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Proposta do artista: {item.responsavel}
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { Icon: FileText, label: "Nome", value: item.proposta?.nome },
                { Icon: Tag, label: "Descrição", value: item.proposta?.descricao },
                { Icon: Calendar, label: "Prazo", value: formatDate(item.proposta?.prazo ?? null) },
                { Icon: Info, label: "Status", value: item.proposta?.status },
                {
                  Icon: DollarSign,
                  label: "Valor",
                  value: item.proposta?.valor
                    ? `R$ ${item.proposta.valor.toFixed(2)}`
                    : null
                },
              ].map(({ Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors duration-200 group"
                >
                  <Icon className="text-muted-foreground w-5 h-5 flex-shrink-0 group-hover:text-accent-foreground" />
                  <p className="text-sm text-card-foreground">
                    <strong className="font-medium">{label}:</strong>{" "}
                    <span className="text-muted-foreground">
                      {value || "Não informado"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end p-6">
            <Button
              variant="destructive"
              onClick={handleRecusarProposta}
              className="transition-transform hover:scale-105 duration-200"
            >
              Recusar proposta
            </Button>
            <Button
              onClick={handleAceitarProposta}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 duration-200"
            >
              Aceitar proposta
            </Button>
          </div>
        </>
      )
        : item?.status === "Novo" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Aguardando um artista começar o projeto ...
              </h3>
            </div>
          </>
        ) : item?.status === "Em Análise" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Aguardando um artista montar a proposta ...
              </h3>
            </div>
          </>
        ) : item?.status === "Recusado" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                O artista vai revisar a proposta ...
              </h3>
            </div>
          </>
        ) : item?.status === "Aprovado" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                O artista vai iniciar o projeto ...
              </h3>
            </div>
          </>
        ) : item?.status === "Em Progresso" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Info className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                O projeto está em andamento ...
              </h3>
            </div>
          </>
        ) : item?.status === "Concluído" ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Check className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold text-card-foreground">
                Projeto finalizado
              </h3>
            </div>
          </>
        ) :
          null}
    </>
  );
}
