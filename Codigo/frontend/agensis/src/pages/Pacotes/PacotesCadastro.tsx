import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
}

interface Pacote {
  id?: number;
  titulo: string;
  descricao: string;
  servicos: Servico[];
  servicosIds: [];
}

interface PacoteCadastroProps {
  onSave: () => void;
  pacote?: Pacote | null;
}

// Define o schema para validação e tipagem do formulário
const formSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  //servicosIds: z.array(z.number()).default([]).optional(),
  servicosIds: z.array(z.number()).refine((value) => value.length > 0, {
    message: "Selecione pelo menos um serviço"
  }) 
});

// Tipo inferido do schema
type FormValues = z.infer<typeof formSchema>;

const PacotesCadastro = ({ onSave, pacote }: PacoteCadastroProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      servicosIds: [],
    },
  });

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/servicos');
        if (!response.ok) throw new Error('Erro ao buscar serviços');
        const data = await response.json();
        setServicos(data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        setError('Não foi possível carregar a lista de serviços.');
      }
    };

    fetchServicos();
  }, []);

  useEffect(() => {
    if (pacote) {
      const servicosIds = pacote.servicos.map(servico => servico.id);
      form.reset({
        titulo: pacote.titulo,
        descricao: pacote.descricao,
        servicosIds: servicosIds,
      });
      setServicosSelecionados(servicosIds);
    }
  }, [pacote, form]);

  const toggleServico = (servicoId: number) => {
    const newSelection = servicosSelecionados.includes(servicoId)
      ? servicosSelecionados.filter(id => id !== servicoId)
      : [...servicosSelecionados, servicoId];
    
    setServicosSelecionados(newSelection);
    form.setValue('servicosIds', newSelection, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    //console.log("Dados do formulário:", data);
    setIsLoading(true);
    setError(null);
    
    try {
      const pacoteData = {
        titulo: data.titulo,
        descricao: data.descricao,
        servicosIds: servicosSelecionados, //data.servicosIds, //
      };

      //console.log("Dados sendo enviados:", pacoteData);

      const response = await fetch(
        pacote?.id
          ? `http://localhost:3002/api/pacotes/${pacote.id}`
          : "http://localhost:3002/api/pacotes",
        {
          method: pacote?.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pacoteData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      //console.log("Pacote salvo com sucesso!");
      onSave();
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      setError(error instanceof Error ? error.message : "Erro ao salvar o pacote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo do Pacote</FormLabel>
              <FormControl>
                <Input placeholder="Digite o titulo do pacote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição do pacote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servicosIds"
          render={() => (
            <FormItem>
              <FormLabel>Serviços Incluídos</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {servicos.map(servico => (
                  <div key={servico.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`servico-${servico.id}`}
                      checked={servicosSelecionados.includes(servico.id)}
                      onChange={() => toggleServico(servico.id)}
                    />

                    <label htmlFor={`servico-${servico.id}`} className="text-sm">
                      {servico.nome}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Check className="w-4 h-4 mr-2" />
            {pacote ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PacotesCadastro;