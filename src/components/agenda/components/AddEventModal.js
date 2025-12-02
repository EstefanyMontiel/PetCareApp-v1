// ============================================
// ➕ ADD EVENT MODAL COMPONENT
// ============================================
// ✅ Modal del formulario separado y optimizado

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import styles from '../../../styles/AgendaScreenStyles';
import DatePickerModal from '../../DatePickerModal';
import TimePickerModal from '../../TimePickerModal';
import { EVENT_TYPES, getEventColor } from '../../../utils/agenda/eventHelpers';
import { formatDate, formatTime } from '../../../utils/agenda/dateFormatters';

const AddEventModal = ({
    visible,
    onClose,
    onSave,
    formData,
    updateFormField,
    saving,
    userPets,
}) => {
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
            backdropOpacity={0.7} 
            coverScreen={true} 
            useNativeDriver={true}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            propagateSwipe={true} 
            avoidKeyboard={true} 

        >
            <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nuevo Evento</Text>
                    <TouchableOpacity 
                        onPress={onClose}
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
                            {EVENT_TYPES.map((item) => (
                                <TouchableOpacity
                                    key={item.type}
                                    style={[
                                        styles.typeButton,
                                        formData.eventType === item.type && [
                                            styles.typeButtonActive,
                                            { backgroundColor: getEventColor(item.type) }
                                        ],
                                    ]}
                                    onPress={() => updateFormField('eventType', item.type)}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={18}
                                        color={
                                            formData.eventType === item.type
                                                ? '#fff'
                                                : getEventColor(item.type)
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            formData.eventType === item.type && styles.typeButtonTextActive,
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
                            value={formData.eventTitle}
                            onChangeText={(text) => updateFormField('eventTitle', text)}
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
                                        formData.selectedPet === '' && styles.petButtonActive,
                                    ]}
                                    onPress={() => updateFormField('selectedPet', '')}
                                >
                                    <Text
                                        style={[
                                            styles.petButtonText,
                                            formData.selectedPet === '' && styles.petButtonTextActive,
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
                                            formData.selectedPet === pet.id && styles.petButtonActive,
                                        ]}
                                        onPress={() => updateFormField('selectedPet', pet.id)}
                                    >
                                        <Ionicons 
                                            name="paw" 
                                            size={12} 
                                            color={formData.selectedPet === pet.id ? '#fff' : '#4ECDC4'} 
                                        />
                                        <Text
                                            style={[
                                                styles.petButtonText,
                                                formData.selectedPet === pet.id && styles.petButtonTextActive,
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

                    {/* Fecha */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>📅 Fecha *</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => updateFormField('showDatePicker', true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {formatDate(formData.eventDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={22} color="#4ECDC4" />
                        </TouchableOpacity>
                    </View>

                    <DatePickerModal
                        visible={formData.showDatePicker}
                        onClose={() => updateFormField('showDatePicker', false)}
                        onSelect={(date) => updateFormField('eventDate', date)}
                        selectedDate={formData.eventDate}
                        minimumDate={new Date()}
                    />

                    {/* Hora */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>🕐 Hora *</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => updateFormField('showTimePicker', true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {formatTime(formData.eventTime)}
                            </Text>
                            <Ionicons name="time-outline" size={22} color="#4ECDC4" />
                        </TouchableOpacity>
                    </View>

                    <TimePickerModal
                        visible={formData.showTimePicker}
                        onClose={() => updateFormField('showTimePicker', false)}
                        onSelect={(time) => updateFormField('eventTime', time)}
                        selectedTime={formData.eventTime}
                        is24Hour={false}
                    />

                    {/* Descripción */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>📝 Descripción (Opcional)</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Agrega detalles adicionales..."
                            value={formData.eventDescription}
                            onChangeText={(text) => updateFormField('eventDescription', text)}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#BDC3C7"
                        />
                    </View>

                    {/* Notificación */}
                    <TouchableOpacity
                        style={[
                            styles.notificationToggle,
                            formData.sendNotification && styles.notificationToggleActive
                        ]}
                        onPress={() => updateFormField('sendNotification', !formData.sendNotification)}
                    >
                        <View style={styles.notificationLeft}>
                            <Ionicons
                                name={formData.sendNotification ? 'notifications' : 'notifications-off'}
                                size={24}
                                color={formData.sendNotification ? '#4ECDC4' : '#BDC3C7'}
                            />
                            <Text style={[
                                styles.notificationText,
                                formData.sendNotification && styles.notificationTextActive
                            ]}>
                                Enviar recordatorio
                            </Text>
                        </View>
                        <View style={[
                            styles.toggleSwitch,
                            formData.sendNotification && styles.toggleSwitchActive
                        ]}>
                            <View style={[
                                styles.toggleCircle,
                                formData.sendNotification && styles.toggleCircleActive
                            ]} />
                        </View>
                    </TouchableOpacity>

                    {/* Botones */}
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={saving}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.buttonDisabled]}
                            onPress={onSave}
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
    );
};

export default React.memo(AddEventModal);