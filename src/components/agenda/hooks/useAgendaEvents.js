// ============================================
// 📋 USE AGENDA EVENTS HOOK
// ============================================
// ✅ Maneja toda la lógica de carga, filtrado y acciones sobre eventos
// ✅ Centraliza llamadas a servicios

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { agendaService } from '../../../services/agendaService';
import { notificationService } from '../../../services/notificationService';
import { formatDateToString } from '../../../utils/agenda/dateFormatters';
import { useMarkedDates } from './useMarkedDates';

export const useAgendaEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);

    // ✅ Usa el hook de fechas marcadas
    const markedDates = useMarkedDates(events);

    // ✅ Cargar eventos del usuario (memoizado con useCallback)
    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const userEvents = await agendaService.getUserEvents(user.uid);
            setEvents(userEvents);
        } catch (error) {
            console.error('Error cargando eventos:', error);
            Alert.alert('Error', 'No se pudieron cargar los eventos');
        } finally {
            setLoading(false);
        }
    }, [user.uid]);

    // ✅ Solicitar permisos de notificaciones
    const requestNotificationPermissions = useCallback(async () => {
        await notificationService.requestPermissions();
    }, []);

    // ✅ Carga inicial de eventos con cleanup
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            if (isMounted) {
                await loadEvents();
                await requestNotificationPermissions();
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [loadEvents, requestNotificationPermissions]);

    // ✅ Filtrar eventos por fecha seleccionada (memoizado)
    const selectedDateEvents = useMemo(() => {
        if (!selectedDate) return [];
        
        return events.filter((event) => {
            const eventDate = event.date.toDate 
                ? event.date.toDate() 
                : new Date(event.date);
            const eventDateStr = formatDateToString(eventDate);
            return eventDateStr === selectedDate;
        });
    }, [events, selectedDate]);

    // ✅ Marcar evento como completado
    const handleToggleComplete = useCallback(async (eventId, currentStatus) => {
        try {
            await agendaService.markEventAsCompleted(eventId, !currentStatus);
            await loadEvents();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el evento');
        }
    }, [loadEvents]);

    // ✅ Eliminar evento
    const handleDeleteEvent = useCallback((eventId, notificationId) => {
        Alert.alert(
            'Eliminar evento',
            '¿Estás seguro de eliminar este evento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await agendaService.deleteEvent(eventId);
                            if (notificationId) {
                                await notificationService.cancelNotification(notificationId);
                            }
                            await loadEvents();
                            Alert.alert('✅', 'Evento eliminado');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el evento');
                        }
                    },
                },
            ]
        );
    }, [loadEvents]);

    return {
        events,
        markedDates,
        selectedDate,
        setSelectedDate,
        selectedDateEvents,
        loading,
        refreshEvents: loadEvents,
        handleToggleComplete,
        handleDeleteEvent,
    };
};