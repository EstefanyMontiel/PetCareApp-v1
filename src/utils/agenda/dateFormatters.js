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
 * Formatea una fecha a formato legible según el idioma
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Idioma ('es' o 'en')
 * @returns {string} Ej: "15 de enero de 2025" (es) o "January 15, 2025" (en)
 */
export const formatDate = (date, locale = 'es') => {
    const localeCode = locale === 'en' ? 'en-US' : 'es-ES';
    
    // Si es un string en formato YYYY-MM-DD, parsearlo manualmente
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return d.toLocaleDateString(localeCode, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }
    
    // Si es un objeto Date, usarlo directamente
    const d = new Date(date);
    return d.toLocaleDateString(localeCode, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Formatea una hora a formato de 12 horas según el idioma
 * @param {Date} date - Fecha con hora
 * @param {string} locale - Idioma ('es' o 'en')
 * @returns {string} Ej: "02:30 PM"
 */
export const formatTime = (date, locale = 'es') => {
    const localeCode = locale === 'en' ? 'en-US' : 'es-ES';
    const d = new Date(date);
    return d.toLocaleTimeString(localeCode, {
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