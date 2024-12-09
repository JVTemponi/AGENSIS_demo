import React, { useEffect, useState } from 'react';
import { CircleUser, Briefcase, MonitorCog, Video, Calendar, Home, CircleDollarSign, LayoutList, UserPlus, Brush, Star, ClipboardList, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projeto",
    url: "/projeto",
    icon: Briefcase,
  },
  {
    title: "Kanban",
    url: "/kanban",
    icon: LayoutList,
  },
  {
    title: "Calendario",
    url: "http://localhost:3002/agenda/autenticacao",
    icon: Calendar,
  },
  {
    title: "Reuniões",
    url: "/reunioes",
    icon: Video,
  },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: CircleDollarSign,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

const sistemaItems = [
  {
    title: "Criar Perfil",
    url: "/criarPerfil",
    icon: UserPlus,
  },
  {
    title: "Cadastrar Artista",
    url: "/criarArtista",
    icon: Brush,
  },
  {
    title: "Rating de Clientes",
    url: "/ratingclientes",
    icon: Star,
  },
  {
    title: "Gerenciar Serviços",
    url: "/servico",
    icon: ClipboardList,
  },
  {
    title: "Gerenciar Pacotes",
    url: "/pacotes",
    icon: Package,
  },
];


export function AppSidebar() {
  const location = useLocation(); // Hook para obter a URL atual
  const [isSistemaOpen, setIsSistemaOpen] = useState(false); // Estado para controlar o submenu
  const [perfil, setPerfil] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar o perfil do sessionStorage
    const storedPerfil = sessionStorage.getItem("perfil");
    setPerfil(storedPerfil); // Atualizar o estado com o valor do sessionStorage
  }, []);

  function handleLogout() {
    // Remover o perfil do sessionStorage
    sessionStorage.clear();
    // Redirecionar para a tela de login
    window.location.href = "/login";
  }

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      {/* <SidebarHeader>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => {
                  if (perfil === "cliente") {
                    // Mostrar apenas "Projeto", "Calendário" e "Reuniões" para clientes
                    return ["Projeto", "Calendario", "Reuniões"].includes(item.title);
                  } else {
                    // Mostrar todos os itens, exceto "Reuniões", para outros perfis
                    return item.title !== "Projeto";
                  }
                })
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center space-x-2 ${location.pathname === item.url ? "bg-primary text-primary-foreground" : ""
                          }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              {perfil === "cliente" ? (
                ""
              ) : (
                <SidebarMenuItem key="sistema">
                  <SidebarMenuButton
                    className={`flex items-center space-x-2`} // ${isSistemaOpen ? "bg-primary text-primary-foreground" : ""} hover:none
                    onClick={() => setIsSistemaOpen(!isSistemaOpen)}>
                    <MonitorCog />
                    <span>Sistema</span>
                  </SidebarMenuButton>
                  {isSistemaOpen && (
                    <div className="ml-4">
                      {sistemaItems.map((sistemaItem) => (
                        <SidebarMenuItem key={sistemaItem.title}>
                          <SidebarMenuButton asChild
                            tooltip={sistemaItem.title}
                          >
                            <a
                              href={sistemaItem.url}
                              className={`flex items-center space-x-2 ${location.pathname === sistemaItem.url ? "bg-primary text-primary-foreground" : ""
                                }`}
                            >
                              <sistemaItem.icon />
                              <span>{sistemaItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              )
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center space-x-4">
          <Button onClick={handleLogout} variant="outline">Logout</Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}