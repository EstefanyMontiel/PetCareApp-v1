
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/AgendaScreenStyles';
import { getEventColor, getEventTypeIcon } from '../../../utils/agenda/eventHelpers';
import { formatTime } from '../../../utils/agenda/dateFormatters';

const EventCard = ({ event, onToggleComplete, onDelete }) => {
    const eventColor = getEventColor(event.type);
    const eventIcon = getEventTypeIcon(event.type);
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);

    return (
        <View
            style={[
                styles.eventCard,
                { borderLeftColor: eventColor },
                event.completed && styles.eventCardCompleted
            ]}
        >
            <View style={styles.eventHeader}>
                <View style={[
                    styles.eventIconContainer,
                    { backgroundColor: `${eventColor}15` }
                ]}>
                    <Ionicons
                        name={eventIcon}
                        size={20}
                        color={eventColor}
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
                        🕐 {formatTime(eventDate)}
                    </Text>
                    {event.petName && (
                        <Text style={styles.eventPet}>🐾 {event.petName}</Text>
                    )}
                </View>
                <View style={styles.eventActions}>
                    <TouchableOpacity
                        onPress={() => onToggleComplete(event.id, event.completed)}
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
                        onPress={() => onDelete(event.id, event.notificationId)}
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
    );
};

// ✅ Memoiza y compara solo event.id para re-render
export default React.memo(EventCard, (prevProps, nextProps) => {
    return prevProps.event.id === nextProps.event.id &&
        prevProps.event.completed === nextProps.event.completed;
});