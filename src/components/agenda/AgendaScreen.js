// ============================================
// 🎯 AGENDA SCREEN - COMPONENTE PRINCIPAL REFACTORIZADO
// ============================================
// ✅ Solo orquesta componentes y hooks
// ✅ ~200 líneas vs ~790 líneas del original
// ✅ Performance optimizado con memoización

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

/**
 * Pantalla principal de la Agenda
 * Gestiona eventos, calendario y notificaciones de mascotas
 */
const AgendaScreen = () => {
    // ✅ Hook de eventos - maneja carga, filtrado y acciones
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

    // ✅ Hook del formulario - maneja estado y guardado
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
            {/* Header con botón de agregar */}
            <AgendaHeader onAddPress={openAddModal} />

            {/* ScrollView con scroll bloqueado cuando modal abierto */}
            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                scrollEnabled={!showAddModal} // ✅ FIX: Bloquea scroll cuando modal abierto
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