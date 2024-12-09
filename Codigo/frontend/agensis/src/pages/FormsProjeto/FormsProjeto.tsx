import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface Campo {
    id: number;
    nome: string;
    tipo: string;
    obrigatorio: boolean;
}

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    campos: Campo[];
}


// const FormsProjeto = () => {
//     const [servicos, setServicos] = useState<Servico[]>([]);
//     const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
//     const [selectedServicos, setSelectedServicos] = useState<Servico[]>([]);
//     const [formData, setFormData] = useState<{ [key: string]: any }>({});

//     useEffect(() => {
//         const fetchServicos = async () => {
//             try {
//                 const response = await fetch("http://localhost:3002/api/servicos");
//                 if (!response.ok) throw new Error("Erro ao buscar serviços");
//                 const data = await response.json();
//                 setServicos(data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchServicos();
//     }, []);

//     const handleServicoChange = (id: number) => {
//         const servico = servicos.find(s => s.id === id) || null;
//         setSelectedServico(servico);
//     };

//     const handleAddServico = () => {
//         if (selectedServico && !selectedServicos.includes(selectedServico)) {
//             setSelectedServicos([...selectedServicos, selectedServico]);
//             setSelectedServico(null);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const userId = sessionStorage.getItem("user_id");
//             if (!userId) throw new Error("User ID não encontrado no sessionStorage");

//             const clienteResponse = await fetch(`http://localhost:3002/api/clientes/usuario/${userId}`);
//             if (!clienteResponse.ok) throw new Error("Erro ao buscar cliente");
//             const cliente = await clienteResponse.json();
//             const clienteId = cliente.id;
//             const clienteNome = cliente.nome;

//             for (const servico of selectedServicos) {
//                 const projectsResponse = await fetch("http://localhost:3002/api/projetos");
//                 if (!projectsResponse.ok) throw new Error("Erro ao buscar projetos");
//                 const projects = await projectsResponse.json();
//                 const nextProjectId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;

//                 const projectData = {
//                     nome: `${clienteNome}-${nextProjectId}-${servico.nome}`,
//                     cliente_id: clienteId,
//                     itensProjeto: [{
//                         servico_id: servico.id,
//                         cliente_id: clienteId,
//                         dadosItemCampos: servico.campos.map(campo => ({
//                             nome_campo: campo.nome,
//                             valor_digitado: formData[`${servico.id}-${campo.nome}`]?.toString() || "",
//                         })),
//                     }],
//                 };

//                 console.log("Criando projeto:", projectData);

//                 const projectResponse = await fetch("http://localhost:3002/api/projetos", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(projectData),
//                 });

//                 if (!projectResponse.ok) throw new Error("Erro ao salvar projeto");
//                 console.log("Projeto criado com sucesso:", await projectResponse.json());
//             }

//             console.log("Todos os projetos criados com sucesso");
//             window.location.reload();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <Label>Adicionar Serviço:</Label>
//                 <Select onValueChange={(value) => handleServicoChange(Number(value))}>
//                     <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Selecione um serviço" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectGroup>
//                             <SelectLabel>Serviços</SelectLabel>
//                             {servicos.map(servico => (
//                                 <SelectItem key={servico.id} value={servico.id.toString()}>
//                                     {servico.nome}
//                                 </SelectItem>
//                             ))}
//                         </SelectGroup>
//                     </SelectContent>
//                 </Select>
//                 <Button type="button" onClick={handleAddServico} className="mt-2">Adicionar Serviço</Button>
//             </div>

//             {selectedServicos.map(servico => (
//                 <div key={servico.id}>
//                     <Separator className="my-4" />
//                     <h3>{servico.nome}</h3>
//                     {servico.campos.map(campo => (
//                         <div key={campo.id}>
//                             <Label>{campo.nome}:</Label>
//                             <Input
//                                 type={campo.tipo === "Numero" ? "number" : "text"}
//                                 name={`${servico.id}-${campo.nome}`}
//                                 required={campo.obrigatorio}
//                                 onChange={handleInputChange}
//                                 className="w-full"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             ))}

//             <Button type="submit" className="mt-4">Criar Projetos</Button>
//         </form>
//     );
// };

// export default FormsProjeto;


// Original onde cada projeto possui um conjunto de itens:
    const FormsProjeto = () => {
        const [servicos, setServicos] = useState<Servico[]>([]);
        const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
        const [selectedServicos, setSelectedServicos] = useState<Servico[]>([]);
        const [formData, setFormData] = useState<{ [key: string]: any }>({});
    
        useEffect(() => {
            // Fetch services from the backend
            const fetchServicos = async () => {
                try {
                    const response = await fetch("http://localhost:3002/api/servicos");
                    if (!response.ok) throw new Error("Erro ao buscar serviços");
                    const data = await response.json();
                    setServicos(data);
                } catch (error) {
                    console.error(error);
                }
            };
    
            fetchServicos();
        }, []);
    
        const handleServicoChange = (id: number) => {
            const servico = servicos.find(s => s.id === id) || null;
            setSelectedServico(servico);
        };
    
        const handleAddServico = () => {
            if (selectedServico && !selectedServicos.includes(selectedServico)) {
                setSelectedServicos([...selectedServicos, selectedServico]);
                setSelectedServico(null);
            }
        };
    
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        };
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                // Obter o user_id do sessionStorage
                const userId = sessionStorage.getItem("user_id");
                if (!userId) throw new Error("User ID não encontrado no sessionStorage");
    
                // Fetch the cliente_id and nome based on the user_id
                const clienteResponse = await fetch(`http://localhost:3002/api/clientes/usuario/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!clienteResponse.ok) throw new Error("Erro ao buscar cliente");
                const cliente = await clienteResponse.json();
                const clienteId = cliente.id;
                const clienteNome = cliente.nome; // Supondo que a resposta contenha o nome do cliente
    
                // Fetch the list of projects to determine the next project ID
                const projectsResponse = await fetch("http://localhost:3002/api/projetos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!projectsResponse.ok) throw new Error("Erro ao buscar projetos");
                const projects = await projectsResponse.json();
                const nextProjectId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;
    
                // Prepare the project and item project data
                const projectData = {
                    nome: `${clienteNome}-${nextProjectId}`, // Use the next project ID in the name
                    cliente_id: clienteId, // Use the fetched cliente_id
                    itensProjeto: selectedServicos.map(servico => ({
                        servico_id: servico.id,
                        cliente_id: clienteId, // Use the fetched cliente_id
                        dadosItemCampos: servico.campos.map(campo => ({
                            nome_campo: campo.nome,
                            valor_digitado: formData[`${servico.id}-${campo.nome}`].toString(),
                        })),
                    })),
                };
    
                console.log("Dados do projeto:", projectData);
    
                // Create the project with the determined ID in the name
                const projectResponse = await fetch("http://localhost:3002/api/projetos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(projectData),
                });
    
                if (!projectResponse.ok) throw new Error("Erro ao salvar projeto");
                const createdProject = await projectResponse.json();
    
                // Save each item project
                for (const item of projectData.itensProjeto) {
                    const itemProjectResponse = await fetch("http://localhost:3002/api/itemProjeto", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...item,
                            projeto_id: createdProject.id,
                        }),
                    });
    
                    if (!itemProjectResponse.ok) throw new Error("Erro ao salvar item do projeto");
                }
    
                console.log("Projeto e itens do projeto salvos com sucesso");
                window.location.reload(); // Recarregar a página para exibir o novo projeto
            } catch (error) {
                console.error(error);
            }
        };
    
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Adicionar Serviço:</Label>
                    <Select onValueChange={(value) => handleServicoChange(Number(value))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Serviços</SelectLabel>
                                {servicos.map(servico => (
                                    <SelectItem key={servico.id} value={servico.id.toString()}>
                                        {servico.nome}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddServico} className="mt-2">Adicionar Serviço</Button>
                </div>
    
                {selectedServicos.map(servico => (
                    <div key={servico.id}>
                        <Separator className="my-4" />
                        <h3>{servico.nome}</h3>
                        {servico.campos.map(campo => (
                            <div key={campo.id}>
                                <Label>{campo.nome}:</Label>
                                <Input
                                    type={campo.tipo === "Numero" ? "number" : "text"}
                                    name={`${servico.id}-${campo.nome}`}
                                    required={campo.obrigatorio}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                ))}
    
                <Button type="submit" className="mt-4">Salvar Projeto</Button>
            </form>
        );
    };
    
    export default FormsProjeto;