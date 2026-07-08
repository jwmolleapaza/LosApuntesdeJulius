// Página de Cursos - Los Apuntes de Julius
import React, { useState } from 'react';
import { dbService } from '../services/db';
import SEOHead from '../components/SEOHead';
import { Clock, BookOpen, User, Star, Award, CheckCircle, X } from 'lucide-react';

export default function Cursos() {
  const courses = dbService.getCourses();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail) return;

    // Registrar en logs del sistema la compra simulada
    const config = dbService.getConfig();
    dbService.addSubscriber(checkoutEmail); // Auto-agregar a la newsletter al comprar
    
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setSelectedCourse(null);
      setCheckoutName('');
      setCheckoutEmail('');
    }, 4000);
  };

  const handleCoursePurchase = (course) => {
    if (course.link && (course.link.startsWith('http://') || course.link.startsWith('https://'))) {
      window.open(course.link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <div className="courses-page container py-section">
      <SEOHead 
        title="Cursos Online" 
        description="Aprende planificación de obras, control de proyectos, Primavera P6 y MS Project con nuestros entrenamientos guiados." 
      />

      <div className="blog-title-header text-center">
        <h1>Cursos Técnicos Especializados</h1>
        <p className="lead">Capacitaciones prácticas en video con soporte de consultas, talleres de aplicación y certificados de participación.</p>
      </div>

      <div className="grid grid-2 mt-4">
        {courses.map(course => (
          <div key={course.id} className="course-card-detail">
            <div className="course-img-box">
              <img src={course.image} alt={course.title} />
              <div className="course-badge-level">{course.level}</div>
            </div>
            <div className="course-body-box">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              
              <div className="course-details-row">
                <div className="course-detail-item">
                  <Clock size={16} />
                  <span>Duración: {course.duration}</span>
                </div>
                <div className="course-detail-item">
                  <BookOpen size={16} />
                  <span>Acceso de por vida</span>
                </div>
                <div className="course-detail-item">
                  <Award size={16} />
                  <span>Certificación incluida</span>
                </div>
              </div>

              <div className="course-price-action">
                <div className="price-tag-wrapper">
                  <span className="price-label">Pago Único</span>
                  <span className="price-amount">${course.price} USD</span>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => handleCoursePurchase(course)}
                >
                  Adquirir Curso
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Pago / Inscripción Simulado */}
      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Inscripción: {selectedCourse.title}</h3>
              <button className="btn-icon" onClick={() => setSelectedCourse(null)} disabled={checkoutSuccess}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {checkoutSuccess ? (
                <div className="checkout-success-body">
                  <CheckCircle size={48} color="#10b981" />
                  <h4>¡Inscripción Registrada!</h4>
                  <p>Hemos enviado un correo de bienvenida a <strong>{checkoutEmail}</strong> con las credenciales de acceso a la plataforma de aprendizaje virtual.</p>
                  <span>Cerrando ventana...</span>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="comment-form-grid">
                  <div className="checkout-product-preview">
                    <span>Producto:</span>
                    <strong>{selectedCourse.title}</strong>
                    <span className="price-highlight">${selectedCourse.price} USD</span>
                  </div>
                  <div className="admin-form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      required 
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      placeholder="Ing. Carlos Soto"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Correo Electrónico</label>
                    <input 
                      type="email" 
                      required 
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      placeholder="carlos.soto@email.com"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Confirmar Inscripción (Simulado)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .course-card-detail {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        .course-img-box {
          position: relative;
          height: 200px;
        }
        .course-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .course-badge-level {
          position: absolute;
          top: 16px;
          right: 16px;
          background-color: var(--primary);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .course-body-box {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .course-body-box h2 {
          font-size: 20px;
          font-weight: 800;
        }
        .course-body-box p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .course-details-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 12px 0;
        }
        .course-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .course-price-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price-tag-wrapper {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .price-label {
          font-size: 10px;
          color: var(--text-light);
          text-transform: uppercase;
        }
        .price-amount {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
        }
        .checkout-success-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          padding: 20px 0;
        }
        .checkout-success-body h4 {
          font-size: 18px;
          font-weight: 800;
        }
        .checkout-success-body p {
          font-size: 14px;
          color: var(--text-muted);
        }
        .checkout-success-body span {
          font-size: 11px;
          color: var(--text-light);
          margin-top: 12px;
        }
        .checkout-product-preview {
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .price-highlight {
          font-weight: 800;
          color: var(--primary);
        }
      `}} />
    </div>
  );
}
