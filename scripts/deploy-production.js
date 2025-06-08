#!/usr/bin/env node

/**
 * Script para desplegar la aplicación a producción con Vercel
 * Configura la base de datos Supabase, optimiza archivos y despliega automáticamente
 * 
 * Uso: node scripts/deploy-production.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuración
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Función para ejecutar comandos y mostrar su salida
function runCommand(command, options = {}) {
  console.log(`${colors.cyan}>> Ejecutando:${colors.reset} ${command}`);
  try {
    return execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options
    });
  } catch (error) {
    console.error(`${colors.red}Error ejecutando: ${command}${colors.reset}`);
    console.error(error.message);
    if (!options.ignoreError) {
      process.exit(1);
    }
    return null;
  }
}

// Función para verificar si una herramienta está instalada
function isToolInstalled(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Función para verificar prerrequisitos
function checkPrerequisites() {
  console.log(`\n${colors.bright}${colors.magenta}=== Verificando prerrequisitos ===${colors.reset}\n`);
  
  // Verificar Node y npm
  const nodeVersion = runCommand('node --version', { silent: true }).trim();
  console.log(`${colors.green}✓ Node.js:${colors.reset} ${nodeVersion}`);
  
  const npmVersion = runCommand('npm --version', { silent: true }).trim();
  console.log(`${colors.green}✓ npm:${colors.reset} ${npmVersion}`);
  
  // Verificar Vercel CLI
  if (!isToolInstalled('vercel')) {
    console.log(`${colors.yellow}⚠ Vercel CLI no encontrado. Instalando...${colors.reset}`);
    runCommand('npm install -g vercel');
  } else {
    console.log(`${colors.green}✓ Vercel CLI instalado${colors.reset}`);
  }
}

// Función para generar archivo .env para producción
function generateEnvFile() {
  console.log(`\n${colors.bright}${colors.magenta}=== Configurando variables de entorno ===${colors.reset}\n`);
  
  // Verificar si existe el archivo .env.example
  const envExamplePath = path.join(process.cwd(), 'env.example');
  if (!fs.existsSync(envExamplePath)) {
    console.error(`${colors.red}Error: No se encontró el archivo env.example${colors.reset}`);
    process.exit(1);
  }
  
  // Leer el archivo .env.example
  const envExample = fs.readFileSync(envExamplePath, 'utf-8');
  
  // Crear el archivo .env para producción
  const envContent = envExample
    .replace('VITE_DEBUG_MODE=false', 'VITE_DEBUG_MODE=false')
    .replace('VITE_NODE_ENV=production', 'VITE_NODE_ENV=production');
  
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`${colors.green}✓ Archivo .env creado para producción${colors.reset}`);
}

// Función para limpiar la build anterior
function cleanProject() {
  console.log(`\n${colors.bright}${colors.magenta}=== Limpiando proyecto ===${colors.reset}\n`);
  
  // Eliminar carpeta dist
  if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
    console.log(`${colors.yellow}Eliminando carpeta dist...${colors.reset}`);
    fs.rmSync(path.join(process.cwd(), 'dist'), { recursive: true, force: true });
  }
  
  // Limpiar caché
  console.log(`${colors.yellow}Limpiando caché...${colors.reset}`);
  runCommand('npm run clean', { ignoreError: true });
  
  console.log(`${colors.green}✓ Proyecto limpiado correctamente${colors.reset}`);
}

// Función para verificar TypeScript
function typeCheck() {
  console.log(`\n${colors.bright}${colors.magenta}=== Verificando TypeScript ===${colors.reset}\n`);
  
  try {
    runCommand('npm run type-check');
    console.log(`${colors.green}✓ Verificación de TypeScript completada${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ La verificación de TypeScript encontró problemas, pero continuamos...${colors.reset}`);
  }
}

// Función para construir la aplicación
function buildApp() {
  console.log(`\n${colors.bright}${colors.magenta}=== Construyendo aplicación para producción ===${colors.reset}\n`);
  
  // Ejecutar el build de producción
  runCommand('npm run build:prod');
  
  console.log(`${colors.green}✓ Build de producción completada${colors.reset}`);
  
  // Verificar tamaño de los archivos
  console.log(`\n${colors.cyan}Tamaño de los archivos generados:${colors.reset}`);
  if (process.platform === 'win32') {
    runCommand('dir dist\\assets /s');
  } else {
    runCommand('du -sh dist/* dist/assets/*');
  }
}

// Función para inicializar Supabase y cargar datos iniciales
function setupDatabase() {
  console.log(`\n${colors.bright}${colors.magenta}=== Configurando base de datos ===${colors.reset}\n`);
  
  // Verificar si existe un script específico para inicializar la base de datos
  const setupDbScript = path.join(process.cwd(), 'scripts', 'setup-database.js');
  
  if (fs.existsSync(setupDbScript)) {
    console.log(`${colors.yellow}Ejecutando script de inicialización de base de datos...${colors.reset}`);
    runCommand('node scripts/setup-database.js');
  } else {
    console.log(`${colors.yellow}No se encontró un script específico para la base de datos.${colors.reset}`);
    console.log(`${colors.yellow}Asegúrate de que la base de datos esté correctamente configurada en Supabase.${colors.reset}`);
  }
  
  console.log(`${colors.green}✓ Configuración de base de datos completada${colors.reset}`);
}

// Función para desplegar a Vercel
function deployToVercel() {
  console.log(`\n${colors.bright}${colors.magenta}=== Desplegando a Vercel ===${colors.reset}\n`);
  
  // Verificar si el usuario está logueado en Vercel
  try {
    const vercelUser = execSync('vercel whoami', { stdio: 'pipe', encoding: 'utf-8' }).trim();
    console.log(`${colors.green}✓ Logueado en Vercel como:${colors.reset} ${vercelUser}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ No estás logueado en Vercel. Iniciando sesión...${colors.reset}`);
    runCommand('vercel login');
  }
  
  // Desplegar a Vercel
  console.log(`${colors.yellow}Desplegando a Vercel...${colors.reset}`);
  runCommand('vercel --prod');
  
  console.log(`${colors.green}${colors.bright}✓ Aplicación desplegada correctamente a producción${colors.reset}`);
}

// Función principal
async function main() {
  console.log(`\n${colors.bright}${colors.magenta}==========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}  DESPLIEGUE A PRODUCCIÓN - IBIZA CALENDAR  ${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}==========================================${colors.reset}\n`);
  
  // Preguntar confirmación
  rl.question(`${colors.yellow}¿Estás seguro de que deseas desplegar a producción? (s/n): ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'si' && answer.toLowerCase() !== 'sí') {
      console.log(`${colors.red}Despliegue cancelado.${colors.reset}`);
      rl.close();
      return;
    }
    
    // Ejecutar pasos
    try {
      console.log(`${colors.green}Iniciando despliegue a producción...${colors.reset}`);
      
      checkPrerequisites();
      generateEnvFile();
      cleanProject();
      typeCheck();
      buildApp();
      setupDatabase();
      deployToVercel();
      
      console.log(`\n${colors.bright}${colors.green}¡DESPLIEGUE COMPLETADO EXITOSAMENTE!${colors.reset}`);
      console.log(`${colors.green}La aplicación está ahora disponible en producción.${colors.reset}\n`);
      
    } catch (error) {
      console.error(`\n${colors.red}${colors.bright}ERROR EN EL DESPLIEGUE:${colors.reset}`);
      console.error(`${colors.red}${error.message}${colors.reset}\n`);
      console.log(`${colors.yellow}Revisa los errores y vuelve a intentarlo.${colors.reset}`);
    } finally {
      rl.close();
    }
  });
}

// Ejecutar script
main(); 