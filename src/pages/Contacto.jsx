// Página de Contacto - Los Apuntes de Julius
import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { dbService } from '../services/db';

export default function Contacto() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Consultoría');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Registrar en logs la consulta
    dbService.addComment({
      articleId: 'contacto',
      author: name,
      email,
      content: `Mensaje de contacto [Asunto: ${subject}]: ${message}`
    });

    setSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="contact-page container py-section">
      <SEOHead 
        title="Contacto" 
        description="Ponte en contacto con Julius para consultorías técnicas en control de proyectos, cursos o soporte." 
      />

      <div className="blog-title-header text-center">
        <h1>Contacto</h1>
        <p className="lead">¿Tienes alguna pregunta, propuesta de colaboración o necesitas cotizar una consultoría técnica?</p>
      </div>

      <div className="sidebar-layout mt-4">
        
        {/* Formulario */}
        <div className="comment-form-card">
          <h3>Escríbenos un Mensaje</h3>
          <p className="mb-4">Responderemos a tu correo en un plazo máximo de 24 horas hábiles.</p>
          
          {success ? (
            <div className="comment-success-msg">
              <CheckCircle size={18} />
              <span>¡Mensaje enviado con éxito! Nos contactaremos a la brevedad.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="comment-form-grid">
              <div className="form-row-2">
                <div className="admin-form-group">
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ing. Sofía Ruiz"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Correo Electrónico *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sofia.ruiz@constructora.com"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Asunto *</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="Consultoría">Consultoría de Proyectos</option>
                  <option value="Capacitación">Capacitación de Personal / Cursos</option>
                  <option value="Afiliación">Propuestas de Afiliados / Publicidad</option>
                  <option value="Soporte">Soporte Técnico o Descargas</option>
                  <option value="Otro">Otro Asunto</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Mensaje *</label>
                <textarea 
                  required 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detalla tu requerimiento o consulta..."
                  rows={5}
                />
              </div>

              <button type="submit" className="btn-primary">
                Enviar Mensaje <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Canales alternativos */}
        <aside className="contact-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Canales de Atención</h3>
            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-method-info">
                  <h4>Email Directo</h4>
                  <span>contacto@losapuntesdejulius.com</span>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-method-info">
                  <h4>WhatsApp / Teléfono</h4>
                  <span>+51 987 654 321</span>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <MapPin size={18} />
                </div>
                <div className="contact-method-info">
                  <h4>Ubicación PMO</h4>
                  <span>Lima, Perú (Atención remota a toda Latinoamérica)</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-method-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .contact-method-icon {
          width: 36px;
          height: 36px;
          background-color: var(--primary-glow);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-method-info h4 {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 1px;
        }
        .contact-method-info span {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}} />
    </div>
  );
}
