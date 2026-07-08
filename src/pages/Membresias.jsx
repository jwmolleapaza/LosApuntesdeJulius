// Página de Membresías - Los Apuntes de Julius
import React, { useState } from 'react';
import { dbService } from '../services/db';
import SEOHead from '../components/SEOHead';
import { Check, X, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Membresias() {
  const memberships = dbService.getMemberships();
  const [selectedMem, setSelectedMem] = useState(null);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    dbService.addSubscriber(email); // Registrar en la newsletter
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedMem(null);
      setEmail('');
    }, 4000);
  };

  return (
    <div className="memberships-page container py-section">
      <SEOHead 
        title="Membresías" 
        description="Únete a la membresía de Los Apuntes de Julius y descarga plantillas ilimitadas, accede a webinars y artículos técnicos premium." 
      />

      <div className="blog-title-header text-center">
        <h1>Nuestros Planes de Membresía</h1>
        <p className="lead">Únete a nuestra comunidad exclusiva y acelera tu aprendizaje con recursos avanzados e ilimitados de control de proyectos.</p>
      </div>

      <div className="grid grid-2 mt-4 max-w-700">
        {memberships.map(mem => (
          <div key={mem.id} className={`membership-card ${mem.popular ? 'popular' : ''}`}>
            {mem.popular && <span className="popular-badge">Recomendado</span>}
            
            <div className="membership-header">
              <h3>{mem.name}</h3>
              <div className="price-box">
                <span className="price-currency">$</span>
                <span className="price-val">{mem.price}</span>
                <span className="price-period">/ {mem.period}</span>
              </div>
            </div>

            <ul className="membership-features-list">
              {mem.features.map((feat, fIdx) => (
                <li key={fIdx}>
                  <Check size={16} className="check-icon" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`btn-membership w-full ${mem.popular ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedMem(mem)}
            >
              {mem.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de checkout simulado */}
      {selectedMem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Suscripción: {selectedMem.name}</h3>
              <button className="btn-icon" onClick={() => setSelectedMem(null)} disabled={success}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {success ? (
                <div className="checkout-success-body">
                  <ShieldCheck size={48} color="#10b981" />
                  <h4>¡Bienvenido a la Comunidad!</h4>
                  <p>Tu suscripción al plan <strong>{selectedMem.name}</strong> ha sido activada con éxito. Hemos enviado un correo con tus accesos a <strong>{email}</strong>.</p>
                  <span>Cerrando ventana...</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="comment-form-grid">
                  <div className="checkout-product-preview">
                    <span>Plan:</span>
                    <strong>{selectedMem.name}</strong>
                    <span className="price-highlight">${selectedMem.price} USD / {selectedMem.period}</span>
                  </div>
                  <div className="admin-form-group">
                    <label>Correo Electrónico de Registro</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ingeniero@empresa.com"
                    />
                  </div>
                  <p className="checkout-note">Nota: Este proceso es un demo interactivo de suscripción. No se realizará ningún cargo real a tu tarjeta.</p>
                  <button type="submit" className="btn-primary w-full">
                    Confirmar Suscripción
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .max-w-700 {
          max-width: 700px;
          margin: 0 auto;
        }
        .membership-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .membership-card.popular {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--primary);
          color: white;
          font-size: 10px;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-weight: 700;
          text-transform: uppercase;
        }
        .membership-header {
          text-align: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
        }
        .membership-header h3 {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .price-box {
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        .price-currency {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .price-val {
          font-size: 42px;
          font-weight: 800;
          color: var(--text-main);
        }
        .price-period {
          font-size: 14px;
          color: var(--text-light);
          margin-left: 4px;
        }
        .membership-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        .membership-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: var(--text-muted);
        }
        .check-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .btn-membership {
          padding: 12px;
          font-weight: 700;
        }
        .checkout-note {
          font-size: 11px;
          color: var(--text-light);
          text-align: center;
          font-style: italic;
        }
      `}} />
    </div>
  );
}
