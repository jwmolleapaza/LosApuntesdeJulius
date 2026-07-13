// Página de Lista de Artículos (Blog) con buscador y múltiples filtros combinables
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Search, Filter, BookOpen, Clock, Tag } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Blog({ filterQuery, navigateTo, onlyTechnical, onlyNoticias }) {
  let articles = dbService.getArticles().filter(a => a.status === 'publicado');
  let categories = dbService.getCategories();

  if (onlyNoticias) {
    articles = articles.filter(a => a.category === 'Noticias');
    categories = categories.filter(c => c.name === 'Noticias');
  } else if (onlyTechnical) {
    articles = articles.filter(a => a.category !== 'Noticias');
    categories = categories.filter(c => c.name !== 'Noticias');
  }
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');

  // Inicializar filtros si se pasan argumentos de búsqueda
  useEffect(() => {
    if (filterQuery) {
      if (filterQuery.startsWith('cat:')) {
        setSelectedCategory(filterQuery.replace('cat:', ''));
      } else {
        setSearch(filterQuery);
      }
    }
  }, [filterQuery]);

  // Obtener todas las etiquetas únicas del sistema para filtros rápidos
  const allTags = Array.from(
    new Set(articles.reduce((acc, art) => [...acc, ...(art.tags || [])], []))
  );

  const [selectedTag, setSelectedTag] = useState('Todos');

  // Filtrado lógico de artículos
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todas' || art.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Todas' || art.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'Todos' || (art.tags && art.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTag;
  });

  return (
    <div className="blog-page-container container py-section">
      <SEOHead 
        title={onlyNoticias ? "Noticias de Minería" : "Artículos"} 
        description={onlyNoticias 
          ? "Sigue las últimas noticias del sector minero e inversiones en infraestructura." 
          : "Explora todos los artículos, guías detalladas y tutoriales de Primavera P6, MS Project y control de obras."} 
      />

      <div className="blog-title-header">
        <h1>{onlyNoticias ? 'Noticias de Ingeniería y Minería' : 'Artículos y Publicaciones'}</h1>
        <p>{onlyNoticias 
          ? 'Últimas novedades, inversiones mineras y actualidad del sector en el Perú.' 
          : 'Filtrado de lecciones técnicas en planificación, Primavera P6, MS Project y control de plazos.'}
        </p>
      </div>

      {/* Contenedor de Filtros */}
      <div className="filters-section">
        
        {/* Fila 1: Búsqueda */}
        <div className="filter-search-row">
          <div className="blog-search-box">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por palabra clave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Fila 2: Selectores de Categoría, Dificultad y Etiquetas */}
        <div className="filter-selects-row">
          {!onlyNoticias && (
            <div className="filter-group">
              <label><Filter size={12} /> Categoría</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="Todas">Todas las Categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group">
            <label><Clock size={12} /> Dificultad</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="Todas">Todos los Niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="filter-group">
            <label><Tag size={12} /> Etiquetas</label>
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
              <option value="Todos">Todas las Etiquetas</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Grid de Artículos */}
      {filteredArticles.length === 0 ? (
        <div className="no-results-box">
          <h3>No se encontraron publicaciones</h3>
          <p>Intenta ajustar tus criterios de búsqueda o limpia los filtros activos.</p>
          <button className="btn-secondary" onClick={() => {
            setSearch('');
            setSelectedCategory('Todas');
            setSelectedDifficulty('Todas');
            setSelectedTag('Todos');
          }}>
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="blog-cards-grid grid grid-3">
          {filteredArticles.map(art => (
            <div key={art.id} className="blog-item-card" onClick={() => navigateTo('post', art.slug)}>
              <div className="card-image-box">
                <img src={art.image} alt={art.title} />
                <span className="card-category-badge">{art.category}</span>
              </div>
              <div className="card-info-box">
                <div className="card-date-row">
                  <span>{art.date}</span>
                  <span className={`badge badge-${art.difficulty.toLowerCase()}`}>{art.difficulty}</span>
                </div>
                <h3>{art.title}</h3>
                <p>{art.summary}</p>
                <div className="card-footer-row">
                  <span className="read-time"><Clock size={12} /> {art.readTime} min lectura</span>
                  <span className="read-more-link">Leer más →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .blog-title-header {
          margin-bottom: 32px;
        }
        .blog-title-header h1 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .blog-title-header p {
          color: var(--text-muted);
          font-size: 15px;
        }
        
        /* Filtros */
        .filters-section {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .filter-search-row {
          margin-bottom: 16px;
        }
        .blog-search-box {
          display: flex;
          align-items: center;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 6px 14px;
          gap: 8px;
        }
        .blog-search-box input {
          border: none;
          background: none;
          padding: 4px 0;
          font-size: 14px;
          flex-grow: 1;
        }
        .blog-search-box input:focus {
          box-shadow: none;
        }
        .filter-selects-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-group label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .filter-group select {
          padding: 8px 10px;
          font-size: 13px;
        }

        /* Artículos Grid */
        .blog-item-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }
        .blog-item-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .card-image-box {
          position: relative;
          height: 180px;
        }
        .card-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-category-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: var(--bg-card);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .card-info-box {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-date-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 8px;
        }
        .blog-item-card h3 {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 8px;
          color: var(--text-main);
        }
        .blog-item-card p {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 16px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 12px;
          font-size: 12px;
        }
        .read-time {
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .read-more-link {
          color: var(--primary);
          font-weight: 600;
        }

        /* Sin Resultados */
        .no-results-box {
          text-align: center;
          padding: 48px;
          background-color: var(--bg-card);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
        }
        .no-results-box h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .no-results-box p {
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 16px;
        }
      `}} />
    </div>
  );
}
