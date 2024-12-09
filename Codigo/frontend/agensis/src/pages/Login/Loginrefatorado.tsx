import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDestructive } from "./components/Erroalert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(""); // Estado para controlar o erro
  const [errorTitle, setErrorTitle] = useState(""); // Estado para o título do erro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar reload da página

    const data = { email, senha }; // Coleta os dados do formulário

    try {
      await fetch("http://localhost:3002/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            const token = data.token;
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));

            sessionStorage.setItem("authorization", data.token);
            sessionStorage.setItem("user_id", payload.user_id);
            sessionStorage.setItem("perfil", payload.perfil);

            payload.perfil === 'cliente' ? window.location.href = "../projeto" : //Opção para cliente
              window.location.href = "../dashboard"; //Opção para os demais perfis
          } else {
            setError(data.message || "Credenciais inválidas");
            setErrorTitle("Login falhou"); // Definir título do erro
          }
        });
    } catch (error) {
      setError("Ocorreu um erro. Por favor, tente novamente mais tarde.");
      setErrorTitle("Erro de conexão"); // Definir título do erro
      console.error("Erro:", error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {error && ( // Renderizar o AlertDestructive se houver erro
            <AlertDestructive Errotitle={errorTitle} errodescription={error} />
          )}
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Entre com os dados abaixo para fazer o login
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} // Atualiza o estado da senha
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login com Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem conta?{" "}
            <a href="/cadastro" className="underline">
              Cadastre
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/src/pages/Login/assets/imgs/Background.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
