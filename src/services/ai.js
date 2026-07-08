// Asistente de Inteligencia Artificial para "Los Apuntes de Julius"
// Simula o se conecta a un LLM para automatizar la creación y optimización de contenido

const SIMULATED_DRAFTS = {
  'WBS': `### Estructura de Desglose del Trabajo (WBS) en Edificaciones

La WBS es el pilar de toda planificación de construcción. Consiste en dividir el proyecto completo en entregables manejables.

#### Niveles recomendados:
1. **Nivel 1: Nombre del Proyecto** (ej. Edificio Multifamiliar San Isidro).
2. **Nivel 2: Fases principales** (Estudios, Construcción, Acabados, Entrega).
3. **Nivel 3: Paquetes de trabajo** (Movimiento de tierras, Estructura de concreto, etc.).

#### Consejos prácticos:
- No confundas actividades con entregables. Un bloque de la WBS es un sustantivo, no un verbo.
- Aplica la regla del 100%: el nivel jerárquico inferior debe representar exactamente el 100% de la suma del nivel superior.`,
  
  'Ruta Crítica': `### Cómo Gestionar y Optimizar la Ruta Crítica de un Cronograma

La Ruta Crítica (CPM - Critical Path Method) representa la secuencia de actividades vinculadas que determinan la duración total del proyecto.

#### Estrategias de reducción de plazos (Crashing y Fast-Tracking):
* **Fast-Tracking (Vías Rápidas):** Consiste en realizar actividades en paralelo que originalmente se planificaron en secuencia. *Ejemplo: Iniciar el diseño de tabiquería antes de concluir la estructura del piso superior.*
* **Crashing (Compresión):** Agregar recursos adicionales a las actividades críticas para reducir su duración. Esto típicamente incrementa el costo del proyecto.

#### Reglas de oro:
1. Controla diariamente las actividades con holgura menor a 5 días.
2. No te confíes de las actividades no críticas; si se retrasan más de su holgura, pasarán a ser críticas.`,

  'Predeterminado': `### Nuevo Artículo Técnico de Ingeniería

Escribe aquí la introducción al artículo. Este borrador ha sido generado por el asistente de IA para ayudarte a estructurar tus ideas.

#### Sección 1: Marco Teórico
Detalla los conceptos básicos de este tema de construcción o gestión de proyectos. Utiliza tablas para comparar datos y listas para los requerimientos.

#### Sección 2: Aplicación en Obra
Explica cómo llevar esta teoría a la práctica en el campo (obra de ingeniería civil). Comparte lecciones aprendidas y errores comunes a evitar.

#### Sección 3: Conclusiones
Resume las ideas clave y proporciona recomendaciones útiles para la supervisión y control del proyecto.`
};

export const aiService = {
  // Generar borrador completo
  async generateDraft(title, category) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Latencia realista
    
    let content = SIMULATED_DRAFTS.Predeterminado;
    if (title.toUpperCase().includes('WBS') || title.toUpperCase().includes('ESTRUCTURA')) {
      content = SIMULATED_DRAFTS.WBS;
    } else if (title.toUpperCase().includes('CRÍTICA') || title.toUpperCase().includes('RUTA') || title.toUpperCase().includes('CRONOGRAMA')) {
      content = SIMULATED_DRAFTS['Ruta Crítica'];
    }

    return {
      title: `Guía Completa: ${title}`,
      summary: `Un análisis detallado sobre ${title} aplicado a la gestión de proyectos de construcción y control de obras.`,
      content: content,
      tags: [category || 'Ingeniería', 'Gestión de Proyectos', 'Productividad'],
      difficulty: 'Intermedio'
    };
  },

  // Corregir gramática y ortografía
  async correctGrammar(text) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simula correcciones simples si existieran errores comunes
    let corrected = text;
    corrected = corrected.replace(/\bconcreto armado\b/gi, 'concreto armado');
    corrected = corrected.replace(/\bobra de ingeneria\b/gi, 'obra de ingeniería');
    corrected = corrected.replace(/\bprimavera p6\b/g, 'Primavera P6');
    corrected = corrected.replace(/\bms project\b/g, 'MS Project');
    return corrected;
  },

  // Mejorar redacción y estilo
  async improveStyle(text) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `[Versión Mejorada por IA] ${text} (Reescrito para mayor claridad técnica y ejecutiva, empleando vocabulario estándar PMI y de ingeniería de construcción).`;
  },

  // Generar títulos atractivos
  async generateTitles(keywords) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      `10 Errores al Planificar ${keywords} que Detendrán tu Obra`,
      `Guía Definitiva de ${keywords} para Ingenieros de Campo`,
      `Cómo Optimizar ${keywords} Usando Métodos Avanzados de Control de Proyectos`,
      `Casos de Éxito: Gestión de ${keywords} en Grandes Proyectos de Infraestructura`
    ];
  },

  // Optimizar SEO
  async optimizeSEO(title, content) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const keywords = title.split(' ').filter(w => w.length > 5).join(', ');
    return {
      metaTitle: `${title} | Los Apuntes de Julius`,
      metaDescription: `Descubre todo lo necesario sobre ${title}. Incluye guías prácticas de ingeniería civil, lecciones aprendidas y control de plazos.`,
      keywords: `${keywords}, construcción, control de proyectos, ingeniería civil`
    };
  },

  // Generar resumen ejecutivo
  async generateSummary(content) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return `Resumen Ejecutivo: Este artículo aborda los conceptos clave, metodologías prácticas y lecciones aprendidas de control de plazos y ejecución técnica en ingeniería, brindando pautas para directores y supervisores de obra.`;
  },

  // Sugerir etiquetas
  async suggestTags(content) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const tags = ['Ingeniería Civil', 'Planificación', 'Control de Proyectos', 'Construcción', 'Productividad'];
    return tags.slice(0, 3 + Math.floor(Math.random() * 3));
  },

  // Generar FAQs
  async generateFAQs(title, content) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        q: '¿Cuál es el objetivo principal de este tema?',
        a: 'Establecer una metodología clara para planificar, ejecutar y supervisar las actividades en obra, garantizando plazos y calidad.'
      },
      {
        q: '¿Qué herramientas se recomiendan utilizar?',
        a: 'Para este fin, herramientas como Primavera P6, MS Project o plantillas automatizadas en Excel son de gran utilidad.'
      },
      {
        q: '¿Cómo afecta este factor al presupuesto del proyecto?',
        a: 'Un control inadecuado genera trabajos de reparación y retrasos en la ruta crítica, lo que eleva el costo directo y los gastos generales.'
      }
    ];
  }
};
