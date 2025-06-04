# Configuración de Base de Datos - Sun & Flower Ibiza Calendar

## Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave API anónima

### 2. Ejecutar Script SQL

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Copia y pega el contenido completo del archivo `schema.sql`
3. Ejecuta el script

### 3. Verificar Tablas Creadas

El script creará las siguientes tablas:
- `users` - Usuarios del sistema
- `clubs` - Clubs de Ibiza
- `djs` - DJs y artistas
- `promoters` - Promotores de eventos
- `events` - Eventos de música electrónica

### 4. Datos de Ejemplo

El script incluye datos de ejemplo:
- **Clubs famosos**: Pacha, Amnesia, Ushuaïa, Hï, DC10, Privilege
- **DJs reconocidos**: David Guetta, Calvin Harris, Martin Garrix, Tiësto, etc.
- **Promotores**: Elrow, Cocoon, Music On, Afterlife, ANTS
- **Eventos de ejemplo** para el verano 2025

### 5. Configuración de Seguridad

El script incluye:
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de seguridad** para lectura pública de contenido aprobado
- **Permisos** para que usuarios puedan crear y editar su propio contenido

### 6. Actualizar Variables de Entorno

Asegúrate de que tu archivo `.env` contenga:

```env
VITE_SUPABASE_URL=https://zxuucjdnnqpkwdatdare.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dXVjamRubnFwa3dkYXRkYXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTE1MjQsImV4cCI6MjA2MzE4NzUyNH0.P9uWY2UbsLCiOx7PuuELq2cKP2dy2_-_5eEccMaXNQA
```

### 7. Probar Conexión

Una vez configurado, el calendario debería mostrar los eventos de ejemplo y conectarse correctamente a Supabase.

## Estructura de Datos

### Eventos
- Información completa del evento (nombre, fecha, hora, precio)
- Relaciones con clubs, DJs y promotores
- Soporte para múltiples DJs por evento
- Enlaces sociales y fuentes originales
- Sistema de aprobación/moderación

### Clubs
- Información del venue (nombre, ubicación, capacidad)
- Fotos y enlaces sociales
- Sistema de aprobación

### DJs
- Perfil completo (bio, géneros, foto)
- Enlaces sociales
- Sistema de aprobación

### Promotores
- Información de la marca/empresa
- Logo y enlaces
- Sistema de aprobación

## Próximos Pasos

1. ✅ Configurar Supabase
2. ✅ Ejecutar script SQL
3. ✅ Conectar frontend
4. 🔄 Implementar autenticación (opcional)
5. 🔄 Implementar subida de imágenes
6. 🔄 Implementar scraping automático 