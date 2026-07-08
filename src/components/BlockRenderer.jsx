// Componente que interpreta el JSON de bloques y los renderiza en HTML semántico con estilos
import React from 'react';

export default function BlockRenderer({ blocks }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="article-content-blocks">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'title-h1':
            return <h1 key={block.id || idx} className="block-title-h1">{block.content}</h1>;
          
          case 'title-h2':
            // Agregamos id dinámico para la tabla de contenidos automática
            const idH2 = block.content.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            return <h2 key={block.id || idx} id={idH2} className="block-title-h2">{block.content}</h2>;
          
          case 'title-h3':
            const idH3 = block.content.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            return <h3 key={block.id || idx} id={idH3} className="block-title-h3">{block.content}</h3>;
          
          case 'paragraph':
            return <p key={block.id || idx} className="block-paragraph">{block.content}</p>;
          
          case 'callout':
            return (
              <div key={block.id || idx} className={`block-callout ${block.style || 'info'}`}>
                <div className="block-callout-icon">
                  {block.style === 'warning' ? '⚠️' : block.style === 'danger' ? '🚫' : '💡'}
                </div>
                <div className="block-callout-content">{block.content}</div>
              </div>
            );
          
          case 'quote':
            return (
              <blockquote key={block.id || idx} className="block-quote">
                {block.content}
                {block.author && <span className="block-quote-author">— {block.author}</span>}
              </blockquote>
            );
          
          case 'list':
            return (
              <ul key={block.id || idx} className="block-list">
                {block.items && block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );

          case 'checklist':
            return (
              <div key={block.id || idx} className="block-checklist">
                {block.items && block.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="block-checklist-item">
                    <input type="checkbox" defaultChecked={item.checked} disabled />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            );
          
          case 'table':
            return (
              <div key={block.id || idx} className="block-table-container">
                <table className="block-table">
                  {block.headers && (
                    <thead>
                      <tr>
                        {block.headers.map((h, hIdx) => <th key={hIdx}>{h}</th>)}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {block.rows && block.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          
          case 'code':
            return (
              <div key={block.id || idx} className="block-code-container">
                <div className="block-code-header">
                  <span>{block.language || 'code'}</span>
                  <button 
                    className="block-code-copy-btn" 
                    onClick={() => {
                      navigator.clipboard.writeText(block.content);
                      alert('Código copiado al portapapeles');
                    }}
                  >
                    Copiar
                  </button>
                </div>
                <pre className="block-code">
                  <code>{block.content}</code>
                </pre>
              </div>
            );
          
          case 'divider':
            return <hr key={block.id || idx} className="block-divider" />;
          
          case 'accordion':
            return (
              <details key={block.id || idx} className="block-accordion">
                <summary className="block-accordion-summary">
                  {block.summary}
                  <span>▼</span>
                </summary>
                <div className="block-accordion-content">
                  {block.content}
                </div>
              </details>
            );

          case 'columns':
            return (
              <div key={block.id || idx} className="block-columns">
                {block.columns && block.columns.map((col, colIdx) => (
                  <div key={colIdx} className="block-column">
                    <BlockRenderer blocks={col.blocks} />
                  </div>
                ))}
              </div>
            );
          
          case 'youtube':
            // Extraer ID de Youtube si es una URL completa
            let ytId = block.content;
            if (ytId.includes('youtube.com') || ytId.includes('youtu.be')) {
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
              const match = ytId.match(regExp);
              ytId = (match && match[2].length === 11) ? match[2] : ytId;
            }
            return (
              <div key={block.id || idx} className="block-youtube">
                <iframe
                  title="YouTube video player"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          
          case 'image':
            return (
              <div key={block.id || idx} className="block-image-container">
                <img src={block.content} alt={block.caption || 'Imagen del artículo'} className="block-image" />
                {block.caption && <div className="block-image-caption">{block.caption}</div>}
              </div>
            );

          case 'gallery':
            return (
              <div key={block.id || idx} className="block-gallery">
                {block.urls && block.urls.map((url, urlIdx) => (
                  <img key={urlIdx} src={url} alt={`Galería ${urlIdx}`} className="block-gallery-img" />
                ))}
              </div>
            );
          
          case 'pdf':
            return (
              <div key={block.id || idx} className="block-pdf">
                <div className="block-pdf-header">
                  <span className="block-pdf-title">📎 Documento PDF: {block.title || 'Archivo adjunto'}</span>
                  <a href={block.content} target="_blank" rel="noopener noreferrer" className="btn-link">
                    Abrir en Nueva Pestaña
                  </a>
                </div>
                <iframe src={block.content} title="Visor PDF" className="block-pdf-embed" />
              </div>
            );
          
          case 'button':
            return (
              <div key={block.id || idx} className="block-button-container">
                <a href={block.url} className="btn-primary block-button-link" target="_blank" rel="noopener noreferrer">
                  {block.content || 'Haga clic aquí'}
                </a>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
