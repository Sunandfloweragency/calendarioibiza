import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.log('Por favor verifica que VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY estén en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Verificando conexión a Supabase...');
console.log('🔗 URL:', supabaseUrl);
console.log('🔑 Service Key:', supabaseServiceKey.substring(0, 20) + '...');

async function checkDatabase() {
  try {
    const { data, error } = await supabase.from('events').select('count(*)', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('❌ Detalles:', error);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    console.log('📊 Eventos en base de datos:', data.count || 0);
    
    // Verificar otras tablas
    const [djsResult, clubsResult, promotersResult] = await Promise.allSettled([
      supabase.from('djs').select('count(*)', { count: 'exact' }),
      supabase.from('clubs').select('count(*)', { count: 'exact' }),
      supabase.from('promoters').select('count(*)', { count: 'exact' })
    ]);
    
    console.log('📊 DJs:', djsResult.status === 'fulfilled' ? djsResult.value.data?.count || 0 : 0);
    console.log('📊 Clubs:', clubsResult.status === 'fulfilled' ? clubsResult.value.data?.count || 0 : 0);
    console.log('📊 Promotores:', promotersResult.status === 'fulfilled' ? promotersResult.value.data?.count || 0 : 0);
    
    console.log('🎉 Base de datos configurada correctamente');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  }
}

checkDatabase(); 