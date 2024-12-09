import { useEffect, useState } from "react";
import axios from "axios";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDestructive } from "@/components/ui/erroalert";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormField,
} from "@/components/ui/form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from "react-router-dom";


const FormSchema = z.object({
    nomePerfil: z.string().min(1, "Nome do perfil é obrigatório"),
    permissoes: z.array(z.string()),
});

type Permissao = {
    recurso: string;
    acao: string;
};

export default function CriarPerfil() {
    const navigate = useNavigate();
    const [permissoesOrganizadas, setPermissoesOrganizadas] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [errorTitle, setErrorTitle] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nomePerfil: "",
            permissoes: [],
        },
    });

    const getToken = () => sessionStorage.getItem("authorization");

    useEffect(() => {
        const carregarPermissoes = async () => {
            try {
                const token = getToken();
                const response = await axios.get("http://localhost:3002/api/permissoes", {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                const permissoes: Permissao[] = response.data;
                const organizadas = permissoes.reduce((acc: Record<string, string[]>, permissao) => {
                    const { recurso, acao } = permissao;
                    if (!acc[recurso]) acc[recurso] = [];
                    acc[recurso].push(acao);
                    return acc;
                }, {});

                setPermissoesOrganizadas(organizadas);
            } catch (error) {
                console.error("Erro ao carregar permissões:", error);
                setError("Falha ao carregar permissões.");
                setErrorTitle("Erro de Conexão");
            }
        };
        carregarPermissoes();
    }, []);

    const handleCriarPerfil = async (data: z.infer<typeof FormSchema>) => {
        try {
            const token = getToken();
    
            // Criação do perfil
            const criarPerfilResponse = await axios.post(
                "http://localhost:3002/api/perfis",
                { nome: data.nomePerfil },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                }
            );
    
            const perfilCriado = criarPerfilResponse.data.nome;
    
            // Associações de permissões ao perfil
            const promises: Promise<any>[] = data.permissoes.map((permissao) => {
                const [recursoPermissao, acaoPermissao] = permissao.split(".");
                const nomePermissao = `${acaoPermissao}${recursoPermissao}`;
    
                return axios.post(
                    "http://localhost:3002/api/permissaoPerfis",
                    { perfil: perfilCriado, permissao: nomePermissao },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": token,
                        },
                    }
                );
            });
    
            // Executar todas as promessas
            await Promise.all(promises);
    
            setSuccessMessage("Perfil e permissões criados com sucesso!");
            navigate("/listarPerfis");
        } catch (error: any) {
            console.error("Erro ao criar perfil ou permissões:", error);
    
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Erro desconhecido";
                setError(message);
            } else {
                setError("Erro ao criar perfil.");
            }
            setErrorTitle("Falha na operação");
        }
    };
    
    return (
        <div className="container mx-auto p-8">
            {error && <AlertDestructive Errotitle={errorTitle} errodescription={error} />}
            {successMessage && (
                <Alert className="mb-5">
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Novo perfil adicionado!</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}
            <Button
                className="absolute top-4 right-4"
                onClick={() => navigate("/listarPerfis")}
            >
                Listar Perfis
            </Button>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCriarPerfil)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="nomePerfil"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className="scroll-m-20 text-2xl font-semibold tracking-tight"
                                    htmlFor="nomePerfil">Nome do Perfil</FormLabel>
                                <FormControl>
                                    <Input id="nomePerfil" placeholder="Digite o nome do perfil" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
                            Permissões
                        </h3>
                        {/* <Separator /> */}
                        {Object.entries(permissoesOrganizadas).map(([recurso, acoes]) => (
                            <div key={recurso} className="mb-4">
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="font-bold text-lg mb-2">{recurso}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {acoes.map((acao) => {
                                                    const permissaoId = `${recurso}.${acao}`;
                                                    return (
                                                        <FormField
                                                            key={permissaoId}
                                                            control={form.control}
                                                            name="permissoes"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            id={permissaoId}
                                                                            checked={field.value.includes(permissaoId)}
                                                                            onChange={() => {
                                                                                if (field.value.includes(permissaoId)) {
                                                                                    field.onChange(field.value.filter((item) => item !== permissaoId));
                                                                                } else {
                                                                                    field.onChange([...field.value, permissaoId]);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none">
                                                                        <FormLabel htmlFor={permissaoId} className="font-semibold">
                                                                            {acao}
                                                                        </FormLabel>
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="w-full">
                        Criar Perfil
                    </Button>
                </form>
            </Form>
        </div>
    );
}
