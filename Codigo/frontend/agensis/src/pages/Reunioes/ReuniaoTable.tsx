import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReuniaoCadastro from "./ReuniaoCadastro";
import ReuniaoEditar from "./ReuniaoEditar";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Reuniao {
  id: string;
  nome: string;
  descricao: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  status: string; // Agora representa o status da reunião
}

interface ReuniaoCardProps {
  reuniao: Reuniao;
  onEditSave: (reuniao: Reuniao) => void;
  onDelete: (id: string) => void;
}

const ReuniaoCard = ({ reuniao, onEditSave, onDelete }: ReuniaoCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4" style={{ width: "1050px", overflow: "hidden" }}>
      <h3 className="text-xl font-bold">{reuniao.nome}</h3>
      <p className="text-gray-700">{reuniao.descricao}</p>
      <p>
        <strong>Início:</strong> {format(new Date(reuniao.horarioInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </p>
      <p>
        <strong>Fim:</strong> {format(new Date(reuniao.horarioFim), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </p>
      <p>
        <strong>Local:</strong> {reuniao.local}
      </p>
      <p>
        <strong>Status:</strong> {reuniao.status === "confirmado" ? "Confirmado" : "Cancelado"}
      </p>
      <div className="flex justify-end mt-4">
        {/* Botão para abrir o pop-up de edição */}
        <Popover open={isEditOpen} onOpenChange={setIsEditOpen}>
          <PopoverTrigger asChild>
            <Button onClick={() => setIsEditOpen(true)} className="mr-2">
              Editar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="modal-center">
            <ReuniaoEditar
              reuniao={reuniao}
              onSave={(updatedReuniao) => {
                onEditSave(updatedReuniao);
                setIsEditOpen(false);
              }}
              onCancel={() => setIsEditOpen(false)}
            />
          </PopoverContent>
        </Popover>
        <Button variant="destructive" onClick={() => onDelete(reuniao.id)}>
          Excluir
        </Button>
      </div>
    </div>
  );
};

const ReuniaoTable = () => {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const fetchReunioes = async () => {
    const usuario_id = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("authorization");

    if (!usuario_id) {
      console.error("Usuário não encontrado no sessionStorage.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/api/reunioes/${usuario_id}`, {
        headers: {
          ...(token && { "x-access-token": token }), // Inclui o token se disponível
        },
      });
      setReunioes(response.data);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    }
  };

  const handleSave = async (newReuniao: Reuniao) => {
    try {
      const response = await axios.post("http://localhost:3002/api/reunioes", newReuniao);
      setReunioes((prev) => [...prev, response.data]);
      setIsCadastroOpen(false);
    } catch (error) {
      console.error("Erro ao salvar reunião:", error);
    }
  };

  const handleEditSave = async (updatedReuniao: Reuniao) => {
    try {
      await axios.put(`http://localhost:3002/api/reunioes/${updatedReuniao.id}`, updatedReuniao);
      setReunioes((prev) =>
        prev.map((reuniao) => (reuniao.id === updatedReuniao.id ? updatedReuniao : reuniao))
      );
    } catch (error) {
      console.error("Erro ao atualizar reunião:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3002/api/reunioes/${id}`);
      setReunioes((prev) => prev.filter((reuniao) => reuniao.id !== id));
    } catch (error) {
      console.error("Erro ao deletar reunião:", error);
    }
  };

  useEffect(() => {
    fetchReunioes();
  }, []);

  return (
    <div className="p-4">
        <div className="mb-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Reuniões
        </h2>
      </div>
      {reunioes.map((reuniao: Reuniao) => (
        <ReuniaoCard
          key={reuniao.id}
          reuniao={reuniao}
          onEditSave={handleEditSave}
          onDelete={handleDelete}
        />
      ))}

      {/* Modal para criar reunião */}
      <Popover open={isCadastroOpen} onOpenChange={setIsCadastroOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="fixed bottom-4 right-4"
            onClick={() => setIsCadastroOpen(true)}
          >
            Adicionar Reunião
          </Button>
        </PopoverTrigger>
        <PopoverContent className="modal-center">
          <ReuniaoCadastro onSave={handleSave} onCancel={() => setIsCadastroOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReuniaoTable;
