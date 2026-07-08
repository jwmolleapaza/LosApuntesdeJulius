// Página Legal (Términos y Condiciones / Política de Privacidad)
import React from 'react';
import SEOHead from '../components/SEOHead';

export default function Legal({ type = 'privacidad' }) {
  const isPrivacy = type === 'privacidad';

  return (
    <div className="legal-page container py-section max-w-700">
      {isPrivacy ? (
        <>
          <SEOHead title="Política de Privacidad" description="Política de privacidad y protección de datos personales de Los Apuntes de Julius." />
          <h1>Política de Privacidad</h1>
          <div className="legal-content">
            <p className="last-updated">Última actualización: 5 de Julio de 2026</p>
            <p>
              En <strong>Los Apuntes de Julius</strong>, valoramos tu privacidad y nos comprometemos a proteger los datos personales que nos proporcionas al registrarte en nuestra newsletter, comprar cursos o unirte a nuestras membresías.
            </p>
            
            <h2>1. Información que Recopilamos</h2>
            <p>
              Recopilamos tu dirección de correo electrónico al suscribirte a nuestro boletín técnico. Si decides adquirir cursos o membresías, recopilamos tu nombre completo, dirección de correo electrónico y datos de facturación indispensables para procesar la transacción.
            </p>

            <h2>2. Uso de la Información</h2>
            <p>
              Utilizamos los datos recopilados para:
            </p>
            <ul>
              <li>Enviar boletines semanales con plantillas Excel, archivos .xer de Primavera P6 y artículos de blog.</li>
              <li>Otorgar acceso a los cursos en línea y administrar las membresías.</li>
              <li>Responder consultas en el formulario de contacto y moderar comentarios en el blog.</li>
            </ul>

            <h2>3. Transferencia a Terceros</h2>
            <p>
              No vendemos ni comercializamos tus datos con terceros. Si utilizas la sincronización con **Airtable**, los datos se almacenan en las bases de datos de Airtable regidas por sus propias políticas de seguridad globales.
            </p>

            <h2>4. Modificaciones y Contacto</h2>
            <p>
              Puedes solicitar la baja de nuestra newsletter o la eliminación total de tus datos en cualquier momento enviándonos un correo a <strong>contacto@losapuntesdejulius.com</strong>.
            </p>
          </div>
        </>
      ) : (
        <>
          <SEOHead title="Términos y Condiciones" description="Términos y condiciones de uso de la plataforma Los Apuntes de Julius." />
          <h1>Términos y Condiciones</h1>
          <div className="legal-content">
            <p className="last-updated">Última actualización: 5 de Julio de 2026</p>
            <p>
              Bienvenido a <strong>Los Apuntes de Julius</strong>. Al acceder y utilizar este sitio web, aceptas cumplir con los siguientes términos y condiciones de uso.
            </p>

            <h2>1. Propiedad Intelectual</h2>
            <p>
              Todo el contenido publicado en este blog, incluyendo artículos, tutoriales, videos, logotipos, código de ejemplo y plantillas de Excel, MS Project o Primavera P6, es de autoría propia de Los Apuntes de Julius. Se concede permiso para descargar plantillas de uso personal y profesional, pero queda prohibida su reventa o redistribución en otros sitios web sin consentimiento.
            </p>

            <h2>2. Limitación de Responsabilidad</h2>
            <p>
              Los apuntes técnicos, guías y plantillas compartidos en este sitio se ofrecen de buena fe con fines educativos y de capacitación. El uso de estos recursos en cronogramas reales y presupuestos contractuales de obra queda bajo responsabilidad exclusiva del usuario. Los Apuntes de Julius no se hace responsable por multas, retrasos o reclamos contractuales resultantes del mal uso de las fórmulas o lógicas explicadas.
            </p>

            <h2>3. Enlaces a Terceros</h2>
            <p>
              Este sitio puede contener enlaces a sitios web de terceros (como canales de YouTube oficiales o herramientas de afiliados). No ejercemos control sobre el contenido de dichos sitios ni asumimos responsabilidad por sus prácticas o políticas.
            </p>

            <h2>4. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República del Perú y cualquier disputa se resolverá ante los tribunales competentes de la ciudad de Lima.
            </p>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .max-w-700 {
          max-width: 720px;
          margin: 0 auto;
        }
        .legal-page h1 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          border-bottom: 2px solid var(--border);
          padding-bottom: 12px;
        }
        .last-updated {
          font-size: 13px;
          color: var(--text-light);
          margin-bottom: 24px;
          font-style: italic;
        }
        .legal-content h2 {
          font-size: 20px;
          font-weight: 700;
          margin-top: 28px;
          margin-bottom: 10px;
        }
        .legal-content p {
          font-size: 15px;
          color: var(--text-muted);
          margin-bottom: 16px;
          line-height: 1.6;
        }
        .legal-content ul {
          padding-left: 20px;
          margin-bottom: 16px;
          font-size: 15px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}} />
    </div>
  );
}
