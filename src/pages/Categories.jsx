// Página de Explorador de Categorías - Los Apuntes de Julius
import React from 'react';
import { dbService } from '../services/db';
import { ChevronRight, Folder } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Categories({ navigateTo }) {
  const categories = dbService.getCategories();
  const articles = dbService.getArticles().filter(a => a.status === 'publicado');

  // Calcular conteo real dinámico de artículos por categoría
  const categoriesWithCounts = categories.map(cat => {
    const realCount = articles.filter(art => art.category === cat.name).length;
    return { ...cat, count: realCount };
  });

  return (
    <div className="categories-page container py-section">
      <SEOHead 
        title="Categorías Técnicas" 
        description="Navega por las categorías especializadas en Ingeniería Civil, Planeamiento, Primavera P6, MS Project y Gestión de Proyectos." 
      />

      <div className="blog-title-header">
        <h1>Categorías Técnicas</h1>
        <p>Encuentra apuntes y guías organizados por especialidad o herramienta técnica.</p>
      </div>

      <div className="grid grid-3">
        {categoriesWithCounts.map(cat => (
          <div 
            key={cat.id} 
            className="category-explorer-card"
            onClick={() => navigateTo('blog', `cat:${cat.name}`)}
          >
            <div className="cat-explorer-icon">
              <Folder size={24} />
            </div>
            <div className="cat-explorer-info">
              <h3>{cat.name}</h3>
              <p>Explorar {cat.count} {cat.count === 1 ? 'publicación' : 'publicaciones'}</p>
            </div>
            <ChevronRight size={18} className="cat-explorer-arrow" />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .category-explorer-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          position: relative;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-sm);
        }
        .category-explorer-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .cat-explorer-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background-color: var(--primary-glow);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cat-explorer-info h3 {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .cat-explorer-info p {
          font-size: 13px;
          color: var(--text-light);
        }
        .cat-explorer-arrow {
          margin-left: auto;
          color: var(--text-light);
          transition: transform var(--transition-fast), color var(--transition-fast);
        }
        .category-explorer-card:hover .cat-explorer-arrow {
          transform: translateX(4px);
          color: var(--primary);
        }
      `}} />
    </div>
  );
}
