"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { useTheme } from "@/components/theme-provider";
// import { toast } from "@/hooks/use-toast";
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

interface InputFormProps {
  goToPart2: () => void;
  onSubmit: (data: any) => void; // Nova prop para receber a função de submit
}

// Definindo o esquema de validação com Zod
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação de senha deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem.",
});

export const InputForm: React.FC<InputFormProps> = ({ goToPart2, onSubmit }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  // Função de envio de dados para o componente pai
  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    // Envia os dados para o componente pai
    onSubmit(data);
    goToPart2(); // Chama a função para ir para a próxima parte do cadastro
  }

  return (
    <Form {...form}>
      <div className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}>
        <h1 className={theme === 'dark' ? 'text-black' : 'text-white'}>Cadastro</h1>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-full">
          {/* Campo Nome */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome aqui ..."
                    {...field}
                    className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Seu email aqui ..."
                    {...field}
                    className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha aqui ..."
                      {...field}
                      className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <PiEyeClosedBold size={20} /> : <PiEyeBold size={20} />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Confirmar Senha */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-black' : 'text-white'}>Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      {...field}
                      className={theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <PiEyeClosedBold size={20} /> : <PiEyeBold size={20} />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de submit */}
          <Button type="submit">Cadastrar</Button>
        </form>
      </div>
    </Form>
  );
};
