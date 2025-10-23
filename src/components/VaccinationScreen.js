import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { vaccinationService } from '../services/vaccionationService';
import styles from '../styles/VaccinationScreenStyles'

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
        // Si la especie no existe en el catálogo, usar Perro por defecto
        return vaccinesBySpecies[petSpecies] || vaccinesBySpecies['Perro'];
    };

    // 📅 FUNCIÓN: Manejar cambio de fecha
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setApplicationDate(selectedDate);
        }
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
        // Validar que la fecha no sea futura
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
            // Obtener el nombre de la vacuna seleccionada
            const vaccineName = getAvailableVaccines().find(
                v => v.value === selectedVaccine
            )?.label;

            // Datos de la vacunación
            const vaccinationData = {
                vaccine: selectedVaccine,
                vaccineName: vaccineName,
                applicationDate: applicationDate,
                description: description.trim(),
                petSpecies: petSpecies // Guardar la especie para referencia
            };

            // Guardar en Firebase
            await vaccinationService.saveVaccination(petId, vaccinationData);

            // Recargar la lista
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
                <View style={styles.headerContent}>
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
            </View>

            <ScrollView style={styles.content}>
                {/* FORMULARIO DE NUEVA VACUNACIÓN */}
                {showAddForm && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Nueva Vacunación</Text>

                        {/* 1️⃣ SELECTOR DE VACUNA CON VALIDACIÓN POR ESPECIE */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>
                                Tipo de Vacuna *
                                <Text style={styles.speciesIndicator}>
                                    {' '}(Vacunas para {petSpecies})
                                </Text>
                            </Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedVaccine}
                                    onValueChange={(itemValue) => setSelectedVaccine(itemValue)}
                                    style={styles.picker}
                                >
                                    {getAvailableVaccines().map((vaccine) => (
                                        <Picker.Item 
                                            key={vaccine.value} 
                                            label={vaccine.label} 
                                            value={vaccine.value}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* 2️⃣ SELECTOR DE FECHA DE APLICACIÓN */}
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
                            <DateTimePicker
                                value={applicationDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                maximumDate={new Date()} // No permitir fechas futuras
                            />
                        )}

                        {/* 3️⃣ CAMPO DE DESCRIPCIÓN */}
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
            </ScrollView>
        </View>
    );
};

export default VaccinationScreen;