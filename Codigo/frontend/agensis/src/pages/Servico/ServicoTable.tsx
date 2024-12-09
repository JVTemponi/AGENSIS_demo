import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ServicoCadastro from "./ServicoCadastro";

import { Edit2, Trash, Plus } from "lucide-react";
  
interface Campo {
  id: number;
  nome: string;
  tipo: 'Texto' | 'Numero Inteiro' | 'Numero Decimal' | 'Data' | 'Selecao';
  obrigatorio: boolean;
  servico_id: number;
}

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  campos: Campo[];
}

const ServicoTable = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [currentServico, setCurrentServico] = useState<Servico | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [servicoIdToDelete, setServicoIdToDelete] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const servicesPerPage = 6;

  const fetchServicos = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/servicos");
      if (!response.ok) throw new Error("Erro ao buscar serviços");
      const data: Servico[] = await response.json();
      setServicos(data);
      setFilteredServicos(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  const deleteServico = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/servicos/${servicoIdToDelete}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao deletar serviço");
      setServicos(servicos.filter((servico) => servico.id !== servicoIdToDelete));
      setFilteredServicos(servicos => servicos.filter(servico => servico.id !== servicoIdToDelete));
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      alert("Não foi possível deletar o serviço.");
    } finally {
      setOpen(false); // Fecha o diálogo após a operação
    }
  };

  // Função de pesquisa
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredServicos(
      servicos.filter((servico) =>
        servico.nome.toLowerCase().includes(value) ||
        servico.descricao.toLowerCase().includes(value)
      )
    );
  };

  const handleDeleteClick = (id: number) => {
    setServicoIdToDelete(id);
    setOpen(true); // Abre o diálogo de confirmação
  };

  const editServico = (servico: Servico) => {
    setCurrentServico(servico);
    setIsCadastroOpen(true);
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServicos.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchServicos();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="mb-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Gerenciar Serviços
        </h2>
        <div className="mt-4 flex justify-between items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Pesquisar serviços..."
            className="w-full max-w-md rounded-md border border-gray-300 p-2"
          />
          <Button
            variant="default"
            onClick={() => {
              setCurrentServico(null);
              setIsCadastroOpen(true);
            }}
          >
            <Plus className="mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentServices.map((servico: Servico) => (
              <Card key={servico.id} className="w-full max-w-lg p-4 shadow-lg">
                <CardHeader className="flex-col p-6 space-y-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{servico.nome}</CardTitle>
                      <CardDescription className="max-h-24 overflow-hidden overflow-ellipsis">
                        {servico.descricao}
                      </CardDescription>
                    </div>
                    
                    {/* Contêiner dos botões ajustado */}
                    <div className="flex space-x-2">
                      <Button
                        className="p-2 hover:bg-gray-100"
                        title="Editar Servico"
                        variant="ghost"
                        onClick={() => {
                          editServico(servico);
                        }}
                      >
                        <Edit2 />
                      </Button>
                      <Button
                        className="p-2 hover:bg-gray-100"
                        title="Excluir Servico"
                        variant="ghost"
                        onClick={() => handleDeleteClick(servico.id)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {servico.campos.map((campo) => (
                    <div key={campo.id} className="campo">
                      <strong>{campo.nome}</strong>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

      {/* Modal */}
      <Dialog open={isCadastroOpen} onOpenChange={(open) => {
        // open = false quando fecha, porem tela fica bloqueada
        // quando abre pelo botão cadastro - não tem esse problema
        console.log(`OpenChange ${open}`) 
        setIsCadastroOpen(open);
        if (!open) {
          setCurrentServico(null); // Limpa o serviço atual quando fecha
        }
      }}>
        {/* Conteúdo do Modal */}
        <DialogContent className="w-full max-w-[600px] h-[600px] flex flex-col items-start">
          <DialogHeader>
            <DialogTitle>{currentServico ? "Editar" : "Cadastrar"}</DialogTitle>
            <DialogDescription>Serviço</DialogDescription>  
          </DialogHeader>

          {/* Componente de Cadastro */}
          <div className="w-full flex-1 overflow-y-auto">
            <ServicoCadastro 
              onSave={() => {
                setIsCadastroOpen(false);
                fetchServicos(); // Recarregar serviços após salvar
              }} 
              servico={currentServico} 
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Alert Dialog para confirmação */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Você realmente deseja deletar este serviço?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteServico}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Paginação */}
      <div className="fixed bottom-0 left-20 right-20 flex justify-center mb-4 space-x-2">
          {[...Array(Math.ceil(servicos.length / servicesPerPage)).keys()].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`text-black p-2 transition-colors duration-300 ${
                currentPage === number + 1
                  ? "text-orange-500 font-bold"
                  : "hover:text-orange-500"
              }`}
            >
              {number + 1}
            </button>
          ))}
        </div>


    </div> 
  );
};

export default ServicoTable;