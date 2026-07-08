// Utilidades varias para "Los Apuntes de Julius"

// Generar slugs amigables a partir de un texto para URLs limpias
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Reemplaza espacios con guiones
    .replace(/[^\w\-]+/g, '')       // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, '-')         // Reemplaza múltiples guiones con uno solo
    .replace(/^-+/, '')             // Elimina guiones iniciales
    .replace(/-+$/, '');            // Elimina guiones finales
};

// Estimar el tiempo de lectura basándose en el contenido de los bloques
export const estimateReadTime = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return 1;
  
  let wordCount = 0;
  blocks.forEach(block => {
    if (block.content) {
      wordCount += block.content.split(/\s+/).length;
    }
    if (block.items && Array.isArray(block.items)) {
      block.items.forEach(item => {
        wordCount += item.split(/\s+/).length;
      });
    }
    if (block.rows && Array.isArray(block.rows)) {
      block.rows.forEach(row => {
        row.forEach(cell => {
          wordCount += cell.toString().split(/\s+/).length;
        });
      });
    }
  });

  const wordsPerMinute = 200; // Velocidad promedio de lectura
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes > 0 ? minutes : 1;
};

// Formatear fechas en español de forma amigable (ej: "1 de Julio, 2026")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

// Generar contenido dinámico del XML Sitemap para SEO
export const generateSitemap = (articles) => {
  const baseUrl = window.location.origin;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Páginas principales
  const pages = ['', 'blog', 'categorias', 'nosotros', 'servicios', 'recursos', 'cursos', 'membresias', 'contacto'];
  pages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${p}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Artículos de blog
  articles.forEach(art => {
    if (art.status === 'publicado') {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${art.slug}</loc>\n`;
      xml += `    <lastmod>${art.date}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>`;
  return xml;
};

// Generar contenido del robots.txt
export const generateRobotsTxt = () => {
  const baseUrl = window.location.origin;
  return `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
};

// Descargar un archivo generado en caliente en el navegador
export const triggerDownload = (filename, content, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
