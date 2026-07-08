// Página de Inicio (Home) - Los Apuntes de Julius
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { BookOpen, Award, Clock, ArrowRight, Eye, Play, Download, Star, ChevronRight, X } from 'lucide-react';
import { Youtube } from '../components/BrandIcons';
import SEOHead from '../components/SEOHead';

export default function Home({ navigateTo }) {
  const config = dbService.getConfig();
  const articles = dbService.getArticles().filter(a => a.status === 'publicado');
  const categories = dbService.getCategories();
  const resources = dbService.getResources();
  const courses = dbService.getCourses();

  const featuredPost = articles.find(a => a.featured) || articles[0];
  const recentPosts = articles.filter(a => a.id !== (featuredPost ? featuredPost.id : '')).slice(0, 3);
  const topReadPosts = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  const [searchVal, setSearchVal] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/embed')) return url;
      if (url.includes('list=')) {
        const match = url.match(/[?&]list=([^#\&\?]+)/);
        if (match) {
          return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
        }
      }
      if (url.includes('youtube.com/watch')) {
        const match = url.match(/[?&]v=([^#\&\?]+)/);
        if (match) {
          return `https://www.youtube.com/embed/${match[1]}`;
        }
      }
      if (url.includes('youtu.be/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('?')[0];
        if (id) {
          return `https://www.youtube.com/embed/${id}`;
        }
      }
    } catch (e) {
      console.error("Error parsing YT URL", e);
    }
    return url;
  };

  const videoResources = resources.filter(r => r.resourceType === 'video');
  const displayVideos = videoResources.length > 0 ? videoResources.slice(0, 3) : [
    {
      id: 'res-mock-1',
      title: 'Cómo calcular holguras en Primavera P6',
      description: 'Vídeo tutorial detallado sobre el cálculo de holgura libre y holgura total.',
      url: 'https://www.youtube.com/watch?v=MockP6Playlist',
      fileSize: '15 min',
      fileType: 'Tutorial',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'res-mock-2',
      title: 'Configuración de la EPS (Estructura de la Empresa)',
      description: 'Tutorial paso a paso para configurar tu estructura EPS en Primavera P6.',
      url: 'https://www.youtube.com/watch?v=MSProjectMasterclass',
      fileSize: '20 min',
      fileType: 'Tutorial',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'res-mock-3',
      title: 'EVM: Gestión del Valor Ganado con MS Project',
      description: 'Domina los conceptos de EV, PV, AC y variaciones en tus informes de Project.',
      url: 'https://www.youtube.com/watch?v=MSProjectMasterclass',
      fileSize: '25 min',
      fileType: 'Tutorial',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const getYoutubeThumbnail = (url, fallbackImg) => {
    if (!url) return fallbackImg;
    try {
      if (url.includes('youtube.com/watch')) {
        const match = url.match(/[?&]v=([^#\&\?]+)/);
        if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
      if (url.includes('youtu.be/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('?')[0];
        if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
    } catch (e) {}
    return fallbackImg || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigateTo('blog', searchVal);
    }
  };

  return (
    <div className="home-page-container">
      {/* Dynamic SEO Meta */}
      <SEOHead 
        title="Inicio" 
        description={config.tagline} 
        keywords="ingeniería civil, planeamiento de obra, Primavera P6, MS Project, lecciones aprendidas, cursos construcción"
      />

      {/* 1. Banner Principal Editable con Buscador */}
      <section className="hero-banner">
        <div className="container hero-content">
          <span className="hero-badge">🎓 PLATAFORMA PROFESIONAL DE INGENIERÍA</span>
          <h1 className="hero-title">{config.tagline}</h1>
          <p className="hero-subtitle">
            Aprende Primavera P6, MS Project y metodologías de gestión de proyectos con guías detalladas e inspiradas en la simplicidad y rigor técnico.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search-form">
            <input 
              type="text" 
              placeholder="¿Qué deseas aprender hoy? (Ej: Ruta Crítica, WBS, Primavera...)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="btn-primary">Buscar Guía</button>
          </form>

          <div className="hero-cta-buttons">
            <button className="btn-primary" onClick={() => navigateTo('blog')}>
              Explorar Artículos <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => navigateTo('recursos')}>
              Recursos Gratuitos
            </button>
          </div>
        </div>
      </section>

      {/* AdSense Top Banner */}
      {config.adSenseActive && (
        <div className="container">
          <div className="ad-slot ad-top-banner">
            {config.adSenseSlotTop}
            <span>Espacio de Anuncios - Google AdSense (Banner Superior)</span>
          </div>
        </div>
      )}

      {/* 2. Categorías Principales */}
      <section className="categories-preview py-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Categorías Técnicas</h2>
              <p className="section-subtitle">Navega por las áreas clave de la ingeniería y gestión de obras</p>
            </div>
            <button className="btn-link" onClick={() => navigateTo('blog')}>
              Ver Todas <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="categories-grid grid grid-3">
            {categories.slice(0, 6).map(cat => (
              <div 
                key={cat.id} 
                className="category-card"
                onClick={() => cat.name === 'Noticias' ? navigateTo('noticias') : navigateTo('blog', `cat:${cat.name}`)}
              >
                <div className="category-card-info">
                  <h3>{cat.name}</h3>
                  <span>{cat.count || 0} publicaciones</span>
                </div>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Artículo Destacado */}
      {featuredPost && (
        <section className="featured-post-section py-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Artículo Destacado</h2>
            </div>
            <div className="featured-card" onClick={() => navigateTo('post', featuredPost.slug)}>
              <div className="featured-img-container">
                <img src={featuredPost.image} alt={featuredPost.title} />
                <span className="featured-badge-overlay">Destacado</span>
              </div>
              <div className="featured-content">
                <span className="featured-category">{featuredPost.category}</span>
                <h3 className="featured-title">{featuredPost.title}</h3>
                <p className="featured-summary">{featuredPost.summary}</p>
                
                <div className="featured-meta">
                  <div className="meta-item">
                    <Award size={14} />
                    <span className={`badge badge-${featuredPost.difficulty.toLowerCase()}`}>
                      {featuredPost.difficulty}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{featuredPost.readTime} min de lectura</span>
                  </div>
                  <div className="meta-item">
                    <Eye size={14} />
                    <span>{featuredPost.views} vistas</span>
                  </div>
                </div>

                <button className="btn-primary featured-cta">
                  Leer Apunte <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Últimos Artículos y Más Leídos (Layout lateral) */}
      <section className="posts-layout-section py-section">
        <div className="container sidebar-layout">
          
          {/* Columna Izquierda: Últimos Artículos */}
          <div className="main-posts-column">
            <h2 className="section-title mb-4">Últimas Publicaciones</h2>
            <div className="posts-list-grid">
              {recentPosts.map(post => (
                <div key={post.id} className="post-row-card" onClick={() => navigateTo('post', post.slug)}>
                  <img src={post.image} alt={post.title} className="post-row-img" />
                  <div className="post-row-info">
                    <div className="post-row-meta">
                      <span className="post-row-category">{post.category}</span>
                      <span className="divider-dot">•</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="post-row-title">{post.title}</h3>
                    <p className="post-row-summary">{post.summary}</p>
                    <div className="post-row-badges">
                      <span className={`badge badge-${post.difficulty.toLowerCase()}`}>{post.difficulty}</span>
                      <span className="read-time-label"><Clock size={12} /> {post.readTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full mt-4" onClick={() => navigateTo('blog')}>
              Ver Todos los Artículos
            </button>
          </div>

          {/* Columna Derecha: Más Leídos y Recursos */}
          <div className="sidebar-column">
            
            {/* Anuncio Lateral */}
            {config.adSenseActive && (
              <div className="ad-slot sidebar-ad">
                {config.adSenseSlotSidebar}
                <span>Anuncio Lateral - Google AdSense</span>
              </div>
            )}

            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Lo Más Leído</h3>
              <div className="sidebar-list">
                {topReadPosts.map((post, idx) => (
                  <div key={post.id} className="sidebar-list-item" onClick={() => navigateTo('post', post.slug)}>
                    <span className="item-number">0{idx + 1}</span>
                    <div className="item-content">
                      <h4>{post.title}</h4>
                      <span>{post.category} • {post.views} vistas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recursos Gratuitos Destacados */}
            <div className="sidebar-card mt-4">
              <h3 className="sidebar-card-title">Recursos Gratuitos</h3>
              <div className="sidebar-resources-list">
                {resources.slice(0, 2).map(res => (
                  <div key={res.id} className="sidebar-resource-item">
                    <div className="resource-icon-box">
                      <Download size={18} />
                    </div>
                    <div className="resource-info">
                      <h4>{res.title}</h4>
                      <span>{res.fileType} • {res.fileSize}</span>
                    </div>
                    <button className="btn-icon" onClick={() => navigateTo('recursos')}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Cursos Destacados */}
      <section className="courses-featured-section py-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Cursos Profesionales</h2>
              <p className="section-subtitle">Capacítate en las herramientas líderes del mercado de construcción</p>
            </div>
            <button className="btn-link" onClick={() => navigateTo('cursos')}>
              Ver Catálogo <ChevronRight size={16} />
            </button>
          </div>

          <div className="courses-grid grid grid-2">
            {courses.slice(0, 2).map(course => (
              <div key={course.id} className="course-home-card">
                <img src={course.image} alt={course.title} className="course-home-img" />
                <div className="course-home-info">
                  <div className="course-badge-row">
                    <span className="course-level-badge">{course.level}</span>
                    <span className="course-duration-badge">{course.duration}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-price-row">
                    <span className="course-price">${course.price} USD</span>
                    <button 
                      className="btn-primary" 
                      onClick={() => {
                        if (course.link && (course.link.startsWith('http://') || course.link.startsWith('https://'))) {
                          window.open(course.link, '_blank', 'noopener,noreferrer');
                        } else {
                          navigateTo('cursos');
                        }
                      }}
                    >
                      Inscribirse <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Videos Recientes de YouTube */}
      <section className="youtube-videos-section py-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title flex-items-center">
              <Youtube color="#ff0000" size={24} className="mr-2" /> Videos Recientes
            </h2>
            <a href={config.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
              Visitar Canal
            </a>
          </div>

          <div className="youtube-grid grid grid-3">
            {displayVideos.map(vid => (
              <div key={vid.id} className="yt-card" style={{cursor: 'pointer'}} onClick={() => {
                dbService.incrementDownload(vid.id);
                setActiveVideo(vid);
              }}>
                <div className="yt-embed-mock">
                  <img src={getYoutubeThumbnail(vid.url, vid.image)} alt={vid.title} />
                  <div className="play-overlay"><Play fill="white" size={32} /></div>
                </div>
                <h4>{vid.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Reproducción de Video */}
      {activeVideo && (
        <div className="modal-overlay" style={{zIndex: 1000}}>
          <div className="modal-content" style={{maxWidth: 768, width: '90%', padding: 0, overflow: 'hidden'}}>
            <div className="modal-header" style={{padding: '16px 20px', borderBottom: '1px solid var(--border)'}}>
              <h3 style={{fontSize: 16, fontWeight: 800, color: 'var(--text-main)'}}>{activeVideo.title}</h3>
              <button className="btn-icon" onClick={() => setActiveVideo(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{padding: 0}}>
              <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', backgroundColor: '#000'}}>
                <iframe 
                  src={getYoutubeEmbedUrl(activeVideo.url)}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                ></iframe>
              </div>
              <div style={{padding: '20px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14}}>
                <p style={{fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0}}>{activeVideo.description}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: 11, color: 'var(--text-light)'}}>⏱️ Duración: {activeVideo.fileSize || 'N/A'} • {activeVideo.fileType || 'Video'}</span>
                  <a 
                    href={activeVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary"
                    style={{display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white'}}
                  >
                    Ver en YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6.5. Sección Sobre Nosotros (Editable) */}
      <section id="nosotros-home" className="about-home-section py-section">
        <div className="container">
          <div className="about-home-card grid grid-2">
            <div className="about-home-img-container">
              <img 
                src={config.aboutImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'} 
                alt={config.aboutTitle || 'Sobre Nosotros'} 
                className="about-home-img"
              />
            </div>
            <div className="about-home-text-content">
              <span className="about-home-tag">CONOCE AL AUTOR</span>
              <h2>{config.aboutTitle || 'Sobre Nosotros'}</h2>
              <p className="about-home-text">
                {config.aboutText}
              </p>
              {config.aboutBullets && (
                <div className="about-home-bullets">
                  {config.aboutBullets.split(',').map((bullet, bIdx) => (
                    <div key={bIdx} className="about-bullet-item">
                      <span className="about-bullet-icon">✓</span>
                      <span>{bullet.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Membresía Promo CTA Banner */}
      <section className="membership-promo-section py-section">
        <div className="container">
          <div className="promo-banner-card">
            <div className="promo-info">
              <span className="promo-tag">PREMIUM</span>
              <h2>Únete a la Membresía Ingeniero Master</h2>
              <p>
                Accede a la biblioteca completa de descargas ilimitadas de plantillas MS Project, archivos .xer de Primavera P6 y soporte técnico exclusivo.
              </p>
              <button className="btn-primary" onClick={() => navigateTo('membresias')}>
                Ver Beneficios de Membresía
              </button>
            </div>
            <div className="promo-graphic">
              <Star size={80} className="glow-star-icon" fill="rgba(255,255,255,0.15)" />
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        /* Banner principal Hero */
        .hero-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          background-color: rgba(255,255,255,0.1);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          margin-bottom: 20px;
          color: #93c5fd;
        }
        .hero-title {
          font-size: 38px;
          font-weight: 800;
          color: white;
          line-height: 1.2;
          margin-bottom: 18px;
          font-family: var(--font-title);
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 46px;
          }
        }
        .hero-subtitle {
          font-size: 16px;
          color: #93c5fd;
          margin-bottom: 32px;
          max-width: 640px;
        }
        .hero-search-form {
          display: flex;
          width: 100%;
          max-width: 560px;
          background-color: white;
          padding: 6px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          margin-bottom: 24px;
        }
        .hero-search-form input {
          border: none;
          background: none;
          flex-grow: 1;
          color: #111827;
          padding: 10px 14px;
          font-size: 14px;
        }
        .hero-search-form input:focus {
          box-shadow: none;
        }
        .hero-search-form button {
          white-space: nowrap;
          padding: 0 20px;
        }
        .hero-cta-buttons {
          display: flex;
          gap: 12px;
        }
        .hero-cta-buttons .btn-secondary {
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hero-cta-buttons .btn-secondary:hover {
          background-color: rgba(255,255,255,0.2);
        }

        /* Secciones */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }
        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
        }
        .section-subtitle {
          font-size: 14px;
          color: var(--text-light);
          margin-top: 4px;
        }
        .flex-items-center {
          display: flex;
          align-items: center;
        }
        .mr-2 { margin-right: 8px; }
        .mb-4 { margin-bottom: 16px; }
        .mt-4 { margin-top: 16px; }
        .w-full { width: 100%; }

        /* Categorías */
        .category-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .category-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .category-card-info h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
        }
        .category-card-info span {
          font-size: 12px;
          color: var(--text-light);
        }
        .category-arrow {
          font-size: 18px;
          color: var(--text-light);
          transition: color var(--transition-fast);
        }
        .category-card:hover .category-arrow {
          color: var(--primary);
        }

        /* Tarjeta de Destacado */
        .featured-card {
          display: grid;
          grid-template-columns: 1fr;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        @media (min-width: 768px) {
          .featured-card {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        .featured-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .featured-img-container {
          position: relative;
          min-height: 250px;
        }
        .featured-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }
        .featured-badge-overlay {
          position: absolute;
          top: 16px;
          left: 16px;
          background-color: var(--primary);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .featured-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .featured-category {
          font-size: 12px;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .featured-title {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .featured-summary {
          font-size: 15px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .featured-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .featured-cta {
          width: fit-content;
        }

        /* Lista de Artículos Fila */
        .posts-list-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .post-row-card {
          display: flex;
          flex-direction: column;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        @media (min-width: 576px) {
          .post-row-card {
            flex-direction: row;
            height: 160px;
          }
        }
        .post-row-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .post-row-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        @media (min-width: 576px) {
          .post-row-img {
            width: 180px;
            height: 100%;
          }
        }
        .post-row-info {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .post-row-meta {
          font-size: 11px;
          color: var(--text-light);
          display: flex;
          gap: 6px;
          margin-bottom: 4px;
        }
        .post-row-category {
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
        }
        .post-row-title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .post-row-summary {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-row-badges {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .read-time-label {
          font-size: 11px;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Sidebar */
        .sidebar-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .sidebar-card-title {
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid var(--border);
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sidebar-list-item {
          display: flex;
          gap: 12px;
          cursor: pointer;
        }
        .sidebar-list-item:hover h4 {
          color: var(--primary);
          text-decoration: underline;
        }
        .item-number {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary);
          opacity: 0.5;
          line-height: 1;
        }
        .item-content h4 {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .item-content span {
          font-size: 10px;
          color: var(--text-light);
        }

        /* Recursos Sidebar */
        .sidebar-resources-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sidebar-resource-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
        }
        .resource-icon-box {
          background-color: var(--primary-glow);
          color: var(--primary);
          padding: 6px;
          border-radius: 6px;
        }
        .resource-info h4 {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 1px;
        }
        .resource-info span {
          font-size: 10px;
          color: var(--text-light);
        }

        /* Cursos */
        .course-home-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 576px) {
          .course-home-card {
            flex-direction: row;
          }
        }
        .course-home-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        @media (min-width: 576px) {
          .course-home-img {
            width: 180px;
            height: auto;
          }
        }
        .course-home-info {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .course-badge-row {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }
        .course-level-badge, .course-duration-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: bold;
        }
        .course-level-badge {
          background-color: var(--primary-glow);
          color: var(--primary);
        }
        .course-duration-badge {
          background-color: var(--bg-surface);
          color: var(--text-muted);
        }
        .course-home-info h3 {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .course-home-info p {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .course-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 10px;
        }
        .course-price {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }

        /* YouTube */
        .yt-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .yt-embed-mock {
          position: relative;
          padding-bottom: 56.25%;
          background-color: #000;
          cursor: pointer;
        }
        .yt-embed-mock img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: opacity var(--transition-fast);
        }
        .yt-card:hover img {
          opacity: 0.9;
        }
        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0,0,0,0.6);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--transition-fast);
        }
        .yt-card:hover .play-overlay {
          background-color: var(--primary);
        }
        .yt-card h4 {
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 700;
        }

        /* Promo Banner */
        .promo-banner-card {
          background: linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%);
          border-radius: var(--radius-lg);
          padding: 40px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .promo-info {
          max-width: 600px;
          z-index: 2;
        }
        .promo-tag {
          font-size: 9px;
          font-weight: 700;
          background-color: white;
          color: var(--primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.1em;
          display: inline-block;
          margin-bottom: 12px;
        }
        .promo-info h2 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }
        .promo-info p {
          font-size: 14px;
          color: #93c5fd;
          margin-bottom: 20px;
        }
        .promo-info button {
          background-color: white;
          color: var(--primary);
        }
        .promo-info button:hover {
          background-color: #f3f4f6;
        }
        .promo-graphic {
          position: absolute;
          right: 20px;
          bottom: -20px;
          z-index: 1;
          opacity: 0.2;
        }
        
        /* About Home Section */
        .about-home-section {
          background-color: var(--bg-card);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .about-home-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .about-home-img-container {
          min-height: 250px;
          position: relative;
        }
        .about-home-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: var(--radius-lg);
        }
        .about-home-text-content {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .about-home-text-content {
            padding: 0 40px;
          }
        }
        .about-home-tag {
          font-size: 10px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .about-home-text-content h2 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .about-home-text {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 14px;
          line-height: 1.5;
        }
        .about-home-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }
        .about-bullet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .about-bullet-icon {
          color: #10b981;
          font-weight: bold;
          flex-shrink: 0;
        }
      `}} />
    </div>
  );
}
