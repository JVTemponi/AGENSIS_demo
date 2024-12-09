import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const getToken = () => sessionStorage.getItem("authorization");
const token = getToken();

export default function CadastroArtista() {
    const [formData, setFormData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        habilidades: "",
        experiencia: "",
        email: "",
        senha: "",
        perfilArtista: "",
    });
    const [perfis, setPerfis] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const carregarPerfis = async () => {
            try {
                const response = await axios.get("http://localhost:3002/api/perfis", {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                const nomesPerfis = response.data.map((perfil: { nome: string }) => perfil.nome);
                setPerfis(nomesPerfis);
            } catch (error) {
                console.error("Erro ao carregar os perfis:", error);
                setError("Falha ao carregar os perfis.");
                setErrorTitle("Erro de Conexão");
            }
        };
        carregarPerfis();
    }, []);

    // Formatação do CPF com limite de 14 caracteres
    const formatarCpf = (value: string) => {
        return value
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: id === "cpf" ? formatarCpf(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const completeData = {
            nome: formData.nome,
            sobrenome: formData.sobrenome,
            cpf: formData.cpf,
            habilidades: formData.habilidades,
            experiencia: formData.experiencia,
            usuarioArtista: {
                email: formData.email,
                senha: formData.senha,
            },
            perfilArtista: formData.perfilArtista,
        };

        try {
            const response = await axios.post("http://localhost:3002/api/artistas", completeData, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });
            console.log("Resposta do servidor:", response.data);
            setSuccessMessage("Perfil e permissões criados com sucesso!");
            window.location.href = "../dashboard";
        } catch (error) {
            console.error("Erro ao criar perfil ou permissões:", error);
            setError("Erro ao criar perfil.");
            setErrorTitle("Falha na operação");
        }
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-col p-6 bg-background text-foreground">
                <div className="mb-5">
                    <h2 className="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Cadastro de artista
                    </h2>
                </div>
                <Card className="mx-auto max-w-md mb-5">
                    <CardHeader>
                        <CardTitle className="text-xl">Cadastro de Artista</CardTitle>
                        <CardDescription>Preencha os dados para cadastrar um artista</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nome">Nome</Label>
                                    <Input
                                        id="nome"
                                        placeholder="Leonardo"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sobrenome">Sobrenome</Label>
                                    <Input
                                        id="sobrenome"
                                        placeholder="Da Vinci"
                                        value={formData.sobrenome}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={handleInputChange}
                                    required
                                    maxLength={14} // Limite máximo incluindo os caracteres de formatação
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="habilidades">Habilidades</Label>
                                <textarea
                                    id="habilidades"
                                    placeholder="Descreva as habilidades do artista"
                                    value={formData.habilidades}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg resize-y focus:outline-none"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="experiencia">Experiência</Label>
                                <textarea
                                    id="experiencia"
                                    placeholder="Descreva a experiência do artista"
                                    value={formData.experiencia}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg resize-y focus:outline-none"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email" // Validação HTML para o email
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="email@exemplo.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="senha">Senha</Label>
                                <Input
                                    id="senha"
                                    type="password"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="perfilArtista">Perfil</Label>
                                <select
                                    id="perfilArtista"
                                    value={formData.perfilArtista}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-2 py-2 border rounded-lg focus:outline-none"
                                >
                                    <option value="">Selecione um perfil</option>
                                    {perfis.map((perfil) => (
                                        <option key={perfil} value={perfil}>
                                            {perfil}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                                Cadastrar Artista
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
