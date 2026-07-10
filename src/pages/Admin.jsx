// Panel de Administración (CMS) completo con control de accesos, gestión de bloques e IA integrada
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { aiService } from '../services/ai';
import { slugify, estimateReadTime, generateSitemap, generateRobotsTxt, triggerDownload } from '../services/utils';
import BlockEditor from '../components/BlockEditor';
import { 
  Lock, LayoutDashboard, FileText, FolderPlus, DownloadCloud, 
  BookOpen, Award, MessageSquare, Mail, Settings, ShieldAlert,
  Database, Plus, Trash2, Edit3, Sparkles, Check, RefreshCw, LogOut, CheckCircle, FileCode, X
} from 'lucide-react';

export default function Admin({ navigateTo }) {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('admin_auth') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados del Panel
  const [activeTab, setActiveTab] = useState('stats');
  
  // Datos locales reactivos
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [config, setConfig] = useState({});
  const [logs, setLogs] = useState([]);

  // Estados de Edición de Artículos
  const [editingArticle, setEditingArticle] = useState(null); // null = lista, object = editar/crear
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [articleDifficulty, setArticleDifficulty] = useState('Intermedio');
  const [articleStatus, setArticleStatus] = useState('borrador');
  const [articleImage, setArticleImage] = useState('');
  const [articleTags, setArticleTags] = useState('');
  const [articleBlocks, setArticleBlocks] = useState([]);

  // Estados de IA Asistente
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Estados de Sincronización
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Campaña Newsletter
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);

  // Modales Simples de Creación
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showResModal, setShowResModal] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResSize, setNewResSize] = useState('1.5 MB');
  const [newResType, setNewResType] = useState('Excel (XLSX)');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResOrder, setNewResOrder] = useState(1);
  const [newResClass, setNewResClass] = useState('descargable');
  const [localFileContent, setLocalFileContent] = useState('');
  const [localFileName, setLocalFileName] = useState('');

  // Modales y Estados de Cursos
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [coursePrice, setCoursePrice] = useState(49.99);
  const [courseImage, setCourseImage] = useState('');
  const [courseDuration, setCourseDuration] = useState('12 horas');
  const [courseLevel, setCourseLevel] = useState('Intermedio');
  const [courseLink, setCourseLink] = useState('');
  const [syncingExternal, setSyncingExternal] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  // Estados de Sincronización de Noticias
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncSource, setSyncSource] = useState('rumbominero');
  const [syncUrl, setSyncUrl] = useState('https://www.rumbominero.com/category/peru/noticias/mineria/');
  const [syncNewsLoading, setSyncNewsLoading] = useState(false);
  const [syncNewsError, setSyncNewsError] = useState('');
  const [syncNewsSuccess, setSyncNewsSuccess] = useState('');

  // Cargar datos al iniciar
  useEffect(() => {
    if (isLoggedIn) {
      refreshAllData();
    }
  }, [isLoggedIn]);

  const refreshAllData = () => {
    setArticles(dbService.getArticles());
    setCategories(dbService.getCategories());
    setResources(dbService.getResources());
    setCourses(dbService.getCourses());
    setMemberships(dbService.getMemberships());
    setComments(dbService.getComments());
    setSubscribers(dbService.getSubscribers());
    setConfig(dbService.getConfig());
    setLogs(dbService.getLogs());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'julius123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. (Pista: admin / julius123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
  };

  // Guardar Artículo (Creado o Editado)
  const handleSaveArticle = () => {
    if (!articleTitle) {
      alert('El título es requerido');
      return;
    }

    const tagsArray = articleTags.split(',').map(t => t.trim()).filter(Boolean);
    const readTimeVal = estimateReadTime(articleBlocks);

    const saved = dbService.saveArticle({
      id: editingArticle.id || null,
      title: articleTitle,
      slug: editingArticle.slug || slugify(articleTitle),
      summary: articleSummary,
      category: articleCategory || (categories[0] ? categories[0].name : 'Ingeniería'),
      tags: tagsArray,
      difficulty: articleDifficulty,
      status: articleStatus,
      image: articleImage || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      readTime: readTimeVal,
      blocks: articleBlocks,
      author: editingArticle.author || 'Julius',
      date: editingArticle.date || new Date().toISOString().split('T')[0]
    });

    setEditingArticle(null);
    refreshAllData();
  };

  // Abrir Formulario Nuevo Artículo
  const handleNewArticle = () => {
    setEditingArticle({});
    setArticleTitle('');
    setArticleSummary('');
    setArticleCategory(categories[0] ? categories[0].name : '');
    setArticleDifficulty('Intermedio');
    setArticleStatus('borrador');
    setArticleImage('');
    setArticleTags('Planeamiento, Construcción');
    setArticleBlocks([
      { id: 'b-init-1', type: 'title-h1', content: 'Nuevo Título Principal' },
      { id: 'b-init-2', type: 'paragraph', content: 'Escribe tu párrafo técnico aquí...' }
    ]);
  };

  // Abrir Formulario Editar Artículo
  const handleEditArticle = (art) => {
    setEditingArticle(art);
    setArticleTitle(art.title);
    setArticleSummary(art.summary);
    setArticleCategory(art.category);
    setArticleDifficulty(art.difficulty);
    setArticleStatus(art.status);
    setArticleImage(art.image);
    setArticleTags(art.tags.join(', '));
    setArticleBlocks(art.blocks || []);
  };

  // Eliminar Artículo
  const handleDeleteArticle = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      dbService.deleteArticle(id);
      refreshAllData();
    }
  };

  // Moderar Comentario
  const handleCommentStatus = (id, status) => {
    dbService.updateCommentStatus(id, status);
    refreshAllData();
  };

  // Eliminar Comentario
  const handleDeleteComment = (id) => {
    if (window.confirm('¿Deseas eliminar este comentario?')) {
      dbService.deleteComment(id);
      refreshAllData();
    }
  };

  // Guardar Categoría
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    dbService.saveCategory({
      name: newCatName,
      slug: slugify(newCatName)
    });
    setNewCatName('');
    setShowCatModal(false);
    refreshAllData();
  };

  // Eliminar Categoría
  const handleDeleteCategory = (id) => {
    if (window.confirm('¿Deseas eliminar esta categoría?')) {
      dbService.deleteCategory(id);
      refreshAllData();
    }
  };

  // Maniobrar subida de archivo para Recursos
  const handleResourceFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalFileContent(event.target.result);
      setLocalFileName(file.name);
      
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setNewResSize(`${sizeMB} MB`);

      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        setNewResType('Excel (XLSX)');
      } else if (ext === 'pdf') {
        setNewResType('PDF');
      } else if (ext === 'mpp') {
        setNewResType('MS Project (MPP)');
      } else {
        setNewResType('ZIP (Excel/P6)');
      }
    };
    reader.readAsDataURL(file);
  };

  // Maniobrar subida de imagen para Artículos con compresión Canvas
  const handleArticleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setArticleImage(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Guardar o Editar Recurso
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!newResTitle) return;

    dbService.saveResource({
      id: editingResourceId,
      title: newResTitle,
      description: newResDesc,
      fileSize: newResSize,
      fileType: newResType,
      resourceType: newResClass,
      url: newResUrl,
      order: parseInt(newResOrder) || 1,
      localFileContent: localFileContent,
      localFileName: localFileName
    });

    setEditingResourceId(null);
    setNewResTitle('');
    setNewResDesc('');
    setNewResSize('1.5 MB');
    setNewResType('Excel (XLSX)');
    setNewResUrl('');
    setNewResOrder(1);
    setNewResClass('descargable');
    setLocalFileContent('');
    setLocalFileName('');
    setShowResModal(false);
    refreshAllData();
  };

  const handleEditResourceClick = (res) => {
    setEditingResourceId(res.id);
    setNewResTitle(res.title);
    setNewResDesc(res.description);
    setNewResSize(res.fileSize || '1.5 MB');
    setNewResType(res.fileType || 'Excel (XLSX)');
    setNewResUrl(res.url || '');
    setNewResOrder(res.order || 1);
    setNewResClass(res.resourceType || 'descargable');
    setLocalFileContent(res.localFileContent || '');
    setLocalFileName(res.localFileName || '');
    setShowResModal(true);
  };

  // Eliminar Recurso
  const handleDeleteResource = (id) => {
    if (window.confirm('¿Deseas eliminar este recurso?')) {
      dbService.deleteResource(id);
      refreshAllData();
    }
  };

  // Guardar o Editar Curso
  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseTitle) return;

    dbService.saveCourse({
      id: editingCourseId,
      title: courseTitle,
      description: courseDesc,
      price: parseFloat(coursePrice) || 0,
      image: courseImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      duration: courseDuration,
      level: courseLevel,
      link: courseLink
    });

    setEditingCourseId(null);
    setCourseTitle('');
    setCourseDesc('');
    setCoursePrice(49.99);
    setCourseImage('');
    setCourseDuration('12 horas');
    setCourseLevel('Intermedio');
    setCourseLink('');
    setShowCourseModal(false);
    refreshAllData();
  };

  const handleEditCourseClick = (course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseDesc(course.description);
    setCoursePrice(course.price);
    setCourseImage(course.image);
    setCourseDuration(course.duration);
    setCourseLevel(course.level);
    setCourseLink(course.link || '');
    setShowCourseModal(true);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('¿Deseas eliminar este curso?')) {
      dbService.deleteCourse(id);
      refreshAllData();
    }
  };

  const handleSyncCourseData = async () => {
    if (!courseLink) return;
    setSyncingExternal(true);
    setSyncError('');
    setSyncSuccessMsg('');
    try {
      const data = await dbService.fetchExternalCourseDetails(courseLink);
      setCourseTitle(data.title);
      setCourseDesc(data.description);
      setCoursePrice(data.price);
      setCourseImage(data.image);
      setCourseDuration(data.duration);
      setCourseLevel(data.level);
      setSyncSuccessMsg(`¡Información y precio sincronizados! Precio actual: $${data.price} USD (Antes: $${data.originalPrice} USD).`);
    } catch (err) {
      setSyncError(err.message || 'Error al intentar conectar con la plataforma original.');
    } finally {
      setSyncingExternal(false);
    }
  };

  const handleSyncNews = async (e) => {
    e.preventDefault();
    if (!syncUrl) return;
    setSyncNewsLoading(true);
    setSyncNewsError('');
    setSyncNewsSuccess('');
    try {
      const res = await dbService.syncNewsFromUrl(syncUrl);
      setSyncNewsSuccess(res.message);
      refreshAllData();
    } catch (err) {
      setSyncNewsError(err.message || 'Error durante la sincronización.');
    } finally {
      setSyncNewsLoading(false);
    }
  };

  // Enviar Campaña Newsletter
  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!campaignSubject || !campaignBody) return;

    setCampaignLoading(true);
    // Simular envío de correos
    setTimeout(() => {
      setCampaignLoading(false);
      setCampaignSuccess(true);
      setCampaignSubject('');
      setCampaignBody('');
      setTimeout(() => setCampaignSuccess(false), 3000);
    }, 2000);
  };

  // IA - Generar Borrador Completo
  const handleAiDraft = async () => {
    if (!articleTitle) {
      alert('Por favor ingresa un título para guiar a la IA');
      return;
    }
    setAiLoading(true);
    setAiOutput('Pensando...');
    try {
      const draft = await aiService.generateDraft(articleTitle, articleCategory);
      setArticleSummary(draft.summary);
      setArticleBlocks([
        { id: 'ai-h1', type: 'title-h1', content: draft.title },
        { id: 'ai-p', type: 'paragraph', content: draft.content }
      ]);
      setArticleTags(draft.tags.join(', '));
      setAiOutput('¡Borrador generado y aplicado al editor con éxito!');
    } catch (e) {
      setAiOutput('Error al generar borrador');
    } finally {
      setAiLoading(false);
    }
  };

  // IA - Corregir Gramática en Editor
  const handleAiGrammar = async () => {
    if (articleBlocks.length === 0) return;
    setAiLoading(true);
    try {
      const newBlocks = await Promise.all(
        articleBlocks.map(async b => {
          if (b.type === 'paragraph' || b.type === 'quote') {
            const corrected = await aiService.correctGrammar(b.content);
            return { ...b, content: corrected };
          }
          return b;
        })
      );
      setArticleBlocks(newBlocks);
      setAiOutput('Ortografía y gramática corregidas en los párrafos.');
    } catch (e) {
      setAiOutput('Error al corregir texto.');
    } finally {
      setAiLoading(false);
    }
  };

  // IA - Sugerir Títulos
  const handleAiTitles = async () => {
    if (!articleTitle) return;
    setAiLoading(true);
    try {
      const suggestions = await aiService.generateTitles(articleTitle);
      setAiOutput(`Sugerencias de Títulos:\n\n${suggestions.join('\n')}`);
    } catch (e) {
      setAiOutput('Error al sugerir títulos.');
    } finally {
      setAiLoading(false);
    }
  };

  // IA - Optimizar SEO
  const handleAiSEO = async () => {
    if (!articleTitle) return;
    setAiLoading(true);
    try {
      const seo = await aiService.optimizeSEO(articleTitle, articleSummary);
      setAiOutput(`Metadatos SEO Recomendados:\n\nMeta Título:\n${seo.metaTitle}\n\nMeta Descripción:\n${seo.metaDescription}\n\nKeywords:\n${seo.keywords}`);
    } catch (e) {
      setAiOutput('Error al optimizar SEO.');
    } finally {
      setAiLoading(false);
    }
  };

  // Sincronizar Airtable
  const handleAirtableSync = async () => {
    setSyncLoading(true);
    setSyncMsg('Sincronizando...');
    try {
      const res = await dbService.syncToAirtable();
      if (res.success) {
        setSyncMsg(`Éxito: ${res.count} artículos sincronizados.`);
      } else {
        setSyncMsg(`Fallo: ${res.error}`);
      }
    } catch (e) {
      setSyncMsg(`Fallo: ${e.message}`);
    } finally {
      setSyncLoading(false);
      setTimeout(() => setSyncMsg(''), 4000);
    }
  };

  // Configuración de Airtable
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    dbService.saveConfig(config);
    
    if (config.airtableActive) {
      if (!config.airtableApiKey || !config.airtableBaseId) {
        alert('Por favor, completa el Token y el Base ID de Airtable.');
        return;
      }
      
      try {
        // Hacemos una llamada de prueba rápida
        const response = await fetch(`https://api.airtable.com/v0/${config.airtableBaseId}/Articulos?maxRecords=1`, {
          headers: {
            'Authorization': `Bearer ${config.airtableApiKey}`
          }
        });
        
        if (response.ok) {
          alert('¡Credenciales guardadas y conexión con Airtable establecida con éxito en la nube!');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(`Credenciales guardadas localmente, pero Airtable devolvió un error: ${errData.error?.message || response.statusText}`);
        }
      } catch (err) {
        alert(`Credenciales guardadas localmente, pero falló la conexión con Airtable: ${err.message}`);
      }
    } else {
      alert('Configuración guardada con éxito.');
    }
    
    refreshAllData();
  };

  // Generadores Sitemap / Robots
  const handleDownloadSitemap = () => {
    const sitemapContent = generateSitemap(articles);
    triggerDownload('sitemap.xml', sitemapContent, 'text/xml');
  };

  const handleDownloadRobots = () => {
    const robotsContent = generateRobotsTxt();
    triggerDownload('robots.txt', robotsContent, 'text/plain');
  };

  const handleExportBackup = () => {
    const backupContent = dbService.exportBackup();
    triggerDownload(`julius-db-backup-${Date.now()}.json`, backupContent, 'application/json');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = dbService.importBackup(event.target.result);
      if (res.success) {
        alert('Copia de seguridad restaurada exitosamente.');
        refreshAllData();
      } else {
        alert(`Error al restaurar: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  // PANTALLA LOGIN
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="text-center mb-4">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{margin:'0 auto'}}>
              <rect width="100" height="100" rx="16" fill="var(--primary)" />
              <path d="M25 75V25H37L50 50L63 25H75V75H63V45L50 70L37 45V75H25Z" fill="white" />
            </svg>
            <h2 className="mt-4">Acceso Administrativo</h2>
            <p className="text-muted" style={{fontSize:13}}>Los Apuntes de Julius CMS</p>
          </div>

          <form onSubmit={handleLogin} className="comment-form-grid">
            {loginError && (
              <div className="newsletter-error mb-4" style={{padding:'8px 12px', background:'rgba(239,68,68,0.1)', borderRadius:6}}>
                <ShieldAlert size={16} />
                <span>{loginError}</span>
              </div>
            )}
            <div className="admin-form-group">
              <label>Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Iniciar Sesión <Lock size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // PANTALLA CMS PRINCIPAL
  return (
    <div className="admin-layout">
      
      {/* Sidebar de Navegación del CMS */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Julius PMO Panel</div>
        
        <button className={`admin-menu-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => {setActiveTab('stats'); setEditingArticle(null);}}>
          <LayoutDashboard size={16} /> Estadísticas
        </button>
        <button className={`admin-menu-item ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>
          <FileText size={16} /> Artículos
        </button>
        <button className={`admin-menu-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => {setActiveTab('categories'); setEditingArticle(null);}}>
          <FolderPlus size={16} /> Categorías
        </button>
        <button className={`admin-menu-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => {setActiveTab('resources'); setEditingArticle(null);}}>
          <DownloadCloud size={16} /> Recursos
        </button>
        <button className={`admin-menu-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => {setActiveTab('courses'); setEditingArticle(null);}}>
          <BookOpen size={16} /> Cursos
        </button>
        <button className={`admin-menu-item ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => {setActiveTab('comments'); setEditingArticle(null);}}>
          <MessageSquare size={16} /> Comentarios
        </button>
        <button className={`admin-menu-item ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => {setActiveTab('subscribers'); setEditingArticle(null);}}>
          <Mail size={16} /> Boletín / Newsletter
        </button>
        <button className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => {setActiveTab('settings'); setEditingArticle(null);}}>
          <Settings size={16} /> Ajustes e Integraciones
        </button>
        <button className={`admin-menu-item ${activeTab === 'backups' ? 'active' : ''}`} onClick={() => {setActiveTab('backups'); setEditingArticle(null);}}>
          <Database size={16} /> Copias y SEO
        </button>
        <button className={`admin-menu-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => {setActiveTab('logs'); setEditingArticle(null);}}>
          <FileCode size={16} /> Logs de Actividad
        </button>

        <div style={{marginTop:'auto', paddingTop:20}}>
          <button className="admin-menu-item" style={{color:'#ef4444'}} onClick={handleLogout}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido del CMS */}
      <main className="admin-content">
        
        {/* EDITAR O CREAR ARTÍCULO */}
        {editingArticle ? (
          <div className="editor-panel">
            
            {/* Contenido Editor */}
            <div className="editor-main">
              <div className="admin-header">
                <h2>{editingArticle.id ? 'Editar Artículo' : 'Crear Artículo'}</h2>
                <div className="admin-actions">
                  <button className="btn-secondary" onClick={() => setEditingArticle(null)}>Cancelar</button>
                  <button className="btn-primary" onClick={handleSaveArticle}>Guardar Publicación</button>
                </div>
              </div>

              {/* Formulario Cabecera Post */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Título del Artículo *</label>
                  <input 
                    type="text" 
                    value={articleTitle} 
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="Ej: WBS de Edificaciones paso a paso"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Categoría</label>
                  <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Resumen Ejecutivo / Lead SEO *</label>
                <textarea 
                  value={articleSummary} 
                  onChange={(e) => setArticleSummary(e.target.value)}
                  placeholder="Escribe un resumen atractivo para las listas y buscadores..."
                  rows={2}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Imagen Destacada (Enlace o Subir Local)</label>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <input 
                      type="text" 
                      value={articleImage} 
                      onChange={(e) => setArticleImage(e.target.value)}
                      placeholder="Pegar enlace de imagen..."
                      style={{flexGrow:1}}
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleArticleImageUpload} 
                      style={{display:'none'}} 
                      id="art-img-file"
                    />
                    <label htmlFor="art-img-file" className="btn-secondary" style={{padding:'10px 14px', fontSize:12, cursor:'pointer', margin:0, whiteSpace:'nowrap', borderRadius:'var(--radius-md)'}}>
                      Subir Imagen
                    </label>
                  </div>
                  {articleImage && (
                    <div style={{marginTop:8, display:'flex', alignItems:'center', gap:8}}>
                      <img src={articleImage} alt="Vista previa" style={{width:45, height:45, objectFit:'cover', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)'}} />
                      <span style={{fontSize:11, color:'var(--text-muted)'}}>{articleImage.startsWith('data:image') ? 'Imagen local cargada (comprimida)' : 'Imagen por enlace externo'}</span>
                    </div>
                  )}
                </div>
                <div className="admin-form-group">
                  <label>Dificultad</label>
                  <select value={articleDifficulty} onChange={(e) => setArticleDifficulty(e.target.value)}>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Estado</label>
                  <select value={articleStatus} onChange={(e) => setArticleStatus(e.target.value)}>
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Etiquetas (Separadas por comas)</label>
                <input 
                  type="text" 
                  value={articleTags} 
                  onChange={(e) => setArticleTags(e.target.value)}
                  placeholder="Planeamiento, MS Project, Curva S"
                />
              </div>

              {/* EDITOR DE BLOQUES NOTION */}
              <div className="mt-4">
                <label style={{fontWeight:800, fontSize:14, display:'block', marginBottom:12}}>Cuerpo del Artículo (Bloques Visuales)</label>
                <BlockEditor blocks={articleBlocks} onChange={setArticleBlocks} />
              </div>

            </div>

            {/* Asistente de IA Integrado (Sidebar) */}
            <aside className="editor-ai-sidebar">
              <h3 className="editor-ai-title"><Sparkles size={18} /> Asistente IA Julius</h3>
              <p style={{fontSize:12, color:'var(--text-muted)'}}>Usa inteligencia artificial para redactar borradores, sugerir metadatos y pulir tu contenido técnico.</p>
              
              <div className="admin-form-group">
                <button className="btn-secondary w-full" onClick={handleAiDraft} disabled={aiLoading}>
                  Generar Borrador
                </button>
              </div>

              <div className="admin-form-group">
                <button className="btn-secondary w-full" onClick={handleAiGrammar} disabled={aiLoading}>
                  Corregir Ortografía
                </button>
              </div>

              <div className="admin-form-group">
                <button className="btn-secondary w-full" onClick={handleAiTitles} disabled={aiLoading}>
                  Sugerir Títulos
                </button>
              </div>

              <div className="admin-form-group">
                <button className="btn-secondary w-full" onClick={handleAiSEO} disabled={aiLoading}>
                  Optimizar SEO
                </button>
              </div>

              {aiOutput && (
                <div className="ai-output-box-wrapper">
                  <label style={{fontSize:11, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase'}}>Respuesta de la IA</label>
                  <div className="ai-output-box">{aiOutput}</div>
                </div>
              )}
            </aside>

          </div>
        ) : (
          /* TABULACIONES REGULARES DEL CMS */
          <div>
            
            {/* TAB: ESTADÍSTICAS */}
            {activeTab === 'stats' && (
              <div>
                <h2>Dashboard de Estadísticas</h2>
                <p className="text-muted mb-4">Métricas globales de visitas, publicaciones y comunidad.</p>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon"><FileText /></div>
                    <div className="stat-info">
                      <span className="stat-value">{articles.length}</span>
                      <span className="stat-label">Artículos Totales</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon"><FolderPlus /></div>
                    <div className="stat-info">
                      <span className="stat-value">{categories.length}</span>
                      <span className="stat-label">Categorías</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon"><DownloadCloud /></div>
                    <div className="stat-info">
                      <span className="stat-value">{resources.length}</span>
                      <span className="stat-label">Recursos</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon"><Mail /></div>
                    <div className="stat-info">
                      <span className="stat-value">{subscribers.length}</span>
                      <span className="stat-label">Suscriptores</span>
                    </div>
                  </div>
                </div>

                <div className="admin-table-container">
                  <div style={{padding:16, borderBottom:'1px solid var(--border)', fontWeight:800}}>Artículos Más Leídos</div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Vistas</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...articles].sort((a,b)=>b.views-a.views).slice(0, 4).map(art => (
                        <tr key={art.id}>
                          <td><strong>{art.title}</strong></td>
                          <td>{art.category}</td>
                          <td>{art.views || 0}</td>
                          <td>
                            <button className="btn-link" onClick={() => handleEditArticle(art)}>Editar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ARTÍCULOS */}
            {activeTab === 'articles' && (
              <div>
                <div className="admin-header">
                  <h2>Gestor de Artículos</h2>
                  <div style={{display:'flex', gap:10}}>
                    <button className="btn-secondary" onClick={() => setShowSyncModal(true)} style={{display:'flex', alignItems:'center', gap:6}}>
                      <RefreshCw size={14} /> Sincronizar Noticias
                    </button>
                    <button className="btn-primary" onClick={handleNewArticle}>+ Nuevo Artículo</button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Dificultad</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Vistas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map(art => (
                        <tr key={art.id}>
                          <td><strong>{art.title}</strong></td>
                          <td>{art.category}</td>
                          <td><span className={`badge badge-${art.difficulty.toLowerCase()}`}>{art.difficulty}</span></td>
                          <td>{art.date}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px', 
                              borderRadius: 4, 
                              fontSize: 11, 
                              fontWeight: 'bold',
                              backgroundColor: art.status === 'publicado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                              color: art.status === 'publicado' ? '#10b981' : '#6b7280'
                            }}>
                              {art.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{art.views || 0}</td>
                          <td className="admin-actions">
                            <button className="btn-icon" onClick={() => handleEditArticle(art)} title="Editar">
                              <Edit3 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDeleteArticle(art.id)} title="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: CATEGORÍAS */}
            {activeTab === 'categories' && (
              <div>
                <div className="admin-header">
                  <h2>Gestor de Categorías</h2>
                  <button className="btn-primary" onClick={() => setShowCatModal(true)}>+ Nueva Categoría</button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Slug URL</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => (
                        <tr key={cat.id}>
                          <td><strong>{cat.name}</strong></td>
                          <td>/{cat.slug}</td>
                          <td>
                            <button className="btn-icon delete" onClick={() => handleDeleteCategory(cat.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: RECURSOS */}
            {activeTab === 'resources' && (
              <div>
                <div className="admin-header">
                  <h2>Gestor de Recursos (Descargables y Video Cursos)</h2>
                  <button className="btn-primary" onClick={() => {
                    setEditingResourceId(null);
                    setNewResTitle('');
                    setNewResDesc('');
                    setNewResSize('1.5 MB');
                    setNewResType('Excel (XLSX)');
                    setNewResUrl('');
                    setNewResOrder(resources.length + 1);
                    setNewResClass('descargable');
                    setShowResModal(true);
                  }}>+ Nuevo Recurso</button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Orden</th>
                        <th>Título</th>
                        <th>Clase</th>
                        <th>Tipo / Formato</th>
                        <th>Peso / Duración</th>
                        <th>Descargas / Vistas</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...resources].sort((a, b) => (a.order || 99) - (b.order || 99)).map(res => (
                        <tr key={res.id}>
                          <td style={{fontWeight:'bold', color:'var(--primary)'}}>{res.order || '-'}</td>
                          <td><strong>{res.title}</strong></td>
                          <td>
                            <span className="badge" style={{
                              backgroundColor: res.resourceType === 'video' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 58, 138, 0.1)',
                              color: res.resourceType === 'video' ? '#ef4444' : 'var(--primary)',
                              fontSize: 10,
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              {res.resourceType === 'video' ? 'Video Curso' : 'Descargable'}
                            </span>
                          </td>
                          <td>{res.fileType}</td>
                          <td>{res.fileSize}</td>
                          <td>{res.downloadCount || 0}</td>
                          <td className="admin-actions">
                            <button className="btn-icon" onClick={() => handleEditResourceClick(res)} title="Editar">
                              <Edit3 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDeleteResource(res.id)} title="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: CURSOS */}
            {activeTab === 'courses' && (
              <div>
                <div className="admin-header">
                  <h2>Gestor de Cursos</h2>
                  <button className="btn-primary" onClick={() => setShowCourseModal(true)}>+ Nuevo Curso</button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Nivel</th>
                        <th>Duración</th>
                        <th>Precio</th>
                        <th>Enlace de Compra / Plataforma (Udemy)</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td><strong>{course.title}</strong></td>
                          <td>{course.level}</td>
                          <td>{course.duration}</td>
                          <td>${course.price} USD</td>
                          <td style={{fontFamily:'var(--font-code)', fontSize:12, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                            {course.link || 'Sin enlace'}
                          </td>
                          <td className="admin-actions">
                            <button className="btn-icon" onClick={() => handleEditCourseClick(course)} title="Editar">
                              <Edit3 size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDeleteCourse(course.id)} title="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: COMENTARIOS */}
            {activeTab === 'comments' && (
              <div>
                <h2>Moderación de Comentarios</h2>
                <p className="text-muted mb-4">Aprueba o rechaza los comentarios de los usuarios antes de que aparezcan en el blog público.</p>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Autor</th>
                        <th>Correo</th>
                        <th>Comentario</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comments.map(com => (
                        <tr key={com.id}>
                          <td><strong>{com.author}</strong></td>
                          <td>{com.email}</td>
                          <td style={{maxWidth:300}}>{com.content}</td>
                          <td>{com.date}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px', 
                              borderRadius: 4, 
                              fontSize: 11, 
                              fontWeight: 'bold',
                              backgroundColor: com.status === 'aprobado' ? 'rgba(16, 185, 129, 0.1)' : com.status === 'pendiente' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: com.status === 'aprobado' ? '#10b981' : com.status === 'pendiente' ? '#f59e0b' : '#ef4444'
                            }}>
                              {com.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="admin-actions">
                            {com.status !== 'aprobado' && (
                              <button className="btn-icon" onClick={() => handleCommentStatus(com.id, 'aprobado')} title="Aprobar">
                                <Check size={14} color="#10b981" />
                              </button>
                            )}
                            {com.status !== 'rechazado' && (
                              <button className="btn-icon" onClick={() => handleCommentStatus(com.id, 'rechazado')} title="Rechazar">
                                <X size={14} color="#f59e0b" />
                              </button>
                            )}
                            <button className="btn-icon delete" onClick={() => handleDeleteComment(com.id)} title="Eliminar">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div className="sidebar-layout">
                
                {/* Lista de Suscriptores */}
                <div>
                  <div className="admin-header">
                    <h2>Lista de Suscriptores</h2>
                    <button className="btn-secondary" onClick={() => {
                      const csv = "Email,Fecha\n" + subscribers.map(s => `${s.email},${s.date}`).join("\n");
                      triggerDownload('suscriptores-julius.csv', csv, 'text/csv');
                    }}>
                      Exportar CSV
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Correo Electrónico</th>
                          <th>Fecha Registro</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub, idx) => (
                          <tr key={idx}>
                            <td><strong>{sub.email}</strong></td>
                            <td>{sub.date}</td>
                            <td>
                              <button className="btn-icon delete" onClick={() => {
                                if (window.confirm('¿Remover suscriptor?')) {
                                  dbService.deleteSubscriber(sub.email);
                                  refreshAllData();
                                }
                              }}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Componer Campaña */}
                <div className="sidebar-card">
                  <h3 className="sidebar-card-title">Enviar Campaña a Boletín</h3>
                  {campaignSuccess ? (
                    <div className="comment-success-msg">
                      <CheckCircle size={18} />
                      <span>¡Campaña enviada a {subscribers.length} suscriptores!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendCampaign} className="comment-form-grid">
                      <div className="admin-form-group">
                        <label>Asunto del Email</label>
                        <input 
                          type="text" 
                          required 
                          value={campaignSubject}
                          onChange={(e) => setCampaignSubject(e.target.value)}
                          placeholder="Ej: Nueva plantilla Excel disponible!"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Cuerpo del Correo</label>
                        <textarea 
                          required 
                          value={campaignBody}
                          onChange={(e) => setCampaignBody(e.target.value)}
                          placeholder="Escribe el cuerpo del mensaje..."
                          rows={6}
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full" disabled={campaignLoading}>
                        {campaignLoading ? 'Enviando...' : 'Enviar Campaña'}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

            {/* TAB: AJUSTES */}
            {activeTab === 'settings' && (
              <div className="sidebar-layout">
                
                {/* Formulario Ajustes */}
                <div className="comment-form-card">
                  <h2>Ajustes Generales del Sitio</h2>
                  <form onSubmit={handleSaveSettings} className="comment-form-grid mt-4">
                    
                    <div className="admin-form-group">
                      <label>Nombre del Blog / Sitio</label>
                      <input 
                        type="text" 
                        value={config.siteName || ''}
                        onChange={(e) => setConfig({...config, siteName: e.target.value})}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Texto Secundario Logo</label>
                      <input 
                        type="text" 
                        value={config.logoText || ''}
                        onChange={(e) => setConfig({...config, logoText: e.target.value})}
                      />
                    </div>

                    <div style={{borderTop:'1px solid var(--border)', paddingTop:16, marginTop:16, marginBottom:16}}>
                      <h3 style={{fontSize:14, marginBottom:12}}>Visibilidad de Páginas (Menú Navegación)</h3>
                      <div className="grid grid-2" style={{gap:12, marginBottom:16}}>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-noticias" checked={config.hideNoticias || false} onChange={(e) => setConfig({...config, hideNoticias: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-noticias" style={{margin:0, fontSize:13}}>Ocultar Noticias</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-blog" checked={config.hideBlog || false} onChange={(e) => setConfig({...config, hideBlog: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-blog" style={{margin:0, fontSize:13}}>Ocultar Blog Técnico</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-recursos" checked={config.hideRecursos || false} onChange={(e) => setConfig({...config, hideRecursos: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-recursos" style={{margin:0, fontSize:13}}>Ocultar Recursos</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-cursos" checked={config.hideCursos || false} onChange={(e) => setConfig({...config, hideCursos: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-cursos" style={{margin:0, fontSize:13}}>Ocultar Cursos</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-servicios" checked={config.hideServicios || false} onChange={(e) => setConfig({...config, hideServicios: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-servicios" style={{margin:0, fontSize:13}}>Ocultar Servicios</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-membresias" checked={config.hideMembresias || false} onChange={(e) => setConfig({...config, hideMembresias: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-membresias" style={{margin:0, fontSize:13}}>Ocultar Membresías</label>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          <input type="checkbox" id="hide-contacto" checked={config.hideContacto || false} onChange={(e) => setConfig({...config, hideContacto: e.target.checked})} style={{width:16, height:16}} />
                          <label htmlFor="hide-contacto" style={{margin:0, fontSize:13}}>Ocultar Contacto</label>
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Lema Técnico / Tagline</label>
                      <input 
                        type="text" 
                        value={config.tagline || ''}
                        onChange={(e) => setConfig({...config, tagline: e.target.value})}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Canal de YouTube URL</label>
                      <input 
                        type="text" 
                        value={config.youtubeChannelUrl || ''}
                        onChange={(e) => setConfig({...config, youtubeChannelUrl: e.target.value})}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="admin-form-group">
                        <label>LinkedIn URL</label>
                        <input type="text" value={config.linkedInUrl || ''} onChange={(e) => setConfig({...config, linkedInUrl: e.target.value})} />
                      </div>
                      <div className="admin-form-group">
                        <label>Telegram Canal</label>
                        <input type="text" value={config.telegramUrl || ''} onChange={(e) => setConfig({...config, telegramUrl: e.target.value})} />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>ID Google Analytics</label>
                      <input type="text" value={config.googleAnalyticsId || ''} onChange={(e) => setConfig({...config, googleAnalyticsId: e.target.value})} />
                    </div>

                    <div style={{borderTop:'1px solid var(--border)', paddingTop:16, marginTop:16, marginBottom:16}}>
                      <h3 style={{fontSize:14, marginBottom:12}}>Sección "Nosotros" (Portada de Inicio)</h3>
                      <div className="admin-form-group">
                        <label>Título de la Sección</label>
                        <input 
                          type="text" 
                          value={config.aboutTitle || ''}
                          onChange={(e) => setConfig({...config, aboutTitle: e.target.value})}
                          placeholder="Ej: Sobre Nosotros"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>URL Imagen del Autor</label>
                        <input 
                          type="text" 
                          value={config.aboutImage || ''}
                          onChange={(e) => setConfig({...config, aboutImage: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Texto Descriptivo de Nosotros</label>
                        <textarea 
                          value={config.aboutText || ''}
                          onChange={(e) => setConfig({...config, aboutText: e.target.value})}
                          placeholder="Ingresa tu perfil profesional..."
                          rows={4}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Logros / Certificaciones (Separados por comas)</label>
                        <input 
                          type="text" 
                          value={config.aboutBullets || ''}
                          onChange={(e) => setConfig({...config, aboutBullets: e.target.value})}
                          placeholder="Certificado PMP, Especialista en CPM, Consultor"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{flexDirection:'row', alignItems:'center', gap:10}}>
                      <input 
                        type="checkbox" 
                        id="ads-chk" 
                        checked={config.adSenseActive || false}
                        onChange={(e) => setConfig({...config, adSenseActive: e.target.checked})}
                        style={{width:18, height:18}}
                      />
                      <label htmlFor="ads-chk">Activar Google AdSense / Publicidad</label>
                    </div>

                    <button type="submit" className="btn-primary">Guardar Ajustes</button>
                  </form>
                </div>

                {/* Integración Airtable Sync */}
                <div className="sidebar-card">
                  <h3 className="sidebar-card-title"><Database size={16} /> Airtable Database Sync</h3>
                  <p style={{fontSize:13, color:'var(--text-muted)', marginBottom:16}}>Sincroniza tus artículos y comentarios con tu base de datos Airtable en la nube.</p>
                  
                  <form onSubmit={handleSaveSettings} className="comment-form-grid">
                    <div className="admin-form-group" style={{flexDirection:'row', alignItems:'center', gap:10}}>
                      <input 
                        type="checkbox" 
                        id="air-chk" 
                        checked={config.airtableActive || false}
                        onChange={(e) => setConfig({...config, airtableActive: e.target.checked})}
                        style={{width:18, height:18}}
                      />
                      <label htmlFor="air-chk">Habilitar Airtable Sync</label>
                    </div>

                    <div className="admin-form-group">
                      <label>Airtable API Key / Token</label>
                      <input 
                        type="password" 
                        value={config.airtableApiKey || ''}
                        onChange={(e) => setConfig({...config, airtableApiKey: e.target.value})}
                        placeholder="patXXXXXXXXXX.XXXX..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Airtable Base ID</label>
                      <input 
                        type="text" 
                        value={config.airtableBaseId || ''}
                        onChange={(e) => setConfig({...config, airtableBaseId: e.target.value})}
                        placeholder="appXXXXXXXXXXXXXX"
                      />
                    </div>

                    <button type="submit" className="btn-secondary w-full mb-2">Guardar Credenciales</button>
                  </form>

                  <button 
                    onClick={handleAirtableSync} 
                    className="btn-primary w-full"
                    disabled={syncLoading || !config.airtableActive}
                    style={{marginTop:12}}
                  >
                    {syncLoading ? <RefreshCw className="animate-spin" size={14} /> : 'Sincronizar con Airtable'}
                  </button>
                  {syncMsg && <p style={{fontSize:12, marginTop:8, textAlign:'center', color:'var(--primary)'}}>{syncMsg}</p>}
                </div>

              </div>
            )}

            {/* TAB: BACKUPS Y ARCHIVOS SEO */}
            {activeTab === 'backups' && (
              <div className="sidebar-layout">
                
                {/* Backups */}
                <div className="comment-form-card">
                  <h2>Copias de Seguridad</h2>
                  <p className="text-muted mb-4">Exporta toda la base de datos de LocalStorage en formato JSON, o restaura una copia guardada.</p>
                  
                  <div className="admin-form-group" style={{gap:16}}>
                    <button className="btn-primary w-full" onClick={handleExportBackup}>
                      Descargar Copia de Seguridad (.json)
                    </button>
                    
                    <div className="admin-form-group">
                      <label>Restaurar desde archivo (.json)</label>
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleImportBackup}
                        style={{padding:8}}
                      />
                    </div>
                  </div>
                </div>

                {/* Descarga XML / TXT SEO */}
                <div className="sidebar-card">
                  <h3 className="sidebar-card-title">Sitemaps & SEO Ficheros</h3>
                  <p style={{fontSize:13, color:'var(--text-muted)', marginBottom:16}}>Descarga los sitemaps requeridos por Google Search Console para indexar tus URL amigables.</p>
                  
                  <div className="admin-form-group" style={{gap:10}}>
                    <button className="btn-secondary w-full" onClick={handleDownloadSitemap}>
                      Descargar sitemap.xml
                    </button>
                    <button className="btn-secondary w-full" onClick={handleDownloadRobots}>
                      Descargar robots.txt
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: LOGS */}
            {activeTab === 'logs' && (
              <div>
                <h2>Logs de Actividad Administrativa</h2>
                <p className="text-muted mb-4">Bitácora de auditoría interna de acciones del CMS.</p>
                
                <div className="admin-table-container" style={{maxHeight:450, overflowY:'auto'}}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID Acción</th>
                        <th>Acción Realizada</th>
                        <th>Usuario</th>
                        <th>Fecha / Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(lg => (
                        <tr key={lg.id}>
                          <td><span style={{fontFamily:'var(--font-code)', fontSize:11}}>{lg.id}</span></td>
                          <td><strong>{lg.action}</strong></td>
                          <td>{lg.user}</td>
                          <td>{lg.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* MODAL NUEVA CATEGORÍA */}
      {showCatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agregar Categoría</h3>
              <button className="btn-icon" onClick={() => setShowCatModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCategory}>
              <div className="modal-body">
                <div className="admin-form-group">
                  <label>Nombre de Categoría</label>
                  <input 
                    type="text" 
                    required 
                    value={newCatName} 
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ej. Inteligencia Artificial"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCatModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO/EDITAR RECURSO */}
      {showResModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingResourceId ? 'Editar Recurso' : 'Agregar Recurso'}</h3>
              <button className="btn-icon" onClick={() => {
                setShowResModal(false);
                setEditingResourceId(null);
                setNewResTitle('');
                setNewResDesc('');
                setNewResSize('1.5 MB');
                setNewResType('Excel (XLSX)');
                setNewResUrl('');
                setNewResOrder(1);
                setNewResClass('descargable');
                setLocalFileContent('');
                setLocalFileName('');
              }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveResource}>
              <div className="modal-body comment-form-grid">
                <div className="form-row-2">
                  <div className="admin-form-group">
                    <label>Clase de Recurso *</label>
                    <select value={newResClass} onChange={(e) => {
                      setNewResClass(e.target.value);
                      if (e.target.value === 'video') {
                        setNewResSize('2.5 horas');
                        setNewResType('Video Playlist');
                      } else {
                        setNewResSize('1.5 MB');
                        setNewResType('Excel (XLSX)');
                      }
                    }}>
                      <option value="descargable">Plantilla Descargable (Archivo)</option>
                      <option value="video">Curso Gratuito (Video / YouTube)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Orden de Visualización *</label>
                    <input type="number" required value={newResOrder} onChange={(e) => setNewResOrder(e.target.value)} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Título del Recurso *</label>
                  <input 
                    type="text" 
                    required 
                    value={newResTitle} 
                    onChange={(e) => setNewResTitle(e.target.value)}
                    placeholder="Ej. Plantilla de Curva S en Excel o Curso Express de P6"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Corta *</label>
                  <textarea 
                    required 
                    value={newResDesc} 
                    onChange={(e) => setNewResDesc(e.target.value)}
                    placeholder="Describe el contenido del archivo o los videos del curso..."
                    rows={3}
                  />
                </div>

                <div className="form-row-2">
                  <div className="admin-form-group">
                    <label>{newResClass === 'video' ? 'Duración (ej. 2 horas)' : 'Peso del Archivo'}</label>
                    <input type="text" value={newResSize} onChange={(e) => setNewResSize(e.target.value)} placeholder={newResClass === 'video' ? 'Ej. 45 minutos' : 'Ej: 1.8 MB'} />
                  </div>
                  <div className="admin-form-group">
                    <label>{newResClass === 'video' ? 'Formato del Video' : 'Tipo de Archivo'}</label>
                    {newResClass === 'video' ? (
                      <select value={newResType} onChange={(e) => setNewResType(e.target.value)}>
                        <option value="Video Playlist">Video Playlist</option>
                        <option value="Video Tutorial">Video Tutorial</option>
                        <option value="Curso en Video">Curso en Video</option>
                      </select>
                    ) : (
                      <select value={newResType} onChange={(e) => setNewResType(e.target.value)}>
                        <option value="Excel (XLSX)">Excel (XLSX)</option>
                        <option value="PDF">PDF</option>
                        <option value="ZIP (Excel/P6)">ZIP (Excel/P6)</option>
                        <option value="MS Project (MPP)">MS Project (MPP)</option>
                      </select>
                    )}
                  </div>
                </div>

                {newResClass === 'descargable' && (
                  <div className="admin-form-group">
                    <label>Subir Archivo Local (Opcional, tiene prioridad)</label>
                    <div style={{display:'flex', gap:8, alignItems:'center'}}>
                      <input 
                        type="file" 
                        onChange={handleResourceFileChange} 
                        style={{display:'none'}}
                        id="res-file-upload"
                      />
                      <label htmlFor="res-file-upload" className="btn-secondary" style={{padding:'10px 14px', fontSize:12, cursor:'pointer', margin:0, whiteSpace:'nowrap', borderRadius:'var(--radius-md)'}}>
                        Seleccionar Archivo Local
                      </label>
                      <span style={{fontSize:12, color:'var(--text-muted)', textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap'}}>
                        {localFileName ? `Archivo: ${localFileName}` : 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="admin-form-group">
                  <label>{newResClass === 'video' ? 'Enlace del Video / Playlist (YouTube)' : 'Enlace / URL de Descarga Externa'}</label>
                  <input 
                    type="text" 
                    value={newResUrl} 
                    onChange={(e) => setNewResUrl(e.target.value)} 
                    placeholder={newResClass === 'video' ? "https://www.youtube.com/watch?v=..." : "https://drive.google.com/..."} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowResModal(false);
                  setEditingResourceId(null);
                  setNewResTitle('');
                  setNewResDesc('');
                  setNewResSize('1.5 MB');
                  setNewResType('Excel (XLSX)');
                  setNewResUrl('');
                  setNewResOrder(1);
                  setNewResClass('descargable');
                  setLocalFileContent('');
                  setLocalFileName('');
                }}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Recurso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO/EDITAR CURSO */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCourseId ? 'Editar Curso' : 'Agregar Curso'}</h3>
              <button className="btn-icon" onClick={() => {
                setShowCourseModal(false);
                setEditingCourseId(null);
                setCourseTitle('');
                setCourseDesc('');
                setCoursePrice(49.99);
                setCourseImage('');
                setCourseDuration('12 horas');
                setCourseLevel('Intermedio');
                setCourseLink('');
              }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCourse}>
              <div className="modal-body comment-form-grid">
                <div className="admin-form-group">
                  <label>Título del Curso *</label>
                  <input 
                    type="text" 
                    required 
                    value={courseTitle} 
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Ej. Curso Completo de Primavera P6"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Corta</label>
                  <textarea 
                    value={courseDesc} 
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Explica qué aprenderán en este curso..."
                    rows={3}
                  />
                </div>
                <div className="form-row-2">
                  <div className="admin-form-group">
                    <label>Precio (USD) *</label>
                    <input type="number" step="0.01" required value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Nivel</label>
                    <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Todos los niveles">Todos los niveles</option>
                    </select>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="admin-form-group">
                    <label>Duración</label>
                    <input type="text" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} placeholder="Ej: 24 horas" />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Imagen del Curso</label>
                    <input type="text" value={courseImage} onChange={(e) => setCourseImage(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Enlace del Curso * (Marketing de Afiliados o Curso Propio)</label>
                  <div style={{display:'flex', gap:10}}>
                    <input 
                      type="text" 
                      required
                      value={courseLink} 
                      onChange={(e) => setCourseLink(e.target.value)}
                      placeholder="Ej: https://www.udemy.com/course/... o https://tusitio.com/comprar"
                      style={{flex:1}}
                    />
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={handleSyncCourseData}
                      disabled={syncingExternal || !courseLink}
                      style={{whiteSpace:'nowrap'}}
                    >
                      {syncingExternal ? 'Sincronizando...' : 'Sincronizar Precio'}
                    </button>
                  </div>
                  {syncError && <span style={{fontSize:11, color:'#ef4444', marginTop:4, display:'block'}}>{syncError}</span>}
                  {syncSuccessMsg && <span style={{fontSize:11, color:'#10b981', marginTop:4, display:'block'}}>{syncSuccessMsg}</span>}
                  <small style={{fontSize:11, color:'var(--text-muted)', marginTop:4, display:'block'}}>
                    Pega el enlace de Udemy o Hotmart y haz clic en <strong>Sincronizar Precio</strong> para autocompletar la ficha con el precio rebajado en tiempo real.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowCourseModal(false);
                  setEditingCourseId(null);
                  setCourseTitle('');
                  setCourseDesc('');
                  setCoursePrice(49.99);
                  setCourseImage('');
                  setCourseDuration('12 horas');
                  setCourseLevel('Intermedio');
                  setCourseLink('');
                }}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SINCRONIZAR NOTICIAS */}
      {showSyncModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:500}}>
            <div className="modal-header">
              <h3>Sincronizar Noticias de Minería</h3>
              <button className="btn-icon" onClick={() => {
                setShowSyncModal(false);
                setSyncNewsError('');
                setSyncNewsSuccess('');
              }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSyncNews}>
              <div className="modal-body comment-form-grid">
                <div className="admin-form-group" style={{marginBottom:15}}>
                  <label>Seleccionar Portal de Noticias</label>
                  <select 
                    value={syncSource} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSyncSource(val);
                      if (val === 'rumbominero') {
                        setSyncUrl('https://www.rumbominero.com/category/peru/noticias/mineria/');
                      } else if (val === 'construir') {
                        setSyncUrl('https://construir.com.pe/noticias/');
                      } else if (val === 'constructivo') {
                        setSyncUrl('https://constructivo.com/noticia');
                      } else {
                        setSyncUrl('');
                      }
                    }}
                  >
                    <option value="rumbominero">Rumbo Minero (Minería)</option>
                    <option value="construir">Revista Internacional Construir (Construcción)</option>
                    <option value="constructivo">Revista Constructivo (Ingeniería y Construcción)</option>
                    <option value="custom">Otro portal / Feed RSS personalizado</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>URL de Noticias o Feed RSS *</label>
                  <input 
                    type="text" 
                    required 
                    value={syncUrl} 
                    onChange={(e) => {
                      setSyncUrl(e.target.value);
                      setSyncSource('custom');
                    }}
                    placeholder="https://..."
                  />
                  <small style={{fontSize:11, color:'var(--text-muted)', marginTop:4, display:'block'}}>
                    Soporta scraping adaptativo de <strong>Rumbo Minero</strong>, <strong>Revista Construir</strong>, <strong>Revista Constructivo</strong> y feeds RSS genéricos de WordPress.
                  </small>
                </div>

                {syncNewsLoading && (
                  <div style={{display:'flex', alignItems:'center', gap:10, padding:12, backgroundColor:'var(--bg-light)', borderRadius:6, margin:'10px 0'}}>
                    <RefreshCw className="spin" size={18} style={{color:'var(--primary)', animation:'spinRotate 1.5s linear infinite'}} />
                    <span style={{fontSize:13}}>Analizando estructura externa, evadiendo retos de seguridad y descargando entradas...</span>
                  </div>
                )}

                {syncNewsError && (
                  <div style={{padding:'8px 12px', backgroundColor:'rgba(239,68,68,0.1)', color:'#ef4444', borderRadius:6, fontSize:12, marginTop:10}}>
                    {syncNewsError}
                  </div>
                )}

                {syncNewsSuccess && (
                  <div style={{padding:'8px 12px', backgroundColor:'rgba(16,185,129,0.1)', color:'#10b981', borderRadius:6, fontSize:12, marginTop:10}}>
                    {syncNewsSuccess}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowSyncModal(false);
                  setSyncNewsError('');
                  setSyncNewsSuccess('');
                }} disabled={syncNewsLoading}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={syncNewsLoading}>
                  {syncNewsLoading ? 'Sincronizando...' : 'Iniciar Sincronización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
