// Página de Detalle de Artículo (Lector) - Los Apuntes de Julius
import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { formatDate } from '../services/utils';
import BlockRenderer from '../components/BlockRenderer';
import SEOHead from '../components/SEOHead';
import { 
  Clock, Award, Calendar, User, ArrowLeft, Share2, 
  Send, Link, MessageSquare, Check, Download 
} from 'lucide-react';
import { Linkedin, Facebook } from '../components/BrandIcons';

export default function PostDetail({ slug, navigateTo }) {
  const [copied, setCopied] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentSent, setCommentSent] = useState(false);

  const article = dbService.getArticleBySlug(slug);

  // Incrementar vistas e ir al tope de la página
  useEffect(() => {
    if (article) {
      dbService.incrementViews(slug);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="container py-section text-center">
        <h2>Artículo no encontrado</h2>
        <button className="btn-primary mt-4" onClick={() => navigateTo('blog')}>
          Volver al Blog
        </button>
      </div>
    );
  }

  // Extraer encabezados H2 y H3 para la Tabla de Contenidos automática
  const tocItems = article.blocks
    ? article.blocks
        .filter(b => b.type === 'title-h2' || b.type === 'title-h3')
        .map(b => ({
          type: b.type,
          text: b.content,
          id: b.content.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        }))
    : [];

  const comments = dbService.getComments(article.id).filter(c => c.status === 'aprobado');
  const relatedPosts = dbService.getArticles()
    .filter(art => art.category === article.category && art.id !== article.id && art.status === 'publicado')
    .slice(0, 2);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentAuthor || !commentEmail || !commentBody) return;

    dbService.addComment({
      articleId: article.id,
      author: commentAuthor,
      email: commentEmail,
      content: commentBody
    });

    setCommentSent(true);
    setCommentAuthor('');
    setCommentEmail('');
    setCommentBody('');
  };

  return (
    <div className="post-detail-page container py-section">
      <SEOHead 
        title={article.title} 
        description={article.summary} 
        keywords={article.tags.join(', ')}
        slug={article.slug}
        image={article.image}
        type="article"
        articleData={article}
      />

      {/* Botón Volver */}
      <button className="btn-back-blog" onClick={() => navigateTo('blog')}>
        <ArrowLeft size={16} /> Volver al Blog
      </button>

      {/* Cabecera del Artículo */}
      <header className="article-header">
        <div className="article-meta-top">
          <span className="article-category-badge">{article.category}</span>
          <span className={`badge badge-${article.difficulty.toLowerCase()}`}>{article.difficulty}</span>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-summary-lead">{article.summary}</p>
        
        <div className="article-author-row">
          <div className="author-info">
            <User size={16} />
            <span>Por <strong>{article.author}</strong></span>
          </div>
          <div className="author-info">
            <Calendar size={16} />
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="author-info">
            <Clock size={16} />
            <span>{article.readTime} minutos de lectura</span>
          </div>
        </div>
      </header>

      {/* Imagen Destacada Principal */}
      <div className="article-featured-img">
        <img src={article.image} alt={article.title} />
      </div>

      {/* Layout de Lectura */}
      <div className="sidebar-layout mt-4">
        
        {/* Lector Principal */}
        <article className="article-main-body">
          <BlockRenderer blocks={article.blocks} />
          
          {/* Compartir al Final */}
          <div className="share-box-bottom">
            <h4>¿Te pareció útil este apunte? Compártelo:</h4>
            <div className="share-buttons-row">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn-share-link linkedin">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="btn-share-link telegram">
                <Send size={16} /> Telegram
              </a>
              <button className="btn-share-link copy" onClick={handleShareCopy}>
                {copied ? <Check size={16} color="#10b981" /> : <Link size={16} />}
                {copied ? 'Copiado' : 'Copiar Enlace'}
              </button>
            </div>
          </div>

          {/* Sección de Comentarios */}
          <section className="comments-section mt-4">
            <h3 className="section-title"><MessageSquare size={20} /> Comentarios ({comments.length})</h3>
            
            <div className="comments-list mt-4">
              {comments.length === 0 ? (
                <p className="no-comments-pitch">No hay comentarios en este artículo. ¡Sé el primero en aportar a la discusión técnica!</p>
              ) : (
                comments.map(com => (
                  <div key={com.id} className="comment-bubble">
                    <div className="comment-head">
                      <strong>{com.author}</strong>
                      <span>{com.date}</span>
                    </div>
                    <p className="comment-content">{com.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Formulario de Comentarios */}
            <div className="comment-form-card mt-4">
              <h4>Dejar un Comentario Técnico</h4>
              <p>Tu dirección de correo electrónico no será publicada. Los comentarios están moderados.</p>
              
              {commentSent ? (
                <div className="comment-success-msg">
                  <Check size={18} />
                  <span>Tu comentario ha sido enviado con éxito y está pendiente de aprobación por el moderador.</span>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="comment-form-grid">
                  <div className="form-row-2">
                    <div className="admin-form-group">
                      <label>Nombre *</label>
                      <input 
                        type="text" 
                        required 
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Ej. Ing. Juan Pérez"
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Correo Electrónico *</label>
                      <input 
                        type="email" 
                        required 
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        placeholder="juan.perez@email.com"
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Comentario *</label>
                    <textarea 
                      required 
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      placeholder="Escribe tu consulta o aporte técnico..."
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn-primary">Enviar Comentario</button>
                </form>
              )}
            </div>
          </section>

        </article>

        {/* Barra Lateral del Lector */}
        <aside className="article-sidebar">
          
          {/* Tabla de Contenidos Automática */}
          {tocItems.length > 0 && (
            <div className="sidebar-card toc-card">
              <h3 className="sidebar-card-title">Tabla de Contenidos</h3>
              <ul className="toc-list">
                {tocItems.map((item, idx) => (
                  <li key={idx} className={`toc-item-${item.type}`}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Anuncios AdSense */}
          <div className="ad-slot sidebar-ad">
            <span>PUBLICIDAD GOOGLE ADSENSE</span>
          </div>

          {/* Artículos Relacionados */}
          {relatedPosts.length > 0 && (
            <div className="sidebar-card related-posts-card">
              <h3 className="sidebar-card-title">Artículos Relacionados</h3>
              <div className="related-list">
                {relatedPosts.map(post => (
                  <div key={post.id} className="related-item" onClick={() => navigateTo('post', post.slug)}>
                    <img src={post.image} alt={post.title} />
                    <div className="related-item-info">
                      <h4>{post.title}</h4>
                      <span>{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .btn-back-blog {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          padding: 0;
        }
        .btn-back-blog:hover {
          color: var(--primary);
        }
        .article-header {
          margin-bottom: 24px;
        }
        .article-meta-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .article-title {
          font-size: 32px;
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 12px;
        }
        @media (min-width: 768px) {
          .article-title {
            font-size: 40px;
          }
        }
        .article-summary-lead {
          font-size: 18px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .article-author-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 12px 0;
        }
        .author-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .article-featured-img {
          width: 100%;
          height: 300px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        @media (min-width: 768px) {
          .article-featured-img {
            height: 400px;
          }
        }
        .article-featured-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Tabla de contenidos sidebar */
        .toc-card {
          position: sticky;
          top: 90px;
        }
        .toc-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .toc-item-title-h2 {
          padding-left: 0;
          font-size: 13px;
          font-weight: 600;
        }
        .toc-item-title-h3 {
          padding-left: 14px;
          font-size: 12px;
          color: var(--text-light);
        }
        .toc-list a {
          color: var(--text-muted);
        }
        .toc-list a:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        /* Compartir */
        .share-box-bottom {
          margin-top: 40px;
          border-top: 1px solid var(--border);
          padding-top: 24px;
        }
        .share-box-bottom h4 {
          font-size: 15px;
          margin-bottom: 12px;
        }
        .share-buttons-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-share-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .btn-share-link.linkedin:hover {
          background-color: #0077b5;
          color: white;
          border-color: #0077b5;
        }
        .btn-share-link.telegram:hover {
          background-color: #0088cc;
          color: white;
          border-color: #0088cc;
        }
        .btn-share-link.copy:hover {
          background-color: var(--bg-surface);
          color: var(--text-main);
        }

        /* Comentarios */
        .comments-section {
          border-top: 1px solid var(--border);
          padding-top: 40px;
        }
        .no-comments-pitch {
          font-size: 14px;
          color: var(--text-light);
          font-style: italic;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .comment-bubble {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .comment-head {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 8px;
        }
        .comment-head strong {
          color: var(--text-main);
          font-size: 13px;
        }
        .comment-content {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .comment-form-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .comment-form-card h4 {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .comment-form-card p {
          font-size: 12px;
          color: var(--text-light);
          margin-bottom: 20px;
        }
        .comment-form-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 576px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .comment-success-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
        }

        /* Sidebar Relacionados */
        .related-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .related-item {
          display: flex;
          gap: 10px;
          cursor: pointer;
        }
        .related-item:hover h4 {
          color: var(--primary);
          text-decoration: underline;
        }
        .related-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .related-item-info h4 {
          font-size: 12px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .related-item-info span {
          font-size: 10px;
          color: var(--text-light);
        }
      `}} />
    </div>
  );
}
