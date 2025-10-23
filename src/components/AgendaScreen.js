import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { useAuth } from '../context/AuthContext';
import { agendaService } from '../services/agendaService';
import { notificationService } from '../services/notificationService';
import SafeContainer from './SafeContainer';
import styles from '../styles/AgendaScreenStyles';

// Configurar calendario en español
LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const AgendaScreen = () => {
    const { user, userPets } = useAuth();
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados del formulario
    const [eventType, setEventType] = useState('cita');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedPet, setSelectedPet] = useState('');
    const [sendNotification, setSendNotification] = useState(true);

    useEffect(() => {
        loadEvents();
        requestNotificationPermissions();
    }, []);

    const requestNotificationPermissions = async () => {
        await notificationService.requestPermissions();
    };

    const loadEvents = async () => {
        try {
            setLoading(true);
            const userEvents = await agendaService.getUserEvents(user.uid);
            setEvents(userEvents);
            processMarkedDates(userEvents);
        } catch (error) {
            console.error('Error cargando eventos:', error);
            Alert.alert('Error', 'No se pudieron cargar los eventos');
        } finally {
            setLoading(false);
        }
    };

    const processMarkedDates = (eventsList) => {
        const marked = {};
        eventsList.forEach((event) => {
            const dateStr = formatDateToString(event.date.toDate ? event.date.toDate() : new Date(event.date));
            if (!marked[dateStr]) {
                marked[dateStr] = {
                    marked: true,
                    dots: [{ color: getEventColor(event.type) }],
                };
            } else {
                marked[dateStr].dots.push({ color: getEventColor(event.type) });
            }
        });
        setMarkedDates(marked);
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'cita':
                return '#4ECDC4';
            case 'vacuna':
                return '#E74C3C';
            case 'desparasitacion':
                return '#9B59B6';
            case 'otro':
                return '#F39C12';
            default:
                return '#95A5A6';
        }
    };

    // ✅ CORREGIDO: Formatear fecha correctamente sin cambio de zona horaria
    const formatDateToString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // ✅ CORREGIDO: Manejar selección de día correctamente
    const onDayPress = (day) => {
        console.log('Día seleccionado:', day.dateString);
        setSelectedDate(day.dateString);
    };

    const getEventsForSelectedDate = () => {
        if (!selectedDate) return [];
        return events.filter((event) => {
            const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
            const eventDateStr = formatDateToString(eventDate);
            return eventDateStr === selectedDate;
        });
    };

    // ✅ MEJORADO: DatePicker con mejor manejo de fecha
    const handleDateChange = (event, selected) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'set' && selected) {
            setEventDate(selected);
        }
    };

    const handleTimeChange = (event, selected) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (event.type === 'set' && selected) {
            setEventTime(selected);
        }
    };

    const getEventTypeIcon = (type) => {
        switch (type) {
            case 'cita':
                return 'calendar';
            case 'vacuna':
                return 'medical';
            case 'desparasitacion':
                return 'shield-checkmark';
            case 'otro':
                return 'bookmark';
            default:
                return 'calendar';
        }
    };

    const getEventTypeName = (type) => {
        switch (type) {
            case 'cita':
                return 'Cita Veterinaria';
            case 'vacuna':
                return 'Vacuna';
            case 'desparasitacion':
                return 'Desparasitación';
            case 'otro':
                return 'Otro';
            default:
                return 'Evento';
        }
    };

    const openAddModal = () => {
        setEventType('cita');
        setEventTitle('');
        setEventDescription('');
        // ✅ MEJORADO: Usar fecha seleccionada del calendario si existe
        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-');
            const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            setEventDate(newDate);
        } else {
            setEventDate(new Date());
        }
        setEventTime(new Date());
        setSelectedPet('');
        setSendNotification(true);
        setShowAddModal(true);
    };

    const handleSaveEvent = async () => {
        if (!eventTitle.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return;
        }

        setSaving(true);
        try {
            // ✅ CORREGIDO: Combinar fecha y hora correctamente
            const finalDate = new Date(eventDate);
            finalDate.setHours(eventTime.getHours());
            finalDate.setMinutes(eventTime.getMinutes());
            finalDate.setSeconds(0);
            finalDate.setMilliseconds(0);

            const eventData = {
                type: eventType,
                title: eventTitle.trim(),
                description: eventDescription.trim(),
                date: finalDate,
                petId: selectedPet || null,
                petName: userPets.find(p => p.id === selectedPet)?.nombre || null,
                completed: false,
                notificationId: null,
            };

            const eventId = await agendaService.createEvent(user.uid, eventData);

            if (sendNotification) {
                const notificationId = await notificationService.scheduleNotificationAtTime(
                    `🐾 ${getEventTypeName(eventType)}`,
                    `${eventTitle} - ${eventData.petName || 'Tu mascota'}`,
                    finalDate,
                    { eventId: eventId, type: eventType }
                );

                if (notificationId) {
                    await agendaService.updateEvent(eventId, { notificationId });
                }
            }

            Alert.alert('✅ Éxito', 'Evento creado correctamente');
            setShowAddModal(false);
            await loadEvents();
        } catch (error) {
            console.error('Error guardando evento:', error);
            Alert.alert('Error', 'No se pudo guardar el evento');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = (eventId, notificationId) => {
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
    };

    const handleToggleComplete = async (eventId, currentStatus) => {
        try {
            await agendaService.markEventAsCompleted(eventId, !currentStatus);
            await loadEvents();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el evento');
        }
    };

    const selectedDateEvents = getEventsForSelectedDate();

    return (
        <SafeContainer style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Agenda</Text>
                    <Text style={styles.headerSubtitle}>Organiza las citas de tus mascotas</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                    <Ionicons name="add-circle" size={32} color="#4ECDC4" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Calendario */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        current={new Date().toISOString().split('T')[0]}
                        onDayPress={onDayPress}
                        markedDates={{
                            ...markedDates,
                            [selectedDate]: {
                                ...markedDates[selectedDate],
                                selected: true,
                                selectedColor: '#4ECDC4',
                            },
                        }}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#7F8C8D',
                            selectedDayBackgroundColor: '#4ECDC4',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#4ECDC4',
                            dayTextColor: '#2C3E50',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#4ECDC4',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#4ECDC4',
                            monthTextColor: '#2C3E50',
                            indicatorColor: '#4ECDC4',
                            textDayFontWeight: '500',
                            textMonthFontWeight: '700',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 15,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 13,
                        }}
                        enableSwipeMonths={true}
                        markingType={'multi-dot'}
                    />
                </View>

                {/* Eventos del día seleccionado */}
                {selectedDate && (
                    <View style={styles.eventsSection}>
                        <Text style={styles.eventsSectionTitle}>
                            {selectedDateEvents.length > 0
                                ? `Eventos para ${formatDate(selectedDate)}`
                                : `Sin eventos para ${formatDate(selectedDate)}`}
                        </Text>

                        {selectedDateEvents.length > 0 ? (
                            selectedDateEvents.map((event) => (
                                <View
                                    key={event.id}
                                    style={[
                                        styles.eventCard,
                                        { borderLeftColor: getEventColor(event.type) },
                                        event.completed && styles.eventCardCompleted
                                    ]}
                                >
                                    <View style={styles.eventHeader}>
                                        <View style={[
                                            styles.eventIconContainer,
                                            { backgroundColor: `${getEventColor(event.type)}15` }
                                        ]}>
                                            <Ionicons
                                                name={getEventTypeIcon(event.type)}
                                                size={20}
                                                color={getEventColor(event.type)}
                                            />
                                        </View>
                                        <View style={styles.eventInfo}>
                                            <Text style={[
                                                styles.eventTitle,
                                                event.completed && styles.eventTitleCompleted
                                            ]}>
                                                {event.title}
                                            </Text>
                                            <Text style={styles.eventTime}>
                                                🕐 {formatTime(event.date.toDate ? event.date.toDate() : new Date(event.date))}
                                            </Text>
                                            {event.petName && (
                                                <Text style={styles.eventPet}>🐾 {event.petName}</Text>
                                            )}
                                        </View>
                                        <View style={styles.eventActions}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleToggleComplete(event.id, event.completed)
                                                }
                                                style={styles.checkButton}
                                            >
                                                <Ionicons
                                                    name={
                                                        event.completed
                                                            ? 'checkmark-circle'
                                                            : 'checkmark-circle-outline'
                                                    }
                                                    size={28}
                                                    color={event.completed ? '#27AE60' : '#BDC3C7'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleDeleteEvent(event.id, event.notificationId)
                                                }
                                                style={styles.deleteButton}
                                            >
                                                <Ionicons name="trash-outline" size={22} color="#E74C3C" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {event.description && (
                                        <Text style={styles.eventDescription}>{event.description}</Text>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-outline" size={56} color="#BDC3C7" />
                                <Text style={styles.emptyStateText}>
                                    No hay eventos para este día
                                </Text>
                                <TouchableOpacity 
                                    style={styles.emptyStateButton}
                                    onPress={openAddModal}
                                >
                                    <Ionicons name="add" size={20} color="#fff" />
                                    <Text style={styles.emptyStateButtonText}>Agregar Evento</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {/* Próximos eventos */}
                <View style={styles.upcomingSection}>
                    <Text style={styles.upcomingSectionTitle}>📋 Próximos Eventos</Text>
                    {events
                        .filter((e) => {
                            const eventDate = e.date.toDate ? e.date.toDate() : new Date(e.date);
                            return eventDate >= new Date() && !e.completed;
                        })
                        .slice(0, 5)
                        .map((event) => {
                            const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
                            return (
                                <TouchableOpacity
                                    key={event.id}
                                    style={[
                                        styles.upcomingCard,
                                        { borderLeftColor: getEventColor(event.type) },
                                    ]}
                                    onPress={() => {
                                        const dateStr = formatDateToString(eventDate);
                                        setSelectedDate(dateStr);
                                    }}
                                >
                                    <View style={[
                                        styles.upcomingIconContainer,
                                        { backgroundColor: `${getEventColor(event.type)}15` }
                                    ]}>
                                        <Ionicons
                                            name={getEventTypeIcon(event.type)}
                                            size={18}
                                            color={getEventColor(event.type)}
                                        />
                                    </View>
                                    <View style={styles.upcomingInfo}>
                                        <Text style={styles.upcomingTitle}>{event.title}</Text>
                                        <Text style={styles.upcomingDate}>
                                            📅 {formatDate(eventDate)} • {formatTime(eventDate)}
                                        </Text>
                                        {event.petName && (
                                            <Text style={styles.upcomingPet}>🐾 {event.petName}</Text>
                                        )}
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </ScrollView>

            {/* ✅ MEJORADO: Modal con mejor diseño */}
            <Modal
                isVisible={showAddModal}
                onBackdropPress={() => setShowAddModal(false)}
                onSwipeComplete={() => setShowAddModal(false)}
                swipeDirection="down"
                style={styles.modal}
                backdropOpacity={0.5}
                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nuevo Evento</Text>
                        <TouchableOpacity 
                            onPress={() => setShowAddModal(false)}
                            style={styles.modalCloseButton}
                        >
                            <Ionicons name="close" size={24} color="#7F8C8D" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Tipo de evento */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tipo de evento *</Text>
                            <View style={styles.typeButtonsContainer}>
                                {[
                                    { type: 'cita', label: 'Cita', icon: 'calendar' },
                                    { type: 'vacuna', label: 'Vacuna', icon: 'medical' },
                                    { type: 'desparasitacion', label: 'Desp.', icon: 'shield-checkmark' },
                                    { type: 'otro', label: 'Otro', icon: 'bookmark' },
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.type}
                                        style={[
                                            styles.typeButton,
                                            eventType === item.type && [
                                                styles.typeButtonActive,
                                                { backgroundColor: getEventColor(item.type) }
                                            ],
                                        ]}
                                        onPress={() => setEventType(item.type)}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={18}
                                            color={
                                                eventType === item.type
                                                    ? '#fff'
                                                    : getEventColor(item.type)
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.typeButtonText,
                                                eventType === item.type && styles.typeButtonTextActive,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Título */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Título *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Vacuna antirrábica"
                                value={eventTitle}
                                onChangeText={setEventTitle}
                                placeholderTextColor="#BDC3C7"
                            />
                        </View>

                        {/* Mascota */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Mascota (Opcional)</Text>
                            {userPets && userPets.length > 0 ? (
                                <View style={styles.petButtonsContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.petButton,
                                            selectedPet === '' && styles.petButtonActive,
                                        ]}
                                        onPress={() => setSelectedPet('')}
                                    >
                                        <Text
                                            style={[
                                                styles.petButtonText,
                                                selectedPet === '' && styles.petButtonTextActive,
                                            ]}
                                        >
                                            Ninguna
                                        </Text>
                                    </TouchableOpacity>
                                    {userPets.map((pet) => (
                                        <TouchableOpacity
                                            key={pet.id}
                                            style={[
                                                styles.petButton,
                                                selectedPet === pet.id && styles.petButtonActive,
                                            ]}
                                            onPress={() => setSelectedPet(pet.id)}
                                        >
                                            <Ionicons 
                                                name="paw" 
                                                size={12} 
                                                color={selectedPet === pet.id ? '#fff' : '#4ECDC4'} 
                                            />
                                            <Text
                                                style={[
                                                    styles.petButtonText,
                                                    selectedPet === pet.id && styles.petButtonTextActive,
                                                ]}
                                            >
                                                {pet.nombre}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.noPetsText}>No tienes mascotas registradas</Text>
                            )}
                        </View>

                        {/* ✅ MEJORADO: Fecha con mejor UI */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>📅 Fecha *</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>{formatDate(eventDate)}</Text>
                                <Ionicons name="calendar-outline" size={22} color="#4ECDC4" />
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={eventDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                                textColor="#2C3E50"
                                locale="es-ES"
                            />
                        )}

                        {/* ✅ MEJORADO: Hora con mejor UI */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>🕐 Hora *</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>{formatTime(eventTime)}</Text>
                                <Ionicons name="time-outline" size={22} color="#4ECDC4" />
                            </TouchableOpacity>
                        </View>

                        {showTimePicker && (
                            <DateTimePicker
                                value={eventTime}
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleTimeChange}
                                textColor="#2C3E50"
                                locale="es-ES"
                                is24Hour={false}
                            />
                        )}

                        {/* Descripción */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>📝 Descripción (Opcional)</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Agrega detalles adicionales..."
                                value={eventDescription}
                                onChangeText={setEventDescription}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#BDC3C7"
                            />
                        </View>

                        {/* Notificación */}
                        <TouchableOpacity
                            style={[
                                styles.notificationToggle,
                                sendNotification && styles.notificationToggleActive
                            ]}
                            onPress={() => setSendNotification(!sendNotification)}
                        >
                            <View style={styles.notificationLeft}>
                                <Ionicons
                                    name={sendNotification ? 'notifications' : 'notifications-off'}
                                    size={24}
                                    color={sendNotification ? '#4ECDC4' : '#BDC3C7'}
                                />
                                <Text style={[
                                    styles.notificationText,
                                    sendNotification && styles.notificationTextActive
                                ]}>
                                    Enviar recordatorio
                                </Text>
                            </View>
                            <View style={[
                                styles.toggleSwitch,
                                sendNotification && styles.toggleSwitchActive
                            ]}>
                                <View style={[
                                    styles.toggleCircle,
                                    sendNotification && styles.toggleCircleActive
                                ]} />
                            </View>
                        </TouchableOpacity>

                        {/* Botones */}
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowAddModal(false)}
                                disabled={saving}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, saving && styles.buttonDisabled]}
                                onPress={handleSaveEvent}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                        <Text style={styles.saveButtonText}>Guardar</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeContainer>
    );
};

export default AgendaScreen;