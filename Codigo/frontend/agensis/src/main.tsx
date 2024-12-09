import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Sistema } from './pages/SistemaConfig';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Servico } from './pages/Servico';
import { Projeto } from './pages/FormsProjeto';
import { Dashboard } from './pages/Dashboard';
import { CriarPerfil, ListarPerfis } from './pages/PerfilPermissoes';
import { Pacotes } from './pages/Pacotes';
import { CadastroArtista } from './pages/Artista';
import { ReuniaoTable } from './pages/Reunioes';
import { Financa } from './pages/Financas';
import { KanbanBoard } from './pages/Kanban';
import { EventosAgenda } from './pages/Agenda';
import { ClienteRating } from './pages/Cliente';
import { Itemespecifico } from './pages/Itemespecifico';
import { NotFound } from './pages/404';
import App from './App';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children:
      [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/cadastro',
          element: <Cadastro />,
        },
        {
          path: '/servico',
          element: <Servico />,
        },
        {
          path: '/projeto',
          element: <Projeto />,
        },
        {
          path: '/dashboard',
          element: <Dashboard />,
        },
        {
          path: '/criarPerfil',
          element: <CriarPerfil />,
        },
        {
          path: '/listarPerfis',
          element: <ListarPerfis />,
        },
        {
          path: '/sistema',
          element: <Sistema />,
        },
        {
          path: '/pacotes',
          element: <Pacotes />,
        },
        {
          path: '/criarArtista',
          element: <CadastroArtista />,
        },
        {
          path: '/reunioes',
          element: <ReuniaoTable />,
        },
        {
          path: '/financeiro',
          element: <Financa />,
        },
        {
          path: '/kanban',
          element: <KanbanBoard projetoId="someProjetoId" />,
        },
        {
          path: '/agenda',
          element: <EventosAgenda />,
        },
        {
          path: '/ratingclientes',
          element: <ClienteRating />,
        },
        {
          path: '/myitem',
          element: <Itemespecifico />,
        }
      ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
