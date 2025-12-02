
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { agendaService } from '../../../services/agendaService';
import { notificationService } from '../../../services/notificationService';
import { combineDateAndTime, formatDateToString } from '../../../utils/agenda/dateFormatters';
import { getEventTypeName } from '../../../utils/agenda/eventHelpers';

export const useEventForm = (selectedDate, onEventSaved) => {
    const { user, userPets } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        eventType: 'cita',
        eventTitle: '',
        eventDescription: '',
        eventDate: new Date(),
        eventTime: new Date(),
        selectedPet: '',
        sendNotification: true,
        showDatePicker: false,
        showTimePicker: false,
    });

    const updateFormField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const openAddModal = useCallback(() => {
        const initialDate = selectedDate 
            ? (() => {
                const [year, month, day] = selectedDate.split('-');
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            })()
            : new Date();

        setFormData({
            eventType: 'cita',
            eventTitle: '',
            eventDescription: '',
            eventDate: initialDate,
            eventTime: new Date(),
            selectedPet: '',
            sendNotification: true,
            showDatePicker: false,
            showTimePicker: false,
        });
        setShowAddModal(true);
    }, [selectedDate]);

    const closeAddModal = useCallback(() => {
        setShowAddModal(false);
    }, []);

    const handleSaveEvent = useCallback(async () => {
        // Validación
        if (!formData.eventTitle.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return;
        }

        setSaving(true);
        try {
            // Combinar fecha y hora
            const finalDate = combineDateAndTime(formData.eventDate, formData.eventTime);

            const eventData = {
                type: formData.eventType,
                title: formData.eventTitle.trim(),
                description: formData.eventDescription.trim(),
                date: finalDate,
                petId: formData.selectedPet || null,
                petName: userPets.find(p => p.id === formData.selectedPet)?.nombre || null,
                completed: false,
                notificationId: null,
            };

            // Crear evento
            const eventId = await agendaService.createEvent(user.uid, eventData);

            // Programar notificación si se solicitó
            if (formData.sendNotification) {
                try {
                    const notificationId = await notificationService.scheduleNotificationAtTime(
                        `🐾 ${getEventTypeName(formData.eventType)}`,
                        `${formData.eventTitle} - ${eventData.petName || 'Tu mascota'}`,
                        finalDate,
                        { eventId, type: formData.eventType }
                    );

                    if (notificationId) {
                        await agendaService.updateEvent(eventId, { notificationId });
                    }
                } catch (notificationError) {
                    console.warn('⚠️ No se pudo programar la notificación:', notificationError);
                }
            }

            Alert.alert('Exito', 'Evento creado correctamente');
            closeAddModal();
            
            await onEventSaved();
            
        } catch (error) {
            console.error('Error guardando evento:', error);
            Alert.alert('Error', 'No se pudo guardar el evento. Por favor intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    }, [formData, user.uid, userPets, onEventSaved, closeAddModal]);

    return {
        formData,
        updateFormField,
        showAddModal,
        openAddModal,
        closeAddModal,
        handleSaveEvent,
        saving,
        userPets,
    };
};