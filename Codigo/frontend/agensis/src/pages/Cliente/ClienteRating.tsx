import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { ArrowUp, ArrowDown, AlertCircle, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { ClienteProjetos } from "./ClienteProjetos";

interface Avaliacao {
  cliente_id: number;
  artista_id: number;
  rate: number;
  createdAt: string; 
  updatedAt: string; 
}

interface Usuario {
  id: number;
  email: string;
  senha: string; 
  status: string;
  data_criacao: string; 
  perfil_id: number;
}

interface Projeto {
  id: string;
  nome: string;
}

interface ItemProjeto {
id: number;
nome: string;
responsavel?: string;
valor?: number;
prazo?: string; 
status?: string;
data_criacao?: string;
data_finalizacao?: string;
projeto_id: number;
servico_id: number;
artista_id?: number;
cliente_id: number;
projeto: Projeto;
}

interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string | null; // CPF pode ser nulo
  data_nascimento: string | null; // Data de nascimento pode ser nula
  telefone: string | null; // Telefone pode ser nulo
  usuario_id: number; // ID do usuário associado
  avaliacao: Avaliacao[] | null; // Um array de avaliações
  usuario: Usuario; // Informações do usuário associado
  itemProjetos: ItemProjeto[] | null;
}

const ClienteRating = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clientesPerPage = 6;
  const [sortOption, setSortOption] = useState<string>("most-recent");
  
  const sortClientes = (clientes: Cliente[], option: string): Cliente[] => {
    switch (option) {
      case "most-recent":
        return [...clientes].sort((a, b) =>
          new Date(b.usuario.data_criacao).getTime() - new Date(a.usuario.data_criacao).getTime()
        );
      case "oldest":
        return [...clientes].sort((a, b) =>
          new Date(a.usuario.data_criacao).getTime() - new Date(b.usuario.data_criacao).getTime()
        );
      case "stars":
        return [...clientes].sort((a, b) => {
          const aStars = a.avaliacao?.[0]?.rate || 0;
          const bStars = b.avaliacao?.[0]?.rate || 0;
          return bStars - aStars;
        });
      case "projects":
        return [...clientes].sort((a, b) => {
          const aProjects = a.itemProjetos?.length || 0;
          const bProjects = b.itemProjetos?.length || 0;
          return bProjects - aProjects;
        });
      case "status":
        return [...clientes].sort((a, b) =>
          a.usuario.status.localeCompare(b.usuario.status)
        );
      default:
        return clientes;
    }
  };

  // Buscar clientes da API
  const fetchClientes = async () => {
    try {
      const user_id = sessionStorage.getItem("user_id");

      const response = await fetch(`http://localhost:3002/api/ratingclientes/${user_id}`);
      if (!response.ok) throw new Error("Erro ao buscar clientes");
      const data = await response.json();

      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  // Criar avaliação
  const criarAvaliacao = async (clienteId: number, rate: number) => {
    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await fetch('http://localhost:3002/api/ratingclientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          user_id: user_id,
          rate: rate
        }),
      });
      if (!response.ok) throw new Error("Erro ao criar avaliação");
      fetchClientes(); // Recarrega os clientes após criar avaliação
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

  // Atualizar avaliação
  const atualizarAvaliacao = async (clienteId: number, rate: number) => {
    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await fetch(`http://localhost:3002/api/ratingclientes/${clienteId}/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rate: rate
        }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar avaliação");
      fetchClientes(); // Recarrega os clientes após atualizar avaliação
    } catch (error) {
      console.error("Erro ao atualizar avaliação:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredClientes(
      clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(value) ||
        cliente.sobrenome.toLowerCase().includes(value)
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "green":
        return <ArrowUp className="text-green-500" />;
      case "yellow":
        return <AlertCircle className="text-yellow-500" />;
      case "red":
        return <ArrowDown className="text-red-500" />;
      default:
        return null;
    }
  };

  const viewProjetos = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setIsCadastroOpen(true);
  };

  // Paginação
  const indexOfLastClient = currentPage * clientesPerPage;
  const indexOfFirstClient = indexOfLastClient - clientesPerPage;
  const sortedClientes = sortClientes(filteredClientes, sortOption);
  const currentClientes = sortedClientes.slice(indexOfFirstClient, indexOfLastClient);
  
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="mb-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Rating de Clientes
        </h2>
        <div className="mt-4 flex justify-between items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Pesquisar clientes..."
          className="w-full max-w-md rounded-md border p-2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="rounded-md border p-2"
        >
          <option value="most-recent">Mais recente</option>
          <option value="oldest">Mais antigo</option>
          <option value="stars">Por estrelas</option>
          <option value="projects">Por projetos</option>
          <option value="status">Por status</option>
        </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentClientes.map((cliente) => (
          
          <Card key={cliente.id} className="flex items-center p-2">
            <CardHeader className="flex items-center space-x-2">
              <div>
                <CardTitle>{cliente.nome} {cliente.sobrenome}</CardTitle>
                <Rating 
                  value={cliente.avaliacao && cliente.avaliacao.length > 0 ? cliente.avaliacao[0].rate : 0}
                  onChange={(rate) => {
                    if (cliente.avaliacao && cliente.avaliacao.length > 0 ? cliente.avaliacao[0].rate : 0) {
                        atualizarAvaliacao(cliente.id, rate);
                      } else {
                        criarAvaliacao(cliente.id, rate);
                      }
                    }
                  }
                  readonly={false}
                />
                <div className="flex items-center space-x-2">
                  {getStatusIcon((cliente.avaliacao && cliente.avaliacao.length > 0 ? cliente.avaliacao[0].rate : 0).toString())}
                  <span className="text-sm text-gray-400">
                    {cliente.usuario.email}
                  </span>
                  
                </div>
                <span className="text-sm text-gray-400">
                    {cliente.telefone}
                  </span>
                <CardDescription>

                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="ml-auto flex space flex-col no-padding">
              <Button 
              title="Ver Projeto"
              variant="default" 
              className="bg-green-500 text-white mb-2"
              onClick={() => viewProjetos(cliente)}
              >
                <Eye className="h-4 w-4" />
                </Button>
              
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dialog de cadastro */}
      <Dialog 
        open={isCadastroOpen} 
        onOpenChange={(open) => {
          setIsCadastroOpen(open);
          if (!open) setCurrentCliente(null);
        }}
      >
        <DialogContent className="w-full max-w-[600px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {"Itens do Projeto"}
            </DialogTitle>
            <DialogDescription>
              {"Informações dos Itens de Projeto"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <ClienteProjetos 
              cliente_id={currentCliente?.id!}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Paginação */}
      <div className="fixed bottom-0 left-20 right-20 flex justify-center mb-4 space-x-2">
        {[...Array(Math.ceil(filteredClientes.length / clientesPerPage)).keys()].map((number) => (
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

export default ClienteRating;