// Enrutador y Layout principal para "Los Apuntes de Julius"
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Importar Páginas
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Categories from './pages/Categories';
import Servicios from './pages/Servicios';
import Recursos from './pages/Recursos';
import Cursos from './pages/Cursos';
import Membresias from './pages/Membresias';
import Contacto from './pages/Contacto';
import Legal from './pages/Legal';
import Admin from './pages/Admin';

// Importar Estilos
import './styles/variables.css';
import './styles/editor.css';
import './styles/admin.css';

export default function App() {
  const [route, setRoute] = useState('home');
  const [routeParam, setRouteParam] = useState(null);

  // Navegar de forma segura guardando el estado
  const navigateTo = (newRoute, param = null) => {
    setRoute(newRoute);
    setRouteParam(param);
    
    // Configurar hash en la URL para permitir retroceder/avanzar
    const hash = param ? `${newRoute}/${param}` : newRoute;
    window.location.hash = hash;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sincronizar estado con el hash de la URL al cargar o cambiar el historial
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setRoute('home');
        setRouteParam(null);
        return;
      }

      const parts = hash.split('/');
      const mainRoute = parts[0];
      const param = parts[1] || null;

      const validRoutes = [
        'home', 'blog', 'noticias', 'post', 'categorias', 
        'servicios', 'recursos', 'cursos', 'membresias', 'contacto', 'legal', 'admin'
      ];

      if (validRoutes.includes(mainRoute)) {
        setRoute(mainRoute);
        setRouteParam(param);
      } else {
        setRoute('home');
        setRouteParam(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Ejecutar al cargar la página

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Renderizar la página actual basándose en la ruta activa
  const renderPage = () => {
    switch (route) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'noticias':
        return <Blog onlyNoticias={true} filterQuery={routeParam} navigateTo={navigateTo} />;
      case 'blog':
        return <Blog onlyTechnical={true} filterQuery={routeParam} navigateTo={navigateTo} />;
      case 'post':
        return <PostDetail slug={routeParam} navigateTo={navigateTo} />;
      case 'categorias':
        return <Blog onlyTechnical={true} filterQuery={routeParam} navigateTo={navigateTo} />;
      case 'servicios':
        return <Servicios navigateTo={navigateTo} />;
      case 'recursos':
        return <Recursos navigateTo={navigateTo} />;
      case 'cursos':
        return <Cursos navigateTo={navigateTo} />;
      case 'membresias':
        return <Membresias navigateTo={navigateTo} />;
      case 'contacto':
        return <Contacto navigateTo={navigateTo} />;
      case 'legal':
        return <Legal type={routeParam} navigateTo={navigateTo} />;
      case 'admin':
        return <Admin navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Cabecera */}
      <Header currentRoute={route} navigateTo={navigateTo} />
      
      {/* Contenido Principal con animación suave */}
      <main className="main-content-layout">
        {renderPage()}
      </main>
      
      {/* Pie de Página */}
      <Footer navigateTo={navigateTo} />

      <style dangerouslySetInnerHTML={{__html: `
        .app-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .main-content-layout {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
      `}} />
    </div>
  );
}
