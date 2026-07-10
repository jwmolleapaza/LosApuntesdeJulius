// Página de Recursos Gratuitos (Plantillas Descargables y Cursos en Video)
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { triggerDownload } from '../services/utils';
import SEOHead from '../components/SEOHead';
import { Download, FileSpreadsheet, FileText, FileArchive, CheckCircle, Play, X } from 'lucide-react';

export default function Recursos() {
  const [resources, setResources] = useState(dbService.getResources());
  const [downloadedId, setDownloadedId] = useState(null);
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

  const handleDownload = (res) => {
    // Incrementar en almacenamiento
    dbService.incrementDownload(res.id);
    
    if (res.localFileContent) {
      // Descargar archivo local codificado en base64
      const link = document.createElement('a');
      link.href = res.localFileContent;
      link.download = res.localFileName || res.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (res.url) {
      // Si es una página vinculada, abrir en nueva pestaña
      window.open(res.url, '_blank');
    } else {
      // Simular el contenido del archivo dependiendo del tipo (comportamiento original por defecto)
      let fileContent = '';
      let filename = res.title.toLowerCase().replace(/\s+/g, '-') + (res.fileType.includes('Excel') ? '.csv' : res.fileType.includes('PDF') ? '.pdf' : '.zip');
      let mimeType = 'text/plain';

      if (res.fileType.includes('Excel')) {
        fileContent = "Semana,Previsto,Real,Holgura\nSemana 1,100,90,10\nSemana 2,200,195,5\nSemana 3,300,310,-10\nSemana 4,400,420,-20";
        mimeType = 'text/csv';
      } else if (res.fileType.includes('PDF')) {
        fileContent = "%PDF-1.4 Mock de Fichero de Control de Cimentaciones y Encofrados de Julius";
        mimeType = 'application/pdf';
      } else {
        fileContent = "Mock ZIP de Apuntes de WBS de Edificaciones de Julius";
        mimeType = 'application/octet-stream';
      }

      // Disparar la descarga real del navegador
      triggerDownload(filename, fileContent, mimeType);
    }

    // Actualizar la vista local de conteo
    setResources(dbService.getResources());
    setDownloadedId(res.id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  const getIcon = (type) => {
    if (type.includes('Excel')) return FileSpreadsheet;
    if (type.includes('PDF')) return FileText;
    return FileArchive;
  };

  // Ordenar y clasificar los recursos
  const sortedResources = [...resources].sort((a, b) => (a.order || 99) - (b.order || 99));
  const downloadables = sortedResources.filter(r => r.resourceType !== 'video');
  const videos = sortedResources.filter(r => r.resourceType === 'video');

  return (
    <div className="resources-page container py-section">
      <SEOHead 
        title="Recursos Gratuitos y Videotutoriales" 
        description="Descarga plantillas gratis de Excel para Curva S, checklists en PDF y accede a videotutoriales técnicos de YouTube." 
      />

      <div className="blog-title-header text-center">
        <h1>Recursos Gratuitos para tu Aprendizaje</h1>
        <p className="lead">Descarga plantillas avanzadas de planificación de obras y accede a cursos prácticos en formato de video.</p>
      </div>

      {/* SECCIÓN 1: PLANTILLAS DESCARGABLES */}
      {downloadables.length > 0 && (
        <div className="recursos-section mb-5">
          <h2 className="recursos-subtitle">📁 Plantillas y Formatos Descargables</h2>
          <div className="grid grid-3 mt-4">
            {downloadables.map(res => {
              const ResIcon = getIcon(res.fileType);
              return (
                <div key={res.id} className="resource-detail-card">
                  <div className="resource-meta-row">
                    <span className="file-type-tag">{res.fileType}</span>
                    <span className="file-size-tag">{res.fileSize}</span>
                  </div>
                  <div className="resource-body">
                    <div className="resource-avatar-icon">
                      <ResIcon size={24} />
                    </div>
                    <h3>{res.title}</h3>
                    <p>{res.description}</p>
                  </div>
                  <div className="resource-actions-row">
                    <span className="download-count">📥 {res.downloadCount} descargas</span>
                    <button 
                      className={`btn-primary ${downloadedId === res.id ? 'btn-downloaded' : ''}`}
                      onClick={() => handleDownload(res)}
                    >
                      {downloadedId === res.id ? (
                        <>
                          <CheckCircle size={14} /> ¡Descargado!
                        </>
                      ) : (
                        <>
                          <Download size={14} /> Descargar Gratis
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: CURSOS GRATUITOS Y VIDEOTUTORIALES */}
      {videos.length > 0 && (
        <div className="recursos-section">
          <h2 className="recursos-subtitle mt-5">🎥 Cursos Gratuitos y Videotutoriales</h2>
          <div className="grid grid-3 mt-4">
            {videos.map(res => (
              <div key={res.id} className="resource-detail-card video-resource-card">
                <div className="resource-meta-row">
                  <span className="file-type-tag video-tag">{res.fileType || 'Video'}</span>
                  <span className="file-size-tag duration-tag">{res.fileSize}</span>
                </div>
                <div className="resource-body">
                  <div className="resource-avatar-icon video-icon-box">
                    <Play size={24} fill="currentColor" />
                  </div>
                  <h3>{res.title}</h3>
                  <p>{res.description}</p>
                </div>
                <div className="resource-actions-row">
                  <span className="download-count">👁️ {res.downloadCount} visitas</span>
                  <button 
                    className="btn-primary btn-video"
                    onClick={() => {
                      dbService.incrementDownload(res.id);
                      setResources(dbService.getResources());
                      setActiveVideo(res);
                    }}
                  >
                    Ver Curso Gratis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Reproducción de Video */}
      {activeVideo && (
        <div className="modal-overlay" style={{zIndex: 1000}}>
          <div className="modal-content" style={{maxWidth: 768, width: '90%', padding: 0, overflow: 'hidden'}}>
            <div className="modal-header" style={{padding: '16px 20px', borderBottom: '1px solid var(--border)'}}>
              <h3 style={{fontSize: 16, fontWeight: 800}}>{activeVideo.title}</h3>
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
                  <span style={{fontSize: 11, color: 'var(--text-light)'}}>⏱️ Duración: {activeVideo.fileSize} • {activeVideo.fileType}</span>
                  <a 
                    href={activeVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary btn-video"
                    style={{display: 'inline-flex', alignItems: 'center', gap: 6}}
                  >
                    Ver en YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .recursos-subtitle {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          border-left: 4px solid var(--primary);
          padding-left: 12px;
          margin-top: 30px;
        }
        .resource-detail-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .resource-detail-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .video-resource-card {
          border-top: 3px solid #ef4444;
        }
        .video-tag {
          background-color: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444 !important;
        }
        .video-icon-box {
          color: #ef4444 !important;
          background-color: rgba(239, 68, 68, 0.05) !important;
        }
        .btn-video {
          background-color: #ef4444 !important;
          border-color: #ef4444 !important;
        }
        .btn-video:hover {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
        }
        .resource-meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .file-type-tag {
          font-family: var(--font-code);
          font-size: 10px;
          background-color: var(--primary-glow);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
        }
        .file-size-tag {
          font-size: 11px;
          color: var(--text-light);
        }
        .resource-body {
          margin-bottom: 20px;
        }
        .resource-avatar-icon {
          width: 48px;
          height: 48px;
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          color: var(--text-muted);
        }
        .resource-body h3 {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .resource-body p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .resource-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 14px;
        }
        .download-count {
          font-size: 11px;
          color: var(--text-light);
          font-weight: 500;
        }
        .btn-downloaded {
          background-color: #10b981 !important;
          border-color: #10b981 !important;
        }
      `}} />
    </div>
  );
}
