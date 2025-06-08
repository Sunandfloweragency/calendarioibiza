# 🚀 Guía de Deployment - Sun & Flower Ibiza Calendar

## 📋 Resumen

Esta guía te ayudará a desplegar la aplicación **Sun & Flower Ibiza Calendar** en producción usando **Vercel** y **Supabase**.

## 🔧 Configuración Previa

### 1. Variables de Entorno

Asegúrate de tener configuradas las siguientes variables de entorno:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://zxuucjdnnqpkwdatdare.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dXVjamRubnFxa3dkYXRkYXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTE1MjQsImV4cCI6MjA2MzE4NzUyNH0.P9uWY2UbsLCiOx7PuuELq2cKP2dy2_-_5eEccMaXNQA
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dXVjamRubnFxa3dkYXRkYXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzYxMTUyNCwiZXhwIjoyMDYzMTg3NTI0fQ.u4CQLmBBOvJ3y2N00ZMyjf3nISleTH9I8fXQULLlT74

# App Configuration
VITE_APP_NAME="Sun & Flower Ibiza Calendar"
VITE_APP_VERSION=1.0.0
VITE_APP_DOMAIN=calendar.sunandflower.agency

# Feature Flags
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_USER_UPLOADS=true
VITE_ENABLE_SOCIAL_LOGIN=false

# Production
VITE_NODE_ENV=production
```

### 2. Base de Datos Supabase

La aplicación está configurada para usar **ÚNICAMENTE Supabase** como fuente de datos. No hay fallback a localStorage en producción.

#### Estructura de Tablas:
- `events` - Eventos musicales
- `djs` - DJs y artistas
- `clubs` - Clubs y venues
- `promoters` - Promotores y organizadores
- `users` - Usuarios del sistema

## 🌐 Deployment en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar Repositorio:**
   ```bash
   # Si no tienes Vercel CLI instalado
   npm i -g vercel
   
   # Conectar proyecto
   vercel
   ```

2. **Configurar Variables de Entorno en Vercel:**
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Settings → Environment Variables
   - Agrega todas las variables del archivo `.env`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Opción 2: Deploy Manual

1. **Build Local:**
   ```bash
   npm run build
   ```

2. **Subir a Vercel:**
   ```bash
   vercel --prod
   ```

## 🔍 Verificación Post-Deploy

### 1. Verificar Conexión a Base de Datos

La aplicación incluye un **Dashboard de Estado** que muestra:
- ✅ Estado de conexión a Supabase
- 📊 Número de registros por tabla
- 🔄 Botón de actualización manual

### 2. Verificar Funcionalidades

**Panel Público:**
- [ ] Listado de eventos
- [ ] Filtros por fecha/club/DJ
- [ ] Páginas de detalle
- [ ] Responsive design

**Panel Admin:**
- [ ] Login/autenticación
- [ ] CRUD de eventos
- [ ] CRUD de DJs, clubs, promotores
- [ ] Sistema de aprobaciones
- [ ] Gestor de duplicados
- [ ] Seeder de base de datos

### 3. Performance Check

```bash
# Lighthouse CI (opcional)
npm run lighthouse
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Verificar base de datos
npm run setup-db

# Deploy completo
npm run deploy
```

## 🔧 Configuración de Dominio

### DNS Configuration

Para usar el dominio `calendar.sunandflower.agency`:

1. **En Vercel:**
   - Project Settings → Domains
   - Add `calendar.sunandflower.agency`

2. **En tu proveedor DNS:**
   ```
   Type: CNAME
   Name: calendar
   Value: cname.vercel-dns.com
   ```

### SSL/HTTPS

Vercel maneja automáticamente los certificados SSL. La aplicación estará disponible en:
- `https://calendar.sunandflower.agency`

## 📊 Monitoreo

### Analytics Integrados

La aplicación incluye:
- **Vercel Analytics** - Métricas de tráfico
- **Vercel Speed Insights** - Performance monitoring

### Logs y Debugging

```bash
# Ver logs de Vercel
vercel logs

# Ver logs en tiempo real
vercel logs --follow
```

## 🚨 Troubleshooting

### Problema: "No se cargan los datos"

1. **Verificar variables de entorno:**
   ```bash
   # En Vercel dashboard
   Settings → Environment Variables
   ```

2. **Verificar conexión a Supabase:**
   - Ir al Dashboard de Estado en `/admin`
   - Verificar que muestre "Conectado a Supabase"

3. **Verificar datos en Supabase:**
   - Ir a [supabase.com](https://supabase.com)
   - Table Editor → verificar que hay datos

### Problema: "Error de build"

1. **Verificar dependencias:**
   ```bash
   npm ci
   npm run build
   ```

2. **Verificar TypeScript:**
   ```bash
   npm run type-check
   ```

### Problema: "Error 404 en rutas"

- Verificar que `vercel.json` tiene la configuración de rewrites correcta
- La configuración actual redirige todas las rutas a `/index.html`

## 🔄 Actualizaciones

### Deploy de Nuevas Versiones

1. **Commit cambios:**
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push
   ```

2. **Deploy automático:**
   - Vercel detecta el push y hace deploy automático
   - O manualmente: `vercel --prod`

### Rollback

```bash
# Ver deployments
vercel ls

# Hacer rollback a versión anterior
vercel rollback [deployment-url]
```

## 📈 Optimizaciones de Producción

### Performance

- ✅ Code splitting automático
- ✅ Compresión de assets
- ✅ Lazy loading de componentes
- ✅ Optimización de imágenes
- ✅ CDN global de Vercel

### SEO

- ✅ Meta tags dinámicos
- ✅ Open Graph tags
- ✅ Sitemap automático
- ✅ Robots.txt

### Security

- ✅ HTTPS forzado
- ✅ Headers de seguridad
- ✅ CSP (Content Security Policy)
- ✅ Rate limiting en Supabase

## 🎯 Checklist Final

Antes de considerar el deployment completo:

- [ ] ✅ Build exitoso sin errores
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Conexión a Supabase funcionando
- [ ] ✅ Datos de ejemplo cargados
- [ ] ✅ Panel admin accesible
- [ ] ✅ Panel público funcionando
- [ ] ✅ Responsive design verificado
- [ ] ✅ Performance > 90 en Lighthouse
- [ ] ✅ Dominio personalizado configurado
- [ ] ✅ SSL/HTTPS activo
- [ ] ✅ Analytics configurado

## 🆘 Soporte

Si encuentras problemas durante el deployment:

1. **Verificar logs:** `vercel logs`
2. **Verificar estado de Supabase:** Dashboard de Estado
3. **Verificar variables de entorno:** Vercel Settings
4. **Contactar soporte:** [vercel.com/support](https://vercel.com/support)

---

## 🎉 ¡Listo!

Tu aplicación **Sun & Flower Ibiza Calendar** está ahora desplegada y funcionando en producción con:

- ✅ **Frontend:** React + Vite + Tailwind CSS
- ✅ **Backend:** Supabase (PostgreSQL)
- ✅ **Hosting:** Vercel
- ✅ **Dominio:** calendar.sunandflower.agency
- ✅ **SSL:** Automático
- ✅ **CDN:** Global
- ✅ **Analytics:** Integrado

**URL de producción:** https://calendar.sunandflower.agency

¡Disfruta de tu calendario de música electrónica de Ibiza! 🎵🏝️ 