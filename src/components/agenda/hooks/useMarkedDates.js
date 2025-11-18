// ============================================
// 📍 USE MARKED DATES HOOK
// ============================================
// ✅ Procesa eventos para marcar fechas en el calendario
// ✅ Memoizado para evitar re-cálculos innecesarios

import { useMemo } from 'react';
import { formatDateToString } from '../../../utils/agenda/dateFormatters';
import { getEventColor } from '../../../utils/agenda/eventHelpers';

/**
 * Hook que procesa eventos y genera marcadores para el calendario
 * @param {Array} events - Array de eventos del usuario
 * @returns {Object} Objeto con fechas marcadas para react-native-calendars
 */
export const useMarkedDates = (events) => {
    // ✅ Memoiza el procesamiento - solo recalcula si cambia events
    const markedDates = useMemo(() => {
        const marked = {};
        
        events.forEach((event) => {
            const dateStr = formatDateToString(
                event.date.toDate ? event.date.toDate() : new Date(event.date)
            );
            
            if (!marked[dateStr]) {
                marked[dateStr] = {
                    marked: true,
                    dots: [{ color: getEventColor(event.type) }],
                };
            } else {
                // Si ya existe la fecha, agregar otro punto
                marked[dateStr].dots.push({ color: getEventColor(event.type) });
            }
        });
        
        return marked;
    }, [events]); // Solo depende de events

    return markedDates;
};