import { useEffect, useState } from "react";

interface ClienteProjetosProps {
  cliente_id: number; 
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

const ClienteProjetos = ({ cliente_id }: ClienteProjetosProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projetos, setProjetos] = useState<ItemProjeto[]>([]);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/itemProjeto/cliente/${cliente_id}`);
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        const data = await response.json();
        setProjetos(data);
      } catch (error) {
        console.error('Erro ao carregar itens de projeto do cliente:', error);
        setError(`Não foi possível carregar a lista de itens de projetos do cliente.${cliente_id}`);
      } finally {
        setIsLoading(false); // Atualiza o estado de loading
      }
    };

    fetchProjetos();
  }, [cliente_id]); // Adicione cliente_id como dependência

  const formatarData = (data?: string) => {
        if (data == null) {
            return null;
        }
        return new Date(data!).toLocaleDateString('pt-BR'); // Formato dd/mm/yyyy
    };
  if (isLoading) return <p>Carregando...</p>;
  
  if (error) return <p>{error}</p>;

  return (
        <div className="flex flex-col space-y-4">
        {projetos.length > 0 ? (
            projetos.map((projeto) => (
            <div
                key={projeto.id}
                className="border p-6 rounded-md shadow-md bg-white space-y-2"
            >
                {/* Cabeçalho do projeto */}
                <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700">
                    {projeto.projeto.nome || "Projeto Sem Nome"}
                </h3>
                <span
                    className={`text-sm font-semibold py-1 px-3 rounded-full ${
                    projeto.status === "Novo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Status: {projeto.status || "N/A"}
                </span>
                </div>

                {/* Corpo com informações */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                    <strong>Nome Item:</strong> {projeto.nome || "N/A"}
                </p>
                <p>
                    <strong>Responsável:</strong> {projeto.responsavel || "N/A"}
                </p>
                <p>
                    <strong>Valor:</strong> R$ {projeto.valor?.toString() || "N/A"}
                </p>
                <p>
                    <strong>Prazo:</strong> {formatarData(projeto.prazo) || "N/A"}
                </p>
                <p>
                    <strong>Data de Criação:</strong>{" "}
                    {formatarData(projeto.data_criacao) || "N/A"}
                </p>
                <p>
                    <strong>Data de Finalização:</strong>{" "}
                    {formatarData(projeto.data_finalizacao) || "N/A"}
                </p>
                </div>
            </div>
            ))
        ) : (
            <p className="text-center text-gray-500">Nenhum projeto encontrado.</p>
        )}
        </div>

  );
};

export { ClienteProjetos };