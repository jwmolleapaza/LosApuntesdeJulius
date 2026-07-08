// Página de Servicios - Los Apuntes de Julius
import React from 'react';
import SEOHead from '../components/SEOHead';
import { Calendar, Briefcase, Award, BarChart2, Mail, ArrowRight } from 'lucide-react';

export default function Servicios({ navigateTo }) {
  const serviceList = [
    {
      icon: Briefcase,
      title: 'Consultoría en Control de Proyectos',
      desc: 'Implementación de oficinas de control de proyectos (PMO), auditoría independiente de cronogramas y análisis de retrasos bajo metodologías recomendadas por la AACE.',
      deliverables: ['Informes de auditoría de holgura', 'Establecimiento de metodologías EVM', 'Asesoría contractual']
    },
    {
      icon: Calendar,
      title: 'Elaboración de Cronogramas de Obra',
      desc: 'Desarrollo integral de cronogramas en Primavera P6 o MS Project. Estructuración de WBS, secuencia lógica, análisis de ruta crítica y asignación de recursos / costos.',
      deliverables: ['Archivos fuente .xer o .mpp', 'Líneas base de control de plazos', 'Diccionarios WBS personalizados']
    },
    {
      icon: BarChart2,
      title: 'Automatización de Reportes y Dashboards',
      desc: 'Vinculación de cronogramas de obra con bases de datos en la nube y Excel para emitir informes semanales automáticos con curvas S e indicadores de rendimiento.',
      deliverables: ['Dashboards interactivos en Power BI', 'Plantillas de Curva S automatizadas', 'Sistemas de reporte diario']
    },
    {
      icon: Award,
      title: 'Capacitación Corporativa',
      desc: 'Entrenamientos técnicos in-house y virtuales adaptados a las necesidades reales de tu constructora. Primavera P6, MS Project e Ingeniería de Costos.',
      deliverables: ['Manuales prácticos ilustrados', 'Ejercicios aplicados a obras reales', 'Certificados de participación']
    }
  ];

  return (
    <div className="services-page container py-section">
      <SEOHead 
        title="Nuestros Servicios" 
        description="Ofrecemos consultoría en control de proyectos, elaboración de cronogramas, Power BI y capacitación para empresas de construcción." 
      />

      <div className="nosotros-header text-center">
        <h1>Servicios Profesionales</h1>
        <p className="lead">Soluciones técnicas y especializadas para asegurar el control de plazos y costos en tus proyectos de construcción.</p>
      </div>

      {/* Grid de Servicios */}
      <div className="grid grid-2 mt-4">
        {serviceList.map((srv, idx) => (
          <div key={idx} className="service-detail-card">
            <div className="service-header-row">
              <div className="service-icon-box">
                <srv.icon size={22} />
              </div>
              <h3>{srv.title}</h3>
            </div>
            <p className="service-desc">{srv.desc}</p>
            <div className="service-deliverables">
              <h4>¿Qué entregamos?</h4>
              <ul>
                {srv.deliverables.map((del, dIdx) => (
                  <li key={dIdx}>• {del}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA de Contacto */}
      <section className="services-cta-section mt-4">
        <div className="cta-box-card">
          <h2>¿Necesitas asesoría para tu proyecto u obra?</h2>
          <p>Escríbenos detallando el alcance de tu proyecto y recibe una propuesta técnica formal de servicios.</p>
          <button className="btn-primary" onClick={() => navigateTo('contacto')}>
            Cotizar Servicio <Mail size={16} />
          </button>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .service-detail-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .service-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .service-icon-box {
          width: 44px;
          height: 44px;
          background-color: var(--primary-glow);
          color: var(--primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .service-header-row h3 {
          font-size: 18px;
          font-weight: 800;
        }
        .service-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .service-deliverables h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-light);
          margin-bottom: 8px;
        }
        .service-deliverables ul {
          list-style: none;
          font-size: 13px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* CTA */
        .cta-box-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: var(--radius-lg);
          padding: 40px;
          color: white;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: var(--shadow-md);
        }
        .cta-box-card h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: white;
        }
        .cta-box-card p {
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 20px;
        }
      `}} />
    </div>
  );
}
