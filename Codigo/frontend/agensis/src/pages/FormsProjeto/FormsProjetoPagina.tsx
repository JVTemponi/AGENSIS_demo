import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import { Trash, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { 
    Collapsible, 
    CollapsibleContent, 
    CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useNavigate } from 'react-router-dom';


import FormsProjeto from "./FormsProjeto";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
}

interface Campo {
    id: number;
    nome_campo: string;
    valor_digitado: string;
}

interface ItemProjeto {
    id: number;
    nome: string;
    responsavel: string | null;
    valor: number | null;
    prazo: string | null;
    status: string;
    servico?: Servico;
    campos: Campo[];
}

interface Projeto {
    id: string;
    nome: string;
    cliente_id: string;
    status?: string;
    responsavel?: string;
    descricao?: string;
    itens?: ItemProjeto[];
}


const ProjetoTable = () => {
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [expandedProjects, setExpandedProjects] = useState<{[key: string]: boolean}>({});
    const [itensPorProjeto, setItensPorProjeto] = useState<Record<string, ItemProjeto[]>>({});
    const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([]);
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [currentProjeto, setCurrentProjeto] = useState<Projeto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [projetoIdToDelete, setProjetoIdToDelete] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const projectsPerPage = 6;
    const navigate = useNavigate();

    const transformUserIdToClienteId = async (userId: string): Promise<string> => {
        const response = await fetch(`http://localhost:3002/api/clientes/usuario/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar cliente");
        const cliente = await response.json();
        return cliente.id;
    };

    const fetchProjetos = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/projetos/`);
            if (!response.ok) throw new Error("Erro ao buscar projetos");
            const data: Projeto[] = await response.json();

            const userId = sessionStorage.getItem("user_id");
            if (!userId) throw new Error("User ID não encontrado no sessionStorage");

            const clienteId = await transformUserIdToClienteId(userId);

            const filteredData = data.filter(
                (projeto) => projeto.cliente_id.toString() === clienteId.toString()
            );

            const projetosComItens = await Promise.all(
                filteredData.map(async (projeto) => {
                    try {
                        const itemProjetoResponse = await fetch(
                            `http://localhost:3002/api/itemProjeto/projeto/${projeto.id}`
                        );
                        if (!itemProjetoResponse.ok)
                            throw new Error("Erro ao buscar itens do projeto");
                        const itens = await itemProjetoResponse.json();
                        return { ...projeto, itens };
                    } catch (error) {
                        console.error(`Erro ao buscar itens do projeto ${projeto.id}:`, error);
                        return { ...projeto, itens: [] };
                    }
                })
            );

            setProjetos(projetosComItens);
            setFilteredProjetos(projetosComItens);
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
        }
    };


    const deleteProjeto = async () => {
        try {
            const response = await fetch(
                `http://localhost:3002/api/projetos/${projetoIdToDelete}`,
                { method: "DELETE" }
            );
            if (!response.ok) throw new Error("Erro ao deletar projeto");
            setProjetos(projetos.filter((projeto) => projeto.id !== projetoIdToDelete));
            setFilteredProjetos(filteredProjetos.filter((projeto) => projeto.id !== projetoIdToDelete));
        } catch (error) {
            console.error("Erro ao deletar projeto:", error);
            alert("Não foi possível deletar o projeto.");
        } finally {
            setOpen(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredProjetos(
            projetos.filter((projeto) =>
                projeto.nome.toLowerCase().includes(value)
            )
        );
    };

    const handleDeleteClick = (id: string) => {
        setProjetoIdToDelete(id);
        setOpen(true);
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjetos.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        fetchProjetos();
    }, []);
    const toggleProjectExpansion = (projetoId: string) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projetoId]: !prev[projetoId]
        }));
    };

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'novo':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'em progresso':
                return 'bg-blue-500/10 text-blue-500';
            case 'concluído':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    // Render project items
    const renderProjectItems = (projeto: Projeto) => {
        if (!projeto.itens || projeto.itens.length === 0) {
            return <p className="text-sm text-muted-foreground">Sem itens cadastrados.</p>;
        }

        return (
            <div className="space-y-4 mt-4">
                {projeto.itens.map((item) => (
                    <a className="mb-2 cursor-pointer" onClick={() => navigate('/myitem', { state: { id: item.id } })}>
                    <div 
                        key={item.id} 
                        className="mb-4 bg-secondary/50 p-4 rounded-lg border border-border shadow-sm"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="font-semibold text-foreground/80">Nome do Item</p>
                                <p className="text-sm text-foreground">{item.nome}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground/80">Serviço</p>
                                <p className="text-sm text-foreground">{item.servico?.nome || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground/80">Status</p>
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground/80">Quantidade</p>
                                <p className="text-sm text-foreground">
                                    {item.campos?.find(campo => campo.nome_campo === "Quantidade")?.valor_digitado || "N/A"}
                                </p>
                            </div>
                            {item.prazo && (
                                <div>
                                    <p className="font-semibold text-foreground/80">Prazo</p>
                                    <p className="text-sm text-foreground">
                                        {new Date(item.prazo).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </a>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen w-full flex-col p-6 bg-background text-foreground">
            <div className="mb-10">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight border-border">
                    Gerenciar Projetos
                </h2>
                <div className="mt-4 flex justify-between items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Pesquisar projetos..."
                        className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Projeto
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentProjects.map((projeto) => (
                    <Collapsible 
                        key={projeto.id} 
                        open={expandedProjects[projeto.id]}
                        onOpenChange={() => toggleProjectExpansion(projeto.id)}
                        className="w-full"
                    >
                        <Card className="w-full max-w-lg shadow-lg border border-border">
                            <CardHeader className="flex-col p-6 space-y-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center justify-between">
                                            <span className="text-foreground">{projeto.nome}</span>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    {expandedProjects[projeto.id] ? (
                                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </CardTitle>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            className="text-destructive hover:bg-destructive/10"
                                            title="Excluir Projeto"
                                            variant="ghost"
                                            onClick={() => handleDeleteClick(projeto.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CollapsibleContent>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-foreground/80">
                                            <strong>Descrição:</strong> {projeto.descricao}
                                        </p>
                                        {/* <p className="text-foreground/80">
                                            <strong>Status:</strong>{' '}
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(projeto.status || '')}`}>
                                                {projeto.status}
                                            </span>
                                        </p>
                                        <p className="text-foreground/80">
                                            <strong>Responsável:</strong> {projeto.responsavel || "N/A"}
                                        </p> */}
                                        
                                        <div className="mt-4">
                                            <h4 className="text-lg font-semibold mb-2 text-foreground">Itens do Projeto:</h4>
                                            {renderProjectItems(projeto)}
                                        </div>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                ))}
            </div>

            {/* Modal */}
            <Dialog open={isCadastroOpen} onOpenChange={(open: boolean) => {
                setIsCadastroOpen(open);
                if (!open) {
                    setCurrentProjeto(null);
                }
            }}>
                <DialogContent className="w-full max-w-[600px] h-[600px] flex flex-col items-start">
                    <FormsProjeto />
                </DialogContent>
            </Dialog>

            {/* AlertDialog */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Você realmente deseja deletar este projeto?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteProjeto}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Paginação */}
            <div className="fixed bottom-0 left-20 right-20 flex justify-center mb-4 space-x-2">
                {[...Array(Math.ceil(filteredProjetos.length / projectsPerPage)).keys()].map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`text-black p-2 transition-colors duration-300 ${currentPage === number + 1
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

export default ProjetoTable;