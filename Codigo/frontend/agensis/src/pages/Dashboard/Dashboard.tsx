import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";

import { Separator } from "@/components/ui/separator";

import Areafin from "@/pages/Dashboard/components/Areafin";
import Areaoverview from "@/pages/Dashboard/components/AreaOverview";

async function usuarioSessionStorage() {
  const usuario_id = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("authorization");

  try {
    const usuarioResponse = await fetch(
      `http://localhost:3002/api/usuarios/${usuario_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "x-access-token": token }),
        },
      }
    );

    const usuarioData = await usuarioResponse.json();

    if (usuarioResponse.ok && !usuarioData.error) {
      const { id } = usuarioData;

      const artistaResponse = await fetch(
        `http://localhost:3002/api/artistas/usuario/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "x-access-token": token }),
          },
        }
      );

      const artistaData = await artistaResponse.json();

      if (artistaResponse.ok && !artistaData.error) {
        return artistaData.nome; // Retorna apenas o nome do artista
      } else {
        console.error(artistaData.message || "Erro ao buscar dados do artista");
        return null;
      }
    } else {
      console.error(usuarioData.message || "Erro ao buscar usuário");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [artistaNome, setArtistaNome] = useState("");
  const [perfil, setPerfil] = useState<string | null>(
    sessionStorage.getItem("perfil") // Inicializa diretamente com o valor do sessionStorage
  );

  useEffect(() => {
    const preencheUsuario = async () => {
      console.log("Perfil:", perfil);
      if (perfil === "admin") {
        setArtistaNome("admin");
      } else if (perfil != "cliente") {
        const nome = await usuarioSessionStorage();
        if (nome) {
          setArtistaNome(nome); // Preenche o nome do artista
          console.log("Nome do artista:", nome);
        }
      }
    };
    preencheUsuario();
  }, [perfil]); // Adiciona `perfil` como dependência do efeito

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col mt-10 mb-10 mr-2">
        <div className=" mb-2">
          <div className="flex items-center space-x-4 h-5">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Dashboard
            </h2>
            <Separator orientation="vertical" />
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              {artistaNome ? (
                "Olá " + artistaNome
              ) : (
                <Skeleton className="h-4 w-[250px]" />
              )}
            </h2>
          </div>
          <Separator className="my-4" />
        </div>
        <div className="flex space-x-5">
          <div className="lg:w-1/2 mb-2">
            <Areafin loading={loading} />
          </div>
          <div className="lg:w-1/2 mb-2">
            <Areaoverview loading={loading} />
          </div>
        </div>

        <div className="flex">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="container">
                <Skeleton className="h-[500px] w-[550px] rounded-xl" />
              </div>
            ) : null}
            {loading ? (
              <div className="container">
                <Skeleton className="h-[405px] w-[280px] rounded-xl" />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
