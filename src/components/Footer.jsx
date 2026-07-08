// Componente de Pie de Página (Footer) con boletín informativo y enlaces sociales
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { Mail, ArrowRight, Send, ShieldAlert, CheckCircle } from 'lucide-react';
import { Linkedin, Facebook, Youtube } from './BrandIcons';

export default function Footer({ navigateTo }) {
  const config = dbService.getConfig();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    const success = dbService.addSubscriber(email);
    if (success) {
      setSubscribed(true);
      setEmail('');
    } else {
      setError('Este correo electrónico ya se encuentra suscrito.');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        
        {/* Columna 1: Info e Identidad */}
        <div className="footer-col-info">
          <div className="footer-logo" onClick={() => navigateTo('home')}>
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="16" fill="var(--primary)" />
              <path d="M25 75V25H37L50 50L63 25H75V75H63V45L50 70L37 45V75H25Z" fill="white" />
              <line x1="15" y1="85" x2="85" y2="85" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="footer-logo-title">{config.siteName}</span>
          </div>
          <p className="footer-description">
            {config.tagline}
          </p>
          <div className="footer-social-links">
            {config.linkedInUrl && (
              <a href={config.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {config.facebookUrl && (
              <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            )}
            {config.youtubeChannelUrl && (
              <a href={config.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            )}
            {config.telegramUrl && (
              <a href={config.telegramUrl} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="Telegram">
                <Send size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="footer-col-links">
          <h4 className="footer-col-title">Plataforma</h4>
          <div className="footer-links-list">
            <button onClick={() => navigateTo('home')}>Inicio</button>
            <button onClick={() => navigateTo('noticias')}>Noticias</button>
            <button onClick={() => navigateTo('blog')}>Blog Técnico</button>
            <button onClick={() => navigateTo('servicios')}>Servicios</button>
            <button onClick={() => navigateTo('recursos')}>Recursos Gratuitos</button>
          </div>
        </div>

        {/* Columna 3: Legal y Soporte */}
        <div className="footer-col-links">
          <h4 className="footer-col-title">Legal e Info</h4>
          <div className="footer-links-list">
            <button onClick={() => { navigateTo('home'); setTimeout(() => { document.getElementById('nosotros-home')?.scrollIntoView({ behavior: 'smooth' }); }, 150); }}>Nosotros</button>
            <button onClick={() => navigateTo('cursos')}>Cursos Online</button>
            <button onClick={() => navigateTo('membresias')}>Membresías</button>
            <button onClick={() => navigateTo('legal', 'privacidad')}>Política de Privacidad</button>
            <button onClick={() => navigateTo('legal', 'terminos')}>Términos y Condiciones</button>
          </div>
        </div>

        {/* Columna 4: Newsletter / Suscripción */}
        <div className="footer-col-newsletter">
          <h4 className="footer-col-title">Newsletter Semanal</h4>
          <p className="newsletter-pitch">
            Únete a más de 1,500 ingenieros que reciben apuntes de control de proyectos y plantillas descargables gratis en su correo.
          </p>
          
          {subscribed ? (
            <div className="newsletter-success">
              <CheckCircle size={18} />
              <span>¡Suscrito con éxito! Gracias por unirte.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-container">
                <Mail className="mail-input-icon" size={16} />
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-submit-btn" aria-label="Suscribirse">
                  <ArrowRight size={16} />
                </button>
              </div>
              {error && (
                <div className="newsletter-error">
                  <ShieldAlert size={14} />
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} {config.siteName}. Inspirado en la simplicidad de Notion. Todos los derechos reservados.
          </p>
          <div className="monetization-badge-row">
            {config.adSenseActive && <span className="monetization-badge">Google AdSense Listado</span>}
            <span className="monetization-badge">Afiliados Activos</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .site-footer {
          background-color: var(--bg-card);
          border-top: 1px solid var(--border);
          padding-top: 60px;
          margin-top: auto;
          color: var(--text-muted);
          transition: background-color var(--transition-normal);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.5fr 0.8fr 0.8fr 1.5fr;
          }
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .footer-logo-title {
          font-weight: 800;
          font-size: 16px;
          color: var(--text-main);
          font-family: var(--font-title);
        }
        .footer-description {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          color: var(--text-muted);
        }
        .footer-social-links {
          display: flex;
          gap: 12px;
        }
        .social-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .social-icon-link:hover {
          color: var(--primary);
          background-color: var(--primary-glow);
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .footer-col-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-main);
          font-weight: 700;
          margin-bottom: 20px;
        }
        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-list button {
          background: none;
          border: none;
          color: var(--text-muted);
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0;
          width: fit-content;
        }
        .footer-links-list button:hover {
          color: var(--primary);
          text-decoration: underline;
        }
        .newsletter-pitch {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .newsletter-input-container {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: var(--bg-surface);
          padding: 4px 6px;
          position: relative;
        }
        .mail-input-icon {
          color: var(--text-light);
          margin-left: 8px;
          margin-right: 8px;
        }
        .newsletter-input-container input {
          border: none;
          background: none;
          padding: 8px 0;
          font-size: 13px;
          flex-grow: 1;
        }
        .newsletter-input-container input:focus {
          box-shadow: none;
        }
        .newsletter-submit-btn {
          background-color: var(--primary);
          color: white;
          border-radius: var(--radius-sm);
          padding: 8px;
          width: 32px;
          height: 32px;
        }
        .newsletter-submit-btn:hover {
          background-color: var(--primary-hover);
        }
        .newsletter-success {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
        }
        .newsletter-error {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
          padding-left: 4px;
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 24px 0;
          background-color: rgba(0,0,0,0.01);
        }
        .footer-bottom-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .footer-bottom-container {
            flex-direction: row;
          }
        }
        .copyright-text {
          font-size: 12px;
          color: var(--text-light);
          text-align: center;
        }
        .monetization-badge-row {
          display: flex;
          gap: 12px;
        }
        .monetization-badge {
          font-size: 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          color: var(--text-light);
        }
      `}} />
    </footer>
  );
}
