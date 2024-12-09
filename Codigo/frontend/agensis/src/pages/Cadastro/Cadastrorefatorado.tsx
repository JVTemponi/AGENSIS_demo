import { useState } from "react";
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

export default function CadastroRefatorado() {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const completeData = {
      nome: formData.nome,
      sobrenome: formData.sobrenome,
      usuarioCLiente: {
        email: formData.email,
        senha: formData.senha
      }
    };

    console.log("Dados completos do formulário:", completeData);

    fetch("http://localhost:3002/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completeData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar os dados.");
        }
        window.location.href = "../login"
        return response.json();
      })
      .then((data) => {
        console.log("Resposta do servidor:", data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  return (
    <div className="flex items-center w-full">
      <Card className="h-auto mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cadastro</CardTitle>
          <CardDescription>
            Entre com os dados abaixo para fazer o cadastro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Primeiro nome</Label>
                <Input id="nome"
                  placeholder="Leonardo"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sobrenome">Ultimo nome</Label>
                <Input id="sobrenome"
                  placeholder="Da Vince"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
            <Button type="submit" className="w-full">
              Crie sua conta
            </Button>
            <Button variant="outline" className="w-full">
              Criar conta with Gmail
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já possui uma conta?{" "}
            <a href="/login" className="underline">
              Faça login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
