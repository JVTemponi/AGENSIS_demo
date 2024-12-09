"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectTrigger,
  SelectValue, 
  SelectContent,
  SelectGroup, 
  SelectItem
 } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, Plus, Trash } from "lucide-react";

const formSchema = z.object({
  nome: z.string().min(1, {
    message: "Nome é obrigatório.",
  }),
  descricao: z.string().min(1, {
    message: "Descrição é obrigatória.",
  }),
});

interface Campo {
  id: number;
  nome: string;
  tipo: 'Texto' | 'Numero Inteiro' | 'Numero Decimal' | 'Data' | 'Selecao';
  obrigatorio: boolean;
}

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  campos?: Campo[];
}

interface ServicoCadastroProps {
  onSave: (servico: Servico) => void;
  servico?: Servico | null;
}

const ServicoCadastro = ({ onSave, servico }: ServicoCadastroProps) => {
  const form = useForm<Servico>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //id: "",
      nome: "",
      descricao: "",
      campos: [],
    },
  });

  const [camposAdicionais, setCamposAdicionais] = useState<Campo[]>([]);

  useEffect(() => {
    if (servico) {
      form.setValue("id", servico.id);
      form.setValue("nome", servico.nome);
      form.setValue("descricao", servico.descricao);
      setCamposAdicionais(servico.campos || []); 
    }
  }, [servico, form]);

  const onSubmit = async (data: Servico) => {
    const servicoData = { ...data, campos: camposAdicionais };
  
    try {
      const response = await fetch(servico ? 
        `http://localhost:3002/api/servicos/${servico.id}` : 
        "http://localhost:3002/api/servicos", {
        method: servico ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicoData),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao salvar o serviço");
      }
  
      const result = await response.json();
      onSave(result);
    } catch (error) {
      console.error("Falha ao salvar:", error);
    }
  };

  const adicionarCampo = () => {
    setCamposAdicionais((prev) => [
      ...prev,
      {id: (camposAdicionais.length + 1) * -1, nome: "", tipo: 'Texto', obrigatorio: false },
    ]);
  };

  const removerCampo = (id: number) => {
    setCamposAdicionais((prev) => prev.filter(campo => campo.id !== id));
  };

  const atualizarCampo = (id: number, key: keyof Campo, value: any) => {
    setCamposAdicionais((prev) =>
      prev.map(campo =>
        campo.id === id ? { ...campo, [key]: value } : campo
      )
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do serviço" {...field} />
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
                <Input placeholder="Descrição do serviço" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seção para gerenciar campos adicionais */}
        <div>
          <h3>Campos Adicionais</h3>
          <div className="flex space-x-3 mb-2">
            <span className="font-semibold w-1/2">Nome do campo</span>
            <span className="font-semibold w-1/3">Tipo</span>
            <span className="font-semibold">Obrigatório</span>
            
          </div>
          {camposAdicionais.map((campo) => (
            <div key={campo.id} className="flex space-x-4 mb-2 items-center">
              <Input
                placeholder="Nome do campo"
                value={campo.nome}
                onChange={(e) => atualizarCampo(campo.id!, 'nome', e.target.value)}
                className="w-1/2"
              />
              <Select
                value={campo.tipo}
                onValueChange={(value) => atualizarCampo(campo.id!, 'tipo', value)}
              >
                <SelectTrigger className="w-1/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Texto">Texto</SelectItem>
                    <SelectItem value="Numero Inteiro">Número Inteiro</SelectItem>
                    <SelectItem value="Numero Decimal">Número Decimal</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Selecao">Seleção</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <select
                value={campo.tipo}
                onChange={(e) => atualizarCampo(campo.id!, 'tipo', e.target.value as any)}
                className="w-1/3 rounded px-3 py-2 bg-gray-100 border border-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                <option value="Texto">Texto</option>
                <option value="Numero Inteiro">Número Inteiro</option>
                <option value="Numero Decimal">Número Decimal</option>
                <option value="Data">Data</option>
                <option value="Selecao">Seleção</option>
              </select> */}
              <Checkbox
                id={`campo-${campo.id}`}
                checked={campo.obrigatorio}
                onChange={() => atualizarCampo(campo.id!, 'obrigatorio', !campo.obrigatorio)}
              />
              {/* <input
                type="checkbox"
                checked={campo.obrigatorio}
                onChange={(e) => atualizarCampo(campo.id!, 'obrigatorio', e.target.checked)}
              /> */}
              <Button title="Excluir Campo" variant="secondary" type="button" onClick={() => removerCampo(campo.id)}><Trash /></Button>
            </div>
          ))}
          <Button variant="secondary" type="button" onClick={adicionarCampo}><Plus />Adicionar Campo</Button>
        </div>

        <Button className="fixed bottom-4 right-4" type="submit"><Check />{servico ? "Atualizar" : "Cadastrar"}</Button>
      </form>
    </Form>
  );
};

export default ServicoCadastro;