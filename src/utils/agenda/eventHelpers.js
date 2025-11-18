// ============================================
// 🎨 EVENT HELPERS - Funciones de UI para eventos
// ============================================
// ✅ Centraliza lógica de colores, iconos y nombres

/**
 * Obtiene el color asociado a un tipo de evento
 * @param {string} type - Tipo de evento ('cita', 'vacuna', etc.)
 * @returns {string} Color hexadecimal
 */
export const getEventColor = (type) => {
    const colors = {
        cita: '#4ECDC4',
        vacuna: '#E74C3C',
        desparasitacion: '#9B59B6',
        otro: '#F39C12',
    };
    return colors[type] || '#95A5A6';
};

/**
 * Obtiene el icono de Ionicons para un tipo de evento
 * @param {string} type - Tipo de evento
 * @returns {string} Nombre del icono
 */
export const getEventTypeIcon = (type) => {
    const icons = {
        cita: 'calendar',
        vacuna: 'medical',
        desparasitacion: 'shield-checkmark',
        otro: 'bookmark',
    };
    return icons[type] || 'calendar';
};

/**
 * Obtiene el nombre legible de un tipo de evento
 * @param {string} type - Tipo de evento
 * @returns {string} Nombre en español
 */
export const getEventTypeName = (type) => {
    const names = {
        cita: 'Cita Veterinaria',
        vacuna: 'Vacuna',
        desparasitacion: 'Desparasitación',
        otro: 'Otro',
    };
    return names[type] || 'Evento';
};

/**
 * Define los tipos de eventos disponibles con sus metadatos
 * @returns {Array} Array de objetos con type, label, icon
 */
export const EVENT_TYPES = [
    { type: 'cita', label: 'Cita', icon: 'calendar' },
    { type: 'vacuna', label: 'Vacuna', icon: 'medical' },
    { type: 'desparasitacion', label: 'Desp.', icon: 'shield-checkmark' },
    { type: 'otro', label: 'Otro', icon: 'bookmark' },
];

/**
 * Filtra eventos futuros no completados
 * @param {Array} events - Array de eventos
 * @returns {Array} Eventos futuros ordenados
 */
export const getUpcomingEvents = (events, limit = 5) => {
    return events
        .filter((e) => {
            const eventDate = e.date.toDate ? e.date.toDate() : new Date(e.date);
            return eventDate >= new Date() && !e.completed;
        })
        .slice(0, limit);
};