
import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';
import styles from '../../../styles/AgendaScreenStyles';
import { getUpcomingEvents, getEventColor, getEventTypeIcon } from '../../../utils/agenda/eventHelpers';
import { formatDate, formatTime, formatDateToString } from '../../../utils/agenda/dateFormatters';

const UpcomingEventCard = React.memo(({ event, onPress, language }) => {
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    const eventColor = getEventColor(event.type);
    const eventIcon = getEventTypeIcon(event.type);

    return (
        <TouchableOpacity
            style={[
                styles.upcomingCard,
                { borderLeftColor: eventColor },
            ]}
            onPress={onPress}
        >
            <View style={[
                styles.upcomingIconContainer,
                { backgroundColor: `${eventColor}15` }
            ]}>
                <Ionicons
                    name={eventIcon}
                    size={18}
                    color={eventColor}
                />
            </View>
            <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>{event.title}</Text>
                <Text style={styles.upcomingDate}>
                    📅 {formatDate(eventDate, language)} • {formatTime(eventDate, language)}
                </Text>
                {event.petName && (
                    <Text style={styles.upcomingPet}>🐾 {event.petName}</Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
        </TouchableOpacity>
    );
});

const UpcomingEvents = ({ events, onEventPress }) => {
    const { t, language } = useLanguage();
    
    // Verificación de seguridad
    if (!t || !language) return null;
    
    const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);

    const handleEventPress = useCallback((event) => {
        const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
        const dateStr = formatDateToString(eventDate);
        onEventPress(dateStr);
    }, [onEventPress]);

    if (upcomingEvents.length === 0) return null;

    return (
        <View style={styles.upcomingSection}>
            <Text style={styles.upcomingSectionTitle}>📋 {t('agenda.upcomingEvents')}</Text>
            {upcomingEvents.map((event) => (
                <UpcomingEventCard
                    key={event.id}
                    event={event}
                    onPress={() => handleEventPress(event)}
                    language={language}
                />
            ))}
        </View>
    );
};

export default React.memo(UpcomingEvents);