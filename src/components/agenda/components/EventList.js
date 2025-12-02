

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventCard from './EventCard';
import { useLanguage } from '../../../context/LanguageContext';
import styles from '../../../styles/AgendaScreenStyles';
import { formatDate } from '../../../utils/agenda/dateFormatters';

const EmptyState = React.memo(({ onAddPress }) => {
    const { t } = useLanguage();
    
    return (
        <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={56} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>
                {t('agenda.noEventsForDay')}
            </Text>
            <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={onAddPress}
            >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.emptyStateButtonText}>{t('agenda.addEvent')}</Text>
            </TouchableOpacity>
        </View>
    );
});

const EventList = ({ events, selectedDate, onDelete, onToggleComplete, onAddPress }) => {
    const { t } = useLanguage();
    
    const renderEventItem = useCallback(({ item }) => (
        <EventCard
            event={item}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
        />
    ), [onToggleComplete, onDelete]);

    const keyExtractor = useCallback((item) => item.id, []);

    if (!selectedDate) return null;

    return (
        <View style={styles.eventsSection}>
            <Text style={styles.eventsSectionTitle}>
                {events.length > 0
                    ? t('agenda.eventsFor').replace('{date}', formatDate(selectedDate))
                    : t('agenda.noEventsFor').replace('{date}', formatDate(selectedDate))}
            </Text>

            {events.length > 0 ? (
                <FlatList
                    data={events}
                    renderItem={renderEventItem}
                    keyExtractor={keyExtractor}
                    scrollEnabled={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                />
            ) : (
                <EmptyState onAddPress={onAddPress} />
            )}
        </View>
    );
};

export default React.memo(EventList);