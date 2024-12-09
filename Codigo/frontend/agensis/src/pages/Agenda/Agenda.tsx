import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDestructive } from "@/components/ui/erroalert";

interface Evento {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

const EventFormSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
});

export default function EventosAgenda() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [autenticado, setAutenticado] = useState(true);
    const form = useForm<z.infer<typeof EventFormSchema>>({
        resolver: zodResolver(EventFormSchema),
    });

    const eventosLoader = async () => {
        try {
            const response = await axios.get("http://localhost:3002/agenda/eventos", {
                withCredentials: true,
            });
            setEventos(response.data);
            setAutenticado(true);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Se 401, redefine autenticado
                setAutenticado(false);
                setError("Session expired or user not authenticated.");
            } else {
                setError("Erro ao carregar eventos.");
                console.error("Erro ao carregar eventos:", error);
            }
        }
    };

    useEffect(() => {
        eventosLoader();
    }, []);

    const handleCriarEvento = async (data: z.infer<typeof EventFormSchema>) => {
        try {
            await axios.post("http://localhost:3002/agenda/criarEventos", data, {
                withCredentials: true,
            });
            setSuccessMessage("Evento criado com sucesso!");
            form.reset();
            await eventosLoader(); // Recarrega a lista de eventos
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setAutenticado(false);
                setError("Session expired or user not authenticated.");
            } else {
                setError("Erro ao criar evento: " + (axios.isAxiosError(error) ? error.response?.data.message || error.message : error));
            }
        }
    };

    const onGoogleLoginSuccess = async (response: any) => {
        if (response.credential) {
            const url = 'http://localhost:3002/redirect?code=' + response.credential;
            try {
                await axios.get(url);
                setAutenticado(true);
                setError("");
                await eventosLoader();
            } catch (error) {
                console.error("Erro ao autenticar com Google:", error);
                setError("Erro ao autenticar com Google.");
            }
        } else {
            setError("Erro ao autenticar com o Google.");
        }
    };

    return (
        <GoogleOAuthProvider clientId="692011208750-d68cqat71ande6jh1arv5fuk8sb84a9u.apps.googleusercontent.com">
            <div className="container mx-auto p-8">
                {!autenticado ? (
                    <div>
                        <AlertDestructive
                            Errotitle="Autenticação Necessária"
                            errodescription={error}
                        />
                        <GoogleLogin
                            onSuccess={onGoogleLoginSuccess}
                            onError={() => setError("Erro ao autenticar com o Google")}
                        />
                    </div>
                ) : (
                    <>
                        {error && (
                            <AlertDestructive Errotitle="Erro" errodescription={error} />
                        )}
                        {successMessage && (
                            <Alert className="mb-5">
                                <RocketIcon className="h-4 w-4" />
                                <AlertTitle>Sucesso</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}
                        <h1 className="text-2xl font-semibold mb-4">Eventos da Agenda</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {eventos
                                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                .map((evento) => (
                                    <div key={evento.id} className="p-4 border rounded-lg shadow-lg">
                                        <h2 className="text-xl font-bold">{evento.title}</h2>
                                        <p className="text-gray-300 text-sm font-bold">{evento.description}</p>
                                        <p className="text-gray-500">
                                            Início: {new Date(evento.startDate).toLocaleString("pt-BR")}
                                        </p>
                                        <p className="text-gray-500">
                                            Fim: {new Date(evento.endDate).toLocaleString("pt-BR")}
                                        </p>
                                    </div>
                                ))}
                        </div>
                        <h2 className="text-2xl font-semibold mb-4">Criar Novo Evento</h2>
                        <form onSubmit={form.handleSubmit(handleCriarEvento)} className="space-y-6">
                            {/* <div className="space-y-2">
                                <label className="block font-semibold">Título do Evento</label>
                                <Input placeholder="Digite o título" {...form.register("title")} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-semibold">Data de Início</label>
                                    <Input type="datetime-local" {...form.register("startDate")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-semibold">Data de Término</label>
                                    <Input type="datetime-local" {...form.register("endDate")} />
                                </div>
                            </div> */}
                            <Button type="button" className="w-full" onClick={() => window.open("https://calendar.google.com/calendar/u/0/r", "_blank")}>
                                Criar Evento
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </GoogleOAuthProvider>
    );
}

