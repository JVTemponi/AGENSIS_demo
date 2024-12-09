import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Novatransacao } from "./components/Modalcriar";
import { Separator } from "@/components/ui/separator"

// Importação dos gráficos
import { Entradasconfirmadas } from "./graficos/Entradasconfirmadas";
import { Entradaspendentes } from "./graficos/Entradaspendentes";
import { EntradasCombinadas } from "./graficos/Entradascombinadas";

import { SaidasConfirmadas } from "./graficos/Saidasconfirmadas";
import { SaidasEsperadas } from "./graficos/Saidasesperadas";
import { SaidasCombinadas } from "./graficos/Saidascombinadas";

import { ComparativoEntradasSaidas } from "./graficos/EntradasSaidas";
import { ComparativoEntradasSaidasconfirmadas } from "./graficos/EntradasSaidasconfirmadas";
import { ComparativoTransacoesDonut } from "./graficos/Comparacaototal";

import { TransacoesTable } from "./components/Tabela";

export default function Financa() {
  const [viewMode, setViewMode] = useState("Compacta"); // Define o modo de visualização

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="mb-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Financeiro
        </h2>
      </div>

      {/* Dropdown para selecionar modo de visualização */}
      <div className="mb-6 flex">
        <div className="mr-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{viewMode}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewMode("Detalhada")}>Detalhada</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("Compacta")}>Compacta</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Novatransacao />
      </div>
      {/* Renderização dos gráficos condicionalmente */}
      {viewMode === "Detalhada" ? (
        <>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Overview:
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <ComparativoEntradasSaidas />
            <ComparativoEntradasSaidasconfirmadas />
            <ComparativoTransacoesDonut />
          </div>
          <h2 className="scroll-m-20 mt-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Entradas:
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <Entradasconfirmadas />
            <Entradaspendentes />
            <EntradasCombinadas />
          </div>
          <h2 className="scroll-m-20 mt-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Saídas:
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <SaidasConfirmadas />
            <SaidasEsperadas />
            <SaidasCombinadas />
          </div>
          <h2 className="scroll-m-20 mt-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Todas as transações:
          </h2>
          <TransacoesTable />
        </>
      ) : (
        <>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Overview:
          </h2>
          <div className="max-w-xl mb-5">
            <ComparativoEntradasSaidas />
          </div>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Entradas:
          </h2>
          <div className="max-w-xl mb-5">
            <EntradasCombinadas />
          </div>
          <h2 className="scroll-m-20 mt-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Saídas:
          </h2>
          <div className="max-w-xl">
            <SaidasCombinadas />
          </div>
          {/* <Separator />
          <h2 className="scroll-m-20 mt-5 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Todas as transações:
          </h2>
          <TransacoesTable /> */}
        </>
      )}
    </div>
  );
}
