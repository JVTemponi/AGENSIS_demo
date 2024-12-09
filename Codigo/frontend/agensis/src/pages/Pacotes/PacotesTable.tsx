// PacoteTable.tsx
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
import { Edit2, Trash, Plus } from "lucide-react";
import PacoteCadastro from "./PacotesCadastro";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
}

interface Pacote {
  id: number;
  titulo: string;
  descricao: string;
  servicos: Servico[];
  servicosIds: [];
}

const PacotesTable = () => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [filteredPacotes, setFilteredPacotes] = useState<Pacote[]>([]);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [currentPacote, setCurrentPacote] = useState<Pacote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pacoteIdToDelete, setPacoteIdToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pacotesPerPage = 6;

  const fetchPacotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3002/api/pacotes");
      if (!response.ok) throw new Error("Erro ao buscar pacotes");
      const data: Pacote[] = await response.json();
      const pacotesComServicos = data.map(pacote => ({
        ...pacote,
        servicos: pacote.servicos || []  
      }));
      setPacotes(pacotesComServicos);
    setFilteredPacotes(pacotesComServicos);
    } catch (error) {
      setError("Erro ao carregar pacotes. Por favor, tente novamente.");
      console.error("Erro ao carregar pacotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePacote = async () => {
    if (!pacoteIdToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3002/api/pacotes/${pacoteIdToDelete}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao deletar pacote");
      setPacotes(prevPacotes => prevPacotes.filter(pacote => pacote.id !== pacoteIdToDelete));
      setFilteredPacotes(prevPacotes => prevPacotes.filter(pacote => pacote.id !== pacoteIdToDelete));
    } catch (error) {
      setError("Erro ao deletar pacote. Por favor, tente novamente.");
      console.error("Erro ao deletar pacote:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setPacoteIdToDelete(null);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredPacotes(
      pacotes.filter((pacote) =>
        pacote.titulo.toLowerCase().includes(value) ||
        pacote.descricao.toLowerCase().includes(value)
      )
    );
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: number) => {
    setPacoteIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSavePacote = async () => {
    await fetchPacotes();
    setIsCadastroOpen(false);
    setCurrentPacote(null);
  };

  const editPacote = (pacote: Pacote) => {
    setCurrentPacote(pacote);
    setIsCadastroOpen(true);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Pagination logic
  const indexOfLastPacote = currentPage * pacotesPerPage;
  const indexOfFirstPacote = indexOfLastPacote - pacotesPerPage;
  const currentPacotes = filteredPacotes.slice(indexOfFirstPacote, indexOfLastPacote);
  const totalPages = Math.ceil(filteredPacotes.length / pacotesPerPage);

  useEffect(() => {
    fetchPacotes();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="mb-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Gerenciar Pacotes
        </h2>
        <div className="mt-4 flex justify-between items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Pesquisar pacotes..."
            className="w-full max-w-md rounded-md border border-gray-300 p-2"
          />
          <Button
            variant="default"
            onClick={() => {
              setCurrentPacote(null);
              setIsCadastroOpen(true);
            }}
          >
            <Plus className="mr-2" />
            Novo Pacote
          </Button>
        </div>
      </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentPacotes.map((pacote) => (
            <Card key={pacote.id} className="w-full max-w-lg shadow-lg">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{pacote.titulo}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {pacote.descricao}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      title="Editar Pacote"
                      variant="ghost"
                      size="sm"
                      onClick={() => editPacote(pacote)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      title="Excluir Pacote"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(pacote.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {pacote.servicos.map((servico) => (
                    <div key={servico.id} className="sertext-sm text-gray-600vico">
                      <strong>{servico.nome}</strong>
                    </div>
                  ))}

              </CardContent>
            </Card>
          ))}
        </div>

      {/* Dialog de cadastro */}
      <Dialog 
        open={isCadastroOpen} 
        onOpenChange={(open) => {
          setIsCadastroOpen(open);
          if (!open) setCurrentPacote(null);
        }}
      >
        <DialogContent className="w-full max-w-[600px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {currentPacote ? "Editar Pacote" : "Cadastrar Pacote"}
            </DialogTitle>
            <DialogDescription>
              {currentPacote ? "Edite as informações do pacote" : "Preencha as informações do novo pacote"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <PacoteCadastro 
              onSave={handleSavePacote}
              pacote={currentPacote}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Deseja excluir o pacote?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deletePacote}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Paginação */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4 space-x-2">
        {[...Array(totalPages).keys()].map((number) => (
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

export default PacotesTable;
