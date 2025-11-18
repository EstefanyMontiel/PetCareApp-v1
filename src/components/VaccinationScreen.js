// ============================================
// 💉 VACCINATION SCREEN - VERSIÓN CORREGIDA
// ============================================
// ✅ Mantiene el modal original
// ✅ Solo cambia ScrollView por KeyboardAwareForm
// ✅ Problema del teclado resuelto

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from './DatePickerModal';
import { vaccinationService } from '../services/vaccionationService';
import styles from '../styles/VaccinationScreenStyles';
import ModernPicker from './ModernPicker';
import KeyboardAwareForm from './common/KeyboardAwareForm'; // ⬅️ AGREGADO


const VaccinationScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
    // Estados
    const [vaccinations, setVaccinations] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [applicationDate, setApplicationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVaccinePicker, setShowVaccinePicker] = useState(false);
    const [loadingList, setLoadingList] = useState(true);

    // 🔥 CATÁLOGO DE VACUNAS POR ESPECIE
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

    // Cargar vacunaciones al montar el componente
    useEffect(() => {
        loadVaccinations();
    }, []);

    // 📋 FUNCIÓN: Cargar vacunaciones desde Firebase
    const loadVaccinations = async () => {
        try {
            setLoadingList(true);
            const data = await vaccinationService.getVaccinations(petId);
            setVaccinations(data);
        } catch (error) {
            console.error('Error cargando vacunaciones:', error);
            Alert.alert('Error', 'No se pudieron cargar las vacunas');
        } finally {
            setLoadingList(false);
        }
    };

    // ✅ VALIDACIÓN: Obtener vacunas disponibles según la especie
    const getAvailableVaccines = () => {
        return vaccinesBySpecies[petSpecies] || vaccinesBySpecies['Perro'];
    };

    // 📅 FUNCIÓN: Formatear fecha
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

    // ✅ VALIDACIÓN: Validar formulario antes de guardar
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

    // 💾 FUNCIÓN: Guardar vacunación en Firebase
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
            await loadVaccinations();
            
            // Limpiar formulario
            setSelectedVaccine('');
            setApplicationDate(new Date());
            setDescription('');
            setShowAddForm(false);

            Alert.alert('✅ Éxito', 'Vacuna registrada correctamente');
        } catch (error) {
            console.error('Error al guardar vacuna:', error);
            Alert.alert('❌ Error', 'No se pudo guardar la vacuna');
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ FUNCIÓN: Eliminar vacunación
    const handleDeleteVaccination = (vaccinationId) => {
        Alert.alert(
            'Eliminar Vacuna',
            '¿Estás seguro de que deseas eliminar esta vacuna?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await vaccinationService.deleteVaccination(petId, vaccinationId);
                            await loadVaccinations();
                            Alert.alert('✅', 'Vacuna eliminada');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la vacuna');
                        }
                    }
                }
            ]
        );
    };

    // ❌ FUNCIÓN: Cancelar formulario
    const handleCancel = () => {
        setSelectedVaccine('');
        setApplicationDate(new Date());
        setDescription('');
        setShowAddForm(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>💉 Vacunación</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setShowAddForm(true)}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* ✅ CAMBIADO: ScrollView -> KeyboardAwareForm */}
            <KeyboardAwareForm style={styles.content}>
                {/* FORMULARIO DE NUEVA VACUNACIÓN */}
                {showAddForm && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Nueva Vacunación</Text>

                        {/* Selector de Vacuna */}
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

                        {/* Modal del Picker */}
                        <ModernPicker
                            visible={showVaccinePicker}
                            onClose={() => setShowVaccinePicker(false)}
                            items={getAvailableVaccines().filter(v => v.value !== '')}
                            onSelect={setSelectedVaccine}
                            selectedValue={selectedVaccine}
                            title={`Vacunas para ${petSpecies}`}
                            searchPlaceholder="Buscar vacuna..."
                        />

                        {/* Fecha de Aplicación */}
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

                        {/* ✅ Descripción - AHORA FUNCIONA CON TECLADO */}
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

                        {/* Botones de acción */}
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
                )}

                {/* LISTA DE VACUNACIONES */}
                {loadingList ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4ECDC4" />
                    </View>
                ) : vaccinations.length > 0 ? (
                    vaccinations.map((vaccination) => (
                        <View key={vaccination.id} style={styles.vaccinationCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="medical" size={24} color="#4ECDC4" />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.vaccineName}>
                                        {vaccination.vaccineName}
                                    </Text>
                                    <Text style={styles.vaccineDate}>
                                        📅 {formatDate(vaccination.applicationDate)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteVaccination(vaccination.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                            {vaccination.description && (
                                <Text style={styles.vaccineDescription}>
                                    {vaccination.description}
                                </Text>
                            )}
                        </View>
                    ))
                ) : (
                    !showAddForm && (
                        <View style={styles.emptyState}>
                            <Ionicons name="medkit-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyStateTitle}>
                                Sin vacunaciones registradas
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Agrega las vacunas de {petName} para llevar un control completo
                            </Text>
                        </View>
                    )
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default VaccinationScreen;