

import React from 'react';
import { ScrollView } from 'react-native';
import SafeContainer from '../SafeContainer';
import styles from '../../styles/AgendaScreenStyles';

// Hooks personalizados
import { useAgendaEvents } from './hooks/useAgendaEvents';
import { useEventForm } from './hooks/useEventForm';

// Componentes modulares
import AgendaHeader from './components/AgendaHeader';
import AgendaCalendar from './components/AgendaCalendar';
import EventList from './components/EventList';
import UpcomingEvents from './components/UpcomingEvents';
import AddEventModal from './components/AddEventModal';


const AgendaScreen = () => {
    const {
        events,
        markedDates,
        selectedDate,
        setSelectedDate,
        selectedDateEvents,
        loading,
        refreshEvents,
        handleToggleComplete,
        handleDeleteEvent,
    } = useAgendaEvents();

    const {
        formData,
        updateFormField,
        showAddModal,
        openAddModal,
        closeAddModal,
        handleSaveEvent,
        saving,
        userPets,
    } = useEventForm(selectedDate, refreshEvents);

    return (
        <SafeContainer style={styles.container}>
            <AgendaHeader onAddPress={openAddModal} />

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                scrollEnabled={!showAddModal} 
            >
                {/* Calendario con fechas marcadas */}
                <AgendaCalendar
                    markedDates={markedDates}
                    selectedDate={selectedDate}
                    onDayPress={setSelectedDate}
                />

                {/* Lista de eventos del día seleccionado */}
                <EventList
                    events={selectedDateEvents}
                    selectedDate={selectedDate}
                    onDelete={handleDeleteEvent}
                    onToggleComplete={handleToggleComplete}
                    onAddPress={openAddModal}
                />

                {/* Sección de próximos eventos */}
                <UpcomingEvents
                    events={events}
                    onEventPress={setSelectedDate}
                />
            </ScrollView>

            {/* Modal de agregar evento */}
            <AddEventModal
                visible={showAddModal}
                onClose={closeAddModal}
                onSave={handleSaveEvent}
                formData={formData}
                updateFormField={updateFormField}
                saving={saving}
                userPets={userPets}
            />
        </SafeContainer>
    );
};

export default AgendaScreen;