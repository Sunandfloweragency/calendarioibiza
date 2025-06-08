const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorios a limpiar
const dirsToClean = [
  './node_modules/.vite',
  './dist',
  './.cache'
];

// Limpiar directorios
console.log('🧹 Limpiando directorios de caché...');
dirsToClean.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      console.log(`📁 Eliminando ${dir}...`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`❌ Error al eliminar ${dir}:`, err);
  }
});

// Eliminar archivos de caché
console.log('🧹 Limpiando archivos de caché...');
const cacheFiles = [
  './tsconfig.tsbuildinfo'
];

cacheFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`📄 Eliminando ${file}...`);
      fs.unlinkSync(file);
    }
  } catch (err) {
    console.error(`❌ Error al eliminar ${file}:`, err);
  }
});

// Ejecutar comandos npm
console.log('🔄 Reinstalando módulos...');
try {
  console.log('📦 Limpiando node_modules...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache limpiada correctamente');
  
  console.log('🔄 Reinstalando dependencias...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias reinstaladas correctamente');
} catch (err) {
  console.error('❌ Error al ejecutar comandos npm:', err);
}

console.log('✨ Limpieza completada!'); 