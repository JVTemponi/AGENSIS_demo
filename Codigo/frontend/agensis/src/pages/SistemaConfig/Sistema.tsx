import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CriarPerfil from "@/pages/PerfilPermissoes/CriarPerfil";
import CadastrarArtista from "@/pages/Artista/CadastroArtista";
import GerenciarServicos from "@/pages/Servico/ServicoTable";
import Pacotes from "@/pages/Pacotes/PacotesTable";

export function Sistema() {
  const location = useLocation(); // Hook para obter a URL atual
  const [selectedButton, setSelectedButton] = useState("");

  // Efeito para atualizar selectedButton com base na URL
  useEffect(() => {
    switch (location.pathname) {
      case "/criarPerfil":
        setSelectedButton("perfil");
        break;
      case "/criarArtista":
        setSelectedButton("usuarios");
        break;
      case "/servico":
        setSelectedButton("servicos");
        break;
      case "/pacotes":
        setSelectedButton("pacotes");
        break;
      default:
        setSelectedButton(""); // ou algum valor padrão
    }
  }, [location.pathname]);

  return (
    <div className="flex-1 lg:max-w-2xl mx-40 my-40">
      <div className="space-y-6">
        {selectedButton === "perfil" ? (
          <CriarPerfil />
        ) : selectedButton === "usuarios" ? (
          <CadastrarArtista />
        ) : selectedButton === "servicos" ? (
          <GerenciarServicos />
        ) : selectedButton === "pacotes"  ? (
          <Pacotes />
        ) : null}
      </div>
    </div>
  );
}