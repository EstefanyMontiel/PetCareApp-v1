import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from '../DatePickerModal';
import ModernPicker from '../ModernPicker';
import { vaccinationService } from '../../services/vaccionationService';
import styles from '../../styles/HealthScreenStyles'; // ✅ MISMO ESTILO
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const AddVaccinationScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies, onSuccess } = route.params;
    
    // Estados (exactamente igual que antes)
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVaccinePicker, setShowVaccinePicker] = useState(false);

    // 🔥 CATÁLOGO DE VACUNAS (exactamente igual)
    const vaccinesBySpecies = {
        'Perro': [
            { label: 'Seleccionar vacuna...', value: '' },
            { label: 'Parvovirus', value: 'parvovirus' },
            { label: 'Moquillo', value: 'moquillo' },
            { label: 'Rabia', value: 'rabia' },
            { label: 'Hepatitis Canina', value: 'hepatitis' },
            { label: 'Leptospirosis', value: 'leptospirosis' },
            { label: 'Bordetella (Tos de las perreras)', value: 'bordetella' },
            { label: 'Polivalente (DHPPL)', value: 'polivalente' },
            { label: 'Coronavirus Canino', value: 'coronavirus' }
        ],
        'Gato': [
            { label: 'Seleccionar vacuna...', value: '' },
            { label: 'Triple Felina (FVRCP)', value: 'triple_felina' },
            { label: 'Rabia', value: 'rabia' },
            { label: 'Leucemia Felina (FeLV)', value: 'leucemia' },
            { label: 'Panleucopenia Felina', value: 'panleucopenia' },
            { label: 'Rinotraqueitis Felina', value: 'rinotraqueitis' },
            { label: 'Calicivirus Felino', value: 'calicivirus' },
            { label: 'Clamidiosis Felina', value: 'clamidiosis' }
        ]
    };

    const getAvailableVaccines = () => {
        return vaccinesBySpecies[petSpecies] || vaccinesBySpecies['Perro'];
    };

    const formatDate = (date) => {
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const validateForm = () => {
        if (!selectedVaccine) {
            Alert.alert('Error', 'Por favor selecciona una vacuna');
            return false;
        }
        if (!applicationDate) {
            Alert.alert('Error', 'Por favor selecciona la fecha de aplicación');
            return false;
        }
        if (applicationDate > new Date()) {
            Alert.alert('Error', 'La fecha de aplicación no puede ser futura');
            return false;
        }
        return true;
    };

    const handleSaveVaccination = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const vaccineName = getAvailableVaccines().find(
                v => v.value === selectedVaccine
            )?.label;

            const vaccinationData = {
                vaccine: selectedVaccine,
                vaccineName: vaccineName,
                applicationDate: applicationDate,
                description: description.trim(),
                petSpecies: petSpecies
            };

            await vaccinationService.saveVaccination(petId, vaccinationData);
            
            Alert.alert('✅ Éxito', 'Vacuna registrada correctamente', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onSuccess) onSuccess(); // Recargar la lista
                        navigation.goBack(); // Volver a la pantalla anterior
                    }
                }
            ]);
        } catch (error) {
            console.error('Error al guardar vacuna:', error);
            Alert.alert('❌ Error', 'No se pudo guardar la vacuna');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* ✅ HEADER IGUAL AL ORIGINAL */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleCancel}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>💉 Nueva Vacunación</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                {/* Botón de guardar en lugar de agregar */}
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleSaveVaccination}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons name="checkmark" size={28} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>

            {/* ✅ FORMULARIO CON EL MISMO ESTILO */}
            <KeyboardAwareForm style={styles.content}>
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Información de la Vacuna</Text>

                    {/* Selector de Vacuna (IGUAL) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Tipo de Vacuna *
                            <Text style={styles.speciesIndicator}>
                                {' '}(Vacunas para {petSpecies})
                            </Text>
                        </Text>
                        <TouchableOpacity
                            style={styles.modernPickerButton}
                            onPress={() => setShowVaccinePicker(true)}
                        >
                            <Text style={[
                                styles.modernPickerText,
                                !selectedVaccine && styles.modernPickerPlaceholder
                            ]}>
                                {selectedVaccine 
                                    ? getAvailableVaccines().find(v => v.value === selectedVaccine)?.label 
                                    : 'Seleccionar vacuna...'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Modal del Picker (IGUAL) */}
                    <ModernPicker
                        visible={showVaccinePicker}
                        onClose={() => setShowVaccinePicker(false)}
                        items={getAvailableVaccines().filter(v => v.value !== '')}
                        onSelect={setSelectedVaccine}
                        selectedValue={selectedVaccine}
                        title={`Vacunas para ${petSpecies}`}
                        searchPlaceholder="Buscar vacuna..."
                    />

                    {/* Fecha de Aplicación (IGUAL) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha de Aplicación *</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {formatDate(applicationDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DatePickerModal
                            visible={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                            onSelect={(date) => setApplicationDate(date)}
                            selectedDate={applicationDate}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Descripción (IGUAL) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Descripción (Opcional)</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Ej: Primera dosis, refuerzo anual, veterinaria ABC..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                            textAlignVertical="top"
                        />
                        <Text style={styles.characterCount}>
                            {description.length}/500
                        </Text>
                    </View>

                    {/* Botones de acción (IGUAL) */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.buttonDisabled]}
                            onPress={handleSaveVaccination}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareForm>
        </View>
    );
};

export default AddVaccinationScreen;