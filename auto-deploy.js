import { watch } from 'fs';
import { exec } from 'child_process';

const WATCH_DIR = './src';
const DEBOUNCE_MS = 5000;
let debounceTimeout = null;

console.log(`🚀 Iniciando vigilante automático en: ${WATCH_DIR}`);
console.log('Cada vez que guardes cambios en tus archivos de código, se compilarán y subirán automáticamente a GitHub.');

watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.includes('node_modules') || filename.includes('dist') || filename.includes('.git')) return;

  console.log(`📝 Cambio detectado en archivo: ${filename}`);

  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    console.log('📦 Iniciando compilación y despliegue automático en la plataforma...');
    
    exec('npm run build', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Error durante la compilación:', stderr);
        return;
      }
      console.log('✅ Compilación exitosa. Confirmando cambios en Git...');
      
      exec('git add . && git commit -m "auto: sincronización automática de cambios locales" && git push', (gitErr, gitStdout, gitStderr) => {
        if (gitErr) {
          console.error('❌ Error al subir a GitHub:', gitStderr);
          return;
        }
        console.log('🚀 ¡Cambios publicados en vivo con éxito en tu GitHub Pages!');
        console.log(gitStdout);
      });
    });
  }, DEBOUNCE_MS);
});
