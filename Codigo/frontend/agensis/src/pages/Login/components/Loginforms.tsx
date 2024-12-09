"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "@/components/theme-provider";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Esquema de validação com Zod
const FormSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  senha: z.string().min(6, {
    message: "senha must be at least 6 characters.",
  }),
});

export function Loginform() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  // Função para enviar o login ao backend
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch('http://localhost:3002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("Login realizado com sucesso.");
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || 'Credenciais inválidas'}`);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
      console.error("Erro:", error);
    }
  }

  const { theme } = useTheme();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>
                Nome de usuario
              </FormLabel>
              <FormControl>
                <Input
                  className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                  placeholder="nome de usuario ...."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>
                Senha
              </FormLabel>
              <FormControl>
                <Input
                  className={theme === 'dark' ? 'text-black' : 'text-white'}
                  type="senha"
                  placeholder="senha ...."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
