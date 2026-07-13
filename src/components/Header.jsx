// Componente de Cabecera y Navegación principal con buscador integrado y modo oscuro
import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../services/db';
import { Search, Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header({ currentRoute, navigateTo }) {
  const config = dbService.getConfig();
  const articles = dbService.getArticles();
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Efecto para cambiar el tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Cerrar el buscador al dar clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const filtered = articles.filter(art => 
        art.title.toLowerCase().includes(val.toLowerCase()) || 
        art.summary.toLowerCase().includes(val.toLowerCase()) ||
        art.category.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectArticle = (slug) => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
    navigateTo('post', slug);
  };

  const menuItems = [
    { label: 'Inicio', route: 'home' },
    !config.hideNoticias && { label: 'Noticias', route: 'noticias' },
    !config.hideBlog && { label: 'Blog', route: 'blog' },
    !config.hideRecursos && { label: 'Recursos', route: 'recursos' },
    !config.hideCursos && { label: 'Cursos', route: 'cursos' },
    !config.hideServicios && { label: 'Servicios', route: 'servicios' },
    !config.hideMembresias && { label: 'Membresías', route: 'membresias' },
    !config.hideContacto && { label: 'Contacto', route: 'contacto' }
  ].filter(Boolean);

  return (
    <header className="site-header">
      <div className="container header-container">
        
        {/* Logotipo Moderno SVG o Imagen Personalizada */}
        <div className="header-logo" onClick={() => navigateTo('home')}>
          {config.logoImage ? (
            <img 
              src={config.logoImage} 
              alt="Logo" 
              className="logo-img" 
              style={{height: 38, width: 'auto', maxWidth: 120, objectFit: 'contain'}} 
            />
          ) : (
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
              <rect width="100" height="100" rx="16" fill="var(--primary)" />
              <path d="M25 75V25H37L50 50L63 25H75V75H63V45L50 70L37 45V75H25Z" fill="white" />
              <line x1="15" y1="85" x2="85" y2="85" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <circle cx="50" cy="15" r="5" fill="white" />
            </svg>
          )}
          <div className="logo-text-wrapper">
            <span className="logo-title">{config.siteName}</span>
            <span className="logo-sub">{config.logoText}</span>
          </div>
        </div>

        {/* Buscador Rápido de Autocompletado */}
        <div className="header-search-container" ref={searchRef}>
          <div className="header-search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Buscar apuntes o tutoriales..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
            />
          </div>
          {searchFocused && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map(art => (
                <div 
                  key={art.id} 
                  className="search-result-item" 
                  onClick={() => handleSelectArticle(art.slug)}
                >
                  <div className="result-category">{art.category}</div>
                  <div className="result-title">{art.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menú de Navegación de Escritorio */}
        <nav className="header-nav">
          {menuItems.map(item => (
            <button
              key={item.route}
              className={`nav-link ${currentRoute === item.route ? 'active' : ''}`}
              onClick={() => navigateTo(item.route)}
            >
              {item.label}
            </button>
          ))}
          <button className="nav-link admin-trigger-btn" onClick={() => navigateTo('admin')}>
            Admin <ArrowUpRight size={14} />
          </button>
        </nav>

        {/* Controles del Lado Derecho */}
        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(prev => !prev)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className="mobile-search-results">
                {searchResults.map(art => (
                  <div 
                    key={art.id} 
                    className="mobile-search-result-item"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSelectArticle(art.slug);
                    }}
                  >
                    {art.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mobile-nav-links">
            {menuItems.map(item => (
              <button
                key={item.route}
                className={`mobile-nav-link ${currentRoute === item.route ? 'active' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo(item.route);
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="mobile-nav-link admin-mobile-link"
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('admin');
              }}
            >
              Panel de Administración
            </button>
          </div>
        </div>
      )}

      {/* Estilos locales del header para asegurar limpieza Notion-like y glassmorphism */}
      <style dangerouslySetInnerHTML={{__html: `
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--bg-header);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          transition: background-color var(--transition-normal);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .logo-title {
          font-weight: 800;
          font-size: 15px;
          color: var(--text-main);
          font-family: var(--font-title);
        }
        .logo-sub {
          font-size: 10px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .header-search-container {
          position: relative;
          width: 240px;
          display: none;
        }
        @media (min-width: 768px) {
          .header-search-container {
            display: block;
          }
        }
        .header-search-input-wrapper {
          display: flex;
          align-items: center;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 6px 12px;
          gap: 8px;
        }
        .header-search-input-wrapper input {
          border: none;
          background: none;
          padding: 0;
          font-size: 13px;
          width: 100%;
        }
        .header-search-input-wrapper input:focus {
          box-shadow: none;
        }
        .search-icon {
          color: var(--text-light);
        }
        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-top: 8px;
          box-shadow: var(--shadow-lg);
          max-height: 300px;
          overflow-y: auto;
          z-index: 200;
        }
        .search-result-item {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        .search-result-item:hover {
          background-color: var(--bg-surface);
        }
        .search-result-item:last-child {
          border-bottom: none;
        }
        .result-category {
          font-size: 10px;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
        }
        .result-title {
          font-size: 13px;
          color: var(--text-main);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-nav {
          display: none;
          gap: 4px;
        }
        @media (min-width: 992px) {
          .header-nav {
            display: flex;
          }
        }
        .nav-link {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 13px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-main);
          background-color: var(--bg-surface);
        }
        .admin-trigger-btn {
          border: 1px solid var(--border);
          background-color: rgba(0, 0, 0, 0.02);
        }
        .admin-trigger-btn:hover {
          background-color: var(--primary-glow);
          color: var(--primary);
          border-color: var(--primary);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .theme-toggle-btn, .mobile-menu-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .theme-toggle-btn:hover, .mobile-menu-btn:hover {
          background-color: var(--bg-surface);
          color: var(--text-main);
        }
        @media (min-width: 992px) {
          .mobile-menu-btn {
            display: none;
          }
        }
        /* Menú Móvil */
        .mobile-menu {
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-lg);
        }
        .mobile-search {
          display: flex;
          align-items: center;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 8px 14px;
          gap: 8px;
          position: relative;
        }
        .mobile-search input {
          border: none;
          background: none;
          padding: 0;
          width: 100%;
        }
        .mobile-search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          z-index: 20;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 4px;
          border-radius: var(--radius-md);
        }
        .mobile-search-result-item {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-nav-link {
          background: none;
          border: none;
          text-align: left;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          cursor: pointer;
          width: 100%;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background-color: var(--bg-surface);
          color: var(--text-main);
        }
        .admin-mobile-link {
          color: var(--primary);
          font-weight: 600;
          border: 1px dashed var(--primary-glow);
          margin-top: 8px;
        }
      `}} />
    </header>
  );
}
