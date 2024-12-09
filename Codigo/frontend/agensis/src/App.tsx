import './App.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Sidebar/layout"

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  const hideLayoutRoutes = ['/', '/login', '/cadastro'];
  const notneedlogin = ['/login', '/cadastro'];

  useEffect(() => {
    // Verificação do token
    const token = sessionStorage.getItem('authorization');
    setIsLogged(!!token);
  }, []);

  // Redirecionamento
  useEffect(() => {
    if (isLogged === false && !notneedlogin.includes(location.pathname)) {
      navigate('/login');
    }
  }, [isLogged, location.pathname, navigate]);

  // Renderização condicional enquanto verifica o estado de login
  if (isLogged === null) {
    return null; // ou um spinner/loader
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="d-flex">
          {!hideLayoutRoutes.includes(location.pathname) && <Layout children={undefined} />}
        </div>
        <Outlet />
      </ThemeProvider>
  )
}

export default App