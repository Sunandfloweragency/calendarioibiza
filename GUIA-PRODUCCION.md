# 🚀 Guía para Desplegar a Producción - Sun & Flower Ibiza Calendar

## 📋 Resumen

Esta guía te ayudará a desplegar la aplicación del calendario de eventos de música electrónica en Ibiza a un entorno de producción utilizando Vercel.

## 📦 Requisitos Previos

- Node.js 18+ instalado
- npm 9+ instalado
- Cuenta en Vercel
- Cuenta en Supabase (con la base de datos ya configurada)
- Vercel CLI instalado (opcional, pero recomendado)

## 🔑 Configuración de Variables de Entorno

La aplicación utiliza las siguientes variables de entorno que deben configurarse tanto en desarrollo como en producción:

1. **Configuración de Supabase**:
   - `VITE_SUPABASE_URL`: URL de tu proyecto de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase
   - `VITE_SUPABASE_SERVICE_KEY`: Clave de servicio de Supabase (para operaciones admin)

2. **Configuración de la aplicación**:
   - `VITE_APP_NAME`: Nombre de la aplicación
   - `VITE_APP_VERSION`: Versión de la aplicación
   - `VITE_APP_DOMAIN`: Dominio donde se alojará la aplicación

## 🚀 Pasos para el Despliegue

### 1. Preparación del proyecto

```bash
# Clona el repositorio (si aún no lo has hecho)
git clone <url-del-repositorio>
cd nuevo-calendar

# Instala las dependencias
npm install

# Crea un archivo .env basado en env.example
cp env.example .env
```

### 2. Verificación local antes del despliegue

```bash
# Ejecuta las comprobaciones de TypeScript
npm run type-check

# Genera el build de producción para probarlo localmente
npm run build:prod

# Inicia el servidor de vista previa para probar el build
npm run preview
```

### 3. Despliegue usando el script automatizado

La forma más sencilla de desplegar es usar el script automatizado incluido:

```bash
# Ejecuta el script de despliegue a producción
node scripts/deploy-production.js
```

Este script realizará automáticamente todos los pasos necesarios:
- Verificará los prerrequisitos
- Configurará las variables de entorno
- Limpiará builds anteriores
- Verificará TypeScript
- Generará el build optimizado
- Configurará la base de datos Supabase
- Desplegará a Vercel

### 4. Despliegue manual paso a paso

Si prefieres hacer el despliegue manualmente, sigue estos pasos:

#### 4.1. Genera el build de producción

```bash
# Limpia builds anteriores
npm run clean

# Genera el build de producción
npm run build:prod
```

#### 4.2. Configura la base de datos

```bash
# Ejecuta el script de configuración de la base de datos
node scripts/setup-database.js
```

#### 4.3. Despliega a Vercel

```bash
# Si tienes Vercel CLI instalado
vercel login
vercel --prod

# Si no tienes Vercel CLI, puedes usar el panel web de Vercel
# 1. Ve a vercel.com
# 2. Importa tu proyecto desde GitHub
# 3. Configura las variables de entorno
# 4. Despliega
```

## 🔍 Verificación Post-Despliegue

Una vez completado el despliegue, verifica que todo funciona correctamente:

1. Accede a la URL de tu aplicación desplegada
2. Verifica que puedes iniciar sesión
3. Comprueba que los datos se cargan correctamente desde Supabase
4. Prueba las principales funcionalidades:
   - Visualización del calendario
   - Panel de usuario
   - Gestión de eventos (si eres administrador)

## 🛠️ Solución de Problemas

### La base de datos aparece vacía

Si la base de datos aparece vacía después del despliegue:

1. Verifica que las variables de entorno de Supabase están correctamente configuradas
2. Ejecuta manualmente el script de inicialización de datos:
   ```bash
   node scripts/setup-database.js
   ```

### Errores de conexión a Supabase

Si aparecen errores de conexión a Supabase:

1. Verifica que la URL y las claves son correctas
2. Comprueba que tu IP no está bloqueada en las reglas de acceso de Supabase
3. Verifica que las tablas necesarias existen en tu base de datos de Supabase

### Problemas con Vercel

Si tienes problemas con el despliegue en Vercel:

1. Revisa los logs de build en el dashboard de Vercel
2. Verifica que todas las variables de entorno están correctamente configuradas
3. Prueba hacer un nuevo despliegue con la opción "Override" para ignorar la caché

## 📈 Monitoring y Análisis

### Analytics y Monitoring

La aplicación está configurada para utilizar:
- Vercel Analytics para métricas de uso
- Vercel Speed Insights para métricas de rendimiento

Puedes acceder a estos datos desde el dashboard de Vercel.

## 🔄 Actualizaciones Futuras

Para futuras actualizaciones:

1. Haz los cambios en tu entorno de desarrollo
2. Prueba localmente
3. Haz commit y push a tu repositorio
4. Si tienes CI/CD configurado, el despliegue será automático
5. Si no, ejecuta el script de despliegue: `node scripts/deploy-production.js`

---

¡Listo! Ahora tu aplicación Sun & Flower Ibiza Calendar debería estar correctamente desplegada en producción y lista para ser utilizada por tus usuarios. 