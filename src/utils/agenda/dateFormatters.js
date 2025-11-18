// ============================================
// 📅 DATE FORMATTERS - Funciones puras de formato de fecha
// ============================================
// ✅ Ventajas: Testeable, reutilizable, sin efectos secundarios

/**
 * Convierte una fecha a string YYYY-MM-DD sin problemas de zona horaria
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatDateToString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Formatea una fecha a formato legible en español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Ej: "15 de enero de 2025"
 */
export const formatDate = (date) => {
    // Si es un string en formato YYYY-MM-DD, parsearlo manualmente
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return d.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }
    
    // Si es un objeto Date, usarlo directamente
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Formatea una hora a formato de 12 horas
 * @param {Date} date - Fecha con hora
 * @returns {string} Ej: "02:30 PM"
 */
export const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Combina fecha y hora en un solo objeto Date
 * @param {Date} date - Fecha seleccionada
 * @param {Date} time - Hora seleccionada
 * @returns {Date} Fecha con hora combinada
 */
export const combineDateAndTime = (date, time) => {
    const finalDate = new Date(date);
    finalDate.setHours(time.getHours());
    finalDate.setMinutes(time.getMinutes());
    finalDate.setSeconds(0);
    finalDate.setMilliseconds(0);
    return finalDate;
};