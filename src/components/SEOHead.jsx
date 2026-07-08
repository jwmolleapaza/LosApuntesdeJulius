// Componente para inyectar dinámicamente Meta-etiquetas de SEO, Open Graph y Schema.org JSON-LD
import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, slug, image, type = 'article', articleData = null }) {
  useEffect(() => {
    // 1. Título de la página
    const fullTitle = title ? `${title} | Los Apuntes de Julius` : 'Los Apuntes de Julius | Blog de Ingeniería y Construcción';
    document.title = fullTitle;

    // Helper para actualizar o crear metaetiquetas
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // Helper para canonical link
    const currentUrl = slug ? `${window.location.origin}/blog/${slug}` : window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 2. Metas estándar
    setMetaTag('name', 'description', description || 'Apuntes técnicos y prácticos sobre planificación de obras, Primavera P6, MS Project y lecciones aprendidas.');
    setMetaTag('name', 'keywords', keywords || 'ingeniería civil, planeamiento, control de proyectos, construcción, Primavera P6, MS Project');
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Open Graph (Facebook / LinkedIn)
    setMetaTag('property', 'og:title', title || 'Los Apuntes de Julius');
    setMetaTag('property', 'og:description', description || 'Apuntes técnicos y prácticos sobre planificación de obras.');
    setMetaTag('property', 'og:image', image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80');
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Los Apuntes de Julius');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title || 'Los Apuntes de Julius');
    setMetaTag('name', 'twitter:description', description || 'Apuntes técnicos y prácticos sobre planificación.');
    setMetaTag('name', 'twitter:image', image);

    // 5. Datos Estructurados (Schema.org) JSON-LD
    let scriptJsonLd = document.getElementById('jsonld-structured-data');
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.id = 'jsonld-structured-data';
      scriptJsonLd.type = 'application/ld+json';
      document.head.appendChild(scriptJsonLd);
    }

    let schemaData = {};

    if (type === 'article' && articleData) {
      // Marcado estructurado para Artículos de Blog
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'image': image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        'datePublished': articleData.date,
        'dateModified': articleData.date,
        'author': {
          '@type': 'Person',
          'name': articleData.author || 'Julius'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Los Apuntes de Julius',
          'logo': {
            '@type': 'ImageObject',
            'url': `${window.location.origin}/logo.png`
          }
        },
        'description': description
      };
    } else {
      // Marcado estructurado por defecto (WebSite / Breadcrumbs)
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Los Apuntes de Julius',
        'url': window.location.origin,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${window.location.origin}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
    }

    scriptJsonLd.text = JSON.stringify(schemaData);

    // Limpieza al desmontar
    return () => {
      // Mantenemos meta etiquetas generales, pero podemos reiniciar el título
    };
  }, [title, description, keywords, slug, image, type, articleData]);

  return null; // Este componente no renderiza nada en la interfaz
}
