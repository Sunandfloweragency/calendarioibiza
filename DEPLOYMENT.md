# 🚀 Guía de Deployment - Ibiza Calendar

## 📋 **Resumen de Deployment**

Esta aplicación está configurada para **deployment automático** en Vercel con CI/CD completo usando GitHub Actions.

---

## 🛠 **Configuración Inicial**

### **1. Secrets de GitHub**

Configura estos secrets en tu repositorio de GitHub (`Settings` > `Secrets and variables` > `Actions`):

```bash
VERCEL_TOKEN=<tu-vercel-token>
VERCEL_ORG_ID=<tu-org-id>
VERCEL_PROJECT_ID=<tu-project-id>
```

**Cómo obtener los valores:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y obtener tokens
vercel login
vercel link  # Esto genera .vercel/project.json con los IDs

# Ver project.json para obtener orgId y projectId
cat .vercel/project.json
```

### **2. Variables de Entorno en Vercel**

Configura en Vercel Dashboard (`Settings` > `Environment Variables`):

```bash
NODE_ENV=production
VITE_SUPABASE_URL=<tu-supabase-url>
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
VITE_SUPABASE_SERVICE_KEY=<tu-supabase-service-key>
```

---

## 🔄 **Workflow de CI/CD**

### **Automático en cada Push/PR:**

1. **Quality Check** 🔍
   - Type checking de TypeScript
   - Build test
   - Verificación de dependencias

2. **Deploy** 🚀 (solo en `main`/`master`)
   - Build de producción
   - Deploy automático a Vercel
   - Invalidación de cache

3. **Performance Test** 📊 (solo en PRs)
   - Lighthouse CI
   - Métricas de performance
   - Reporte automático

### **Métricas de Performance Objetivo:**
```json
{
  "Performance": ">= 80%",
  "Accessibility": ">= 90%", 
  "Best Practices": ">= 85%",
  "SEO": ">= 80%",
  "FCP": "< 2s",
  "LCP": "< 3s",
  "CLS": "< 0.1",
  "TBT": "< 300ms"
}
```

---

## 🏗 **Builds Locales**

### **Desarrollo:**
```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run preview      # Preview del build local (puerto 4173)
```

### **Producción:**
```bash
npm run build:deploy    # Build optimizado para producción
npm run lighthouse      # Test de performance local
```

### **Verificación:**
```bash
npm run type-check     # Verificar TypeScript
npm run lighthouse:ci  # Test de Lighthouse completo
```

---

## 📊 **Métricas de Build**

### **Tamaños de Bundle Actuales:**
```
📦 Assets optimizados:
├── index.html         8.78 kB (gzip: 2.67 kB)
├── index.css         79.22 kB (gzip: 12.42 kB)  
├── vendor.js        140.04 kB (gzip: 45.24 kB)
└── index.js         536.46 kB (gzip: 113.15 kB)

🎯 Total: ~740 kB (gzip: ~173 kB)
```

### **Optimizaciones Implementadas:**
- ✅ Tree shaking automático
- ✅ Code splitting por rutas
- ✅ Compresión gzip/brotli
- ✅ Cache headers optimizados
- ✅ Assets con hash para cache busting
- ✅ CSP headers de seguridad

---

## 🌐 **Configuración de Dominio**

### **Vercel (Recomendado):**
```bash
# Configurar dominio personalizado
vercel domains add tu-dominio.com
vercel domains add www.tu-dominio.com

# Configurar SSL automático (incluido)
```

### **DNS Records:**
```
Type  Name    Value
A     @       76.76.19.61
A     www     76.76.19.61
```

---

## 🔒 **Headers de Seguridad**

Configurados automáticamente en `vercel.json`:

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY", 
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "..."
}
```

---

## 🚨 **Troubleshooting**

### **Build Fallando:**
```bash
# Limpiar cache y rebuild
npm run clean
rm -rf node_modules
npm install
npm run build:deploy
```

### **Performance Issues:**
```bash
# Análisis de bundle
npm run build:deploy
npx vite-bundle-analyzer dist

# Test de Lighthouse local
npm run lighthouse
```

### **Errores de TypeScript:**
```bash
# Los warnings de TS no impiden el build
npm run type-check  # Ver todos los errores
# La mayoría son imports no utilizados (seguros)
```

---

## 📈 **Monitoring y Analytics**

### **Incluido por defecto:**
- 📊 **Vercel Analytics** - Métricas de uso
- ⚡ **Speed Insights** - Performance real
- 🔍 **Error tracking** - Logs automáticos

### **Acceso a métricas:**
```
Dashboard: https://vercel.com/tu-usuario/tu-proyecto
Analytics: /analytics
Speed: /speed-insights
```

---

## 🔄 **Rollback Rápido**

### **Desde Vercel Dashboard:**
1. Ve a `Deployments`
2. Selecciona deployment anterior
3. Click `Promote to Production`

### **Desde CLI:**
```bash
vercel rollback [deployment-url]
```

---

## ✅ **Checklist Pre-Deploy**

- [ ] Variables de entorno configuradas
- [ ] Secrets de GitHub configurados  
- [ ] Build local exitoso (`npm run build:deploy`)
- [ ] Tests de performance aceptables (`npm run lighthouse`)
- [ ] Dominio configurado (si aplica)
- [ ] SSL verificado
- [ ] Analytics funcionando

---

## 🚀 **Deploy Manual (Emergencia)**

Si GitHub Actions falla:

```bash
# Deploy directo desde local
npm run build:deploy
vercel --prod
```

---

**🎯 Deployment automático configurado y listo para producción!**

*Última actualización: $(date)* 