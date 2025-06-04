// Script para limpiar y regenerar eventos - Sun & Flower Ibiza
console.log('🔄 Limpiando base de datos de eventos...');

// Función para limpiar eventos
function limpiarEventos() {
    try {
        // Eliminar eventos del localStorage
        localStorage.removeItem('s&f_events');
        console.log('✅ Eventos eliminados del localStorage');
        
        // Mostrar estado actual
        const eventos = localStorage.getItem('s&f_events');
        const users = localStorage.getItem('s&f_users');
        const clubs = localStorage.getItem('s&f_clubs');
        const djs = localStorage.getItem('s&f_djs');
        const promoters = localStorage.getItem('s&f_promoters');
        
        console.log('📊 Estado después de limpiar:');
        console.log(`📅 Eventos: ${eventos ? JSON.parse(eventos).length : 0}`);
        console.log(`👥 Usuarios: ${users ? JSON.parse(users).length : 0}`);
        console.log(`🏪 Clubs: ${clubs ? JSON.parse(clubs).length : 0}`);
        console.log(`🎧 DJs: ${djs ? JSON.parse(djs).length : 0}`);
        console.log(`🏢 Promotores: ${promoters ? JSON.parse(promoters).length : 0}`);
        
        console.log('🔄 Recarga la página para cargar los nuevos eventos...');
        
        return true;
    } catch (error) {
        console.error('❌ Error limpiando eventos:', error);
        return false;
    }
}

// Función para verificar eventos
function verificarEventos() {
    const eventos = localStorage.getItem('s&f_events');
    if (eventos) {
        const parsedEventos = JSON.parse(eventos);
        console.log(`📊 ${parsedEventos.length} eventos encontrados`);
        parsedEventos.forEach((evento, index) => {
            console.log(`${index + 1}. ${evento.name} - ${new Date(evento.date).toLocaleDateString('es-ES')}`);
        });
    } else {
        console.log('❌ No hay eventos en localStorage');
    }
}

// Exportar funciones para uso en consola
window.limpiarEventos = limpiarEventos;
window.verificarEventos = verificarEventos;

console.log('📋 Funciones disponibles:');
console.log('- limpiarEventos() : Elimina todos los eventos');
console.log('- verificarEventos() : Muestra los eventos actuales');
console.log('');
console.log('💡 Para regenerar eventos:');
console.log('1. Ejecuta: limpiarEventos()');
console.log('2. Recarga la página (F5 o Ctrl+R)'); 