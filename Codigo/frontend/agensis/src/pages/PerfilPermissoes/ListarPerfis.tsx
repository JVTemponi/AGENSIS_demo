import { useEffect, useState } from "react";
import axios from "axios";
import { RocketIcon, CaretSortIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type PerfilPermissoes = {
    perfil: string;
    permissoes: string[];
};

export default function ListarPerfis() {
    const [perfisPermissoes, setPerfisPermissoes] = useState<PerfilPermissoes[]>([]);
    const [expandedPerfil, setExpandedPerfil] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const getToken = () => sessionStorage.getItem("authorization");

    const carregarPerfisPermissoes = async () => {
        try {
            const token = getToken();
            const response = await axios.get(`http://localhost:3002/api/permissaoPerfis`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            const perfis = response.data.map((perfilObj: Record<string, string[]>) => {
                const [perfil, permissoes] = Object.entries(perfilObj)[0];
                return { perfil, permissoes };
            });

            setSuccessMessage("Perfil e permissões criados com sucesso!");
            setPerfisPermissoes(perfis);
        } catch (error) {
            console.error("Erro ao carregar permissões:", error);
            setError("Erro ao carregar permissões dos perfis.");
        }
    };

    useEffect(() => {
        carregarPerfisPermissoes();
    }, []);

    const togglePerfilExpansao = (perfil: string) => {
        setExpandedPerfil(expandedPerfil === perfil ? null : perfil);
    };

    return (
        <div className="container mx-auto p-8 bg-background text-foreground">
            {error && (
                <Alert className="mb-5" variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {successMessage && (
                <Alert className="mb-5 border-border">
                    <RocketIcon className="h-4 w-4 text-primary" />
                    <AlertTitle>Novo perfil adicionado!</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Perfis e Permissões</h3>
                {perfisPermissoes.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum perfil encontrado.</p>
                ) : (
                    <ul className="space-y-4">
                        {perfisPermissoes.map(({ perfil, permissoes }, index) => (
                            <li 
                                key={index} 
                                className={`
                                    rounded border border-border p-4 shadow-sm
                                    bg-card text-card-foreground
                                    transition-all duration-300 ease-in-out
                                    ${expandedPerfil === perfil ? 'bg-accent' : ''}
                                `}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-bold text-foreground">{perfil}</h4>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => togglePerfilExpansao(perfil)}
                                        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <CaretSortIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                {expandedPerfil === perfil && (
                                    <div 
                                        className="mt-2 pl-2 border-t border-border pt-2 
                                        animate-in fade-in slide-in-from-top-2"
                                    >
                                        {permissoes.length > 0 ? (
                                            <ul className="list-disc pl-5 text-sm text-foreground">
                                                {permissoes.map((permissao, i) => (
                                                    <li key={i} className="py-1">{permissao}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">Sem permissões.</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}