# Los Apuntes de Julius - Plataforma Web de Blog Profesional

Esta plataforma web es un blog modular e interactivo especializado en **Ingeniería, Construcción y Gestión de Proyectos**, diseñado con la estética limpia y organizada de **Notion** pero con una identidad corporativa propia basada en azul metálico y tipografía premium.

---

## 🛠️ Tecnologías y Características

1. **Frontend**: React 18, Vite y Vanilla CSS.
2. **Estilos**: Variables CSS nativas, modo claro/oscuro adaptativo, layout responsive y micro-animaciones.
3. **Editor de Bloques Notion-like**: Permite construir artículos mediante bloques interactivos (Títulos, Párrafos, Callouts, Listas, Tablas, Código, Acordeones, YouTube, Imágenes, PDFs y Botones).
4. **Base de Datos**: 
   - **LocalStorage (Local)**: Datos precargados sobre ingeniería y control de proyectos. Los cambios en el panel de administración se guardan instantáneamente en el navegador.
   - **Airtable Sync (Opcional)**: Sincronización automatizada mediante API REST en los ajustes de administración.
5. **SEO & Rendimiento**: URLs amigables por hash (`#post/slug`), generador interactivo de sitemaps XML, Robots.txt y meta-etiquetas dinámicas de Open Graph y datos estructurados (Schema.org).
6. **Asistente de IA Local**: Integración simulada/extendible para redactar borradores, corregir ortografía, proponer títulos y optimizar descripciones SEO.

---

## 🚀 Cómo Ejecutar en Local

Para iniciar el servidor de desarrollo local:

1. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre el navegador en la URL indicada por Vite (normalmente `http://localhost:5173`).

---

## 🔒 Acceso al Panel de Administración

Para acceder al gestor de contenidos (CMS):
1. Haz clic en el botón **Admin** en la esquina superior derecha del menú de navegación (o ve a `#admin` en la URL).
2. Ingresa las credenciales por defecto:
   - **Usuario**: `admin`
   - **Contraseña**: `julius123`

Desde el panel administrativo podrás:
- Gestionar todos los artículos, categorías, comentarios, suscriptores, recursos y cursos.
- Sincronizar datos con Airtable.
- Descargar copias de seguridad de la base de datos o subir un respaldo previo.
- Descargar archivos `sitemap.xml` y `robots.txt` listos para SEO.

---

## ☁️ Guía de Despliegue en Google Cloud

Esta plataforma es una Single Page Application (SPA) estática, lo que facilita enormemente su despliegue económico y de alto rendimiento en Google Cloud de tres formas alternativas:

### Opción A: Firebase Hosting (Recomendada)
Firebase Hosting forma parte de Google Cloud y provee SSL gratuito y CDN global instantáneamente.
1. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión en tu cuenta de Google:
   ```bash
   firebase login
   ```
3. Compila el proyecto en local:
   ```bash
   npm run build
   ```
4. Inicializa el proyecto (selecciona Hosting, elige la carpeta `dist` como directorio público y configura como SPA):
   ```bash
   firebase init
   ```
5. Despliega la aplicación:
   ```bash
   firebase deploy
   ```

### Opción B: Google Cloud Storage (Hosting de Sitios Estáticos)
Ideal para alojar el sitio como archivos en un Bucket de Storage con un dominio personalizado mediante Cloud CDN:
1. Compila el sitio con `npm run build`.
2. Crea un bucket en Cloud Storage con el nombre de tu dominio personalizado (ej. `losapuntesdejulius.com`).
3. Sube el contenido de la carpeta `dist/` al bucket:
   ```bash
   gsutil rsync -R dist/ gs://losapuntesdejulius.com
   ```
4. Configura el bucket para acceso de lectura público y establece `index.html` como página de inicio y error.

### Opción C: Google Cloud Run (Contenedores)
Si deseas transformarlo en un servicio web contenedorizado con escalamiento a cero:
1. Crea un archivo `Dockerfile` simple con un servidor Nginx para servir la carpeta `dist`.
2. Sube y compila el contenedor en Google Artifact Registry.
3. Despliega el contenedor a Cloud Run habilitando la opción "Permitir invitaciones no autenticadas".
