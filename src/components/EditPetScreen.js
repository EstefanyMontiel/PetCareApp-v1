import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { petManagementService } from '../services/petServices';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/EditPetScreenStyles';

const EditPetScreen = ({ route, navigation }) => {
    const { petId, petData } = route.params;
    const { loadUserPets, user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Estados del formulario
    const [nombre, setNombre] = useState(petData.nombre || '');
    const [especie, setEspecie] = useState(petData.especie || '');
    const [raza, setRaza] = useState(petData.raza || '');
    const [genero, setGenero] = useState(petData.genero || '');
    const [peso, setPeso] = useState(petData.peso?.toString() || '');
    const [color, setColor] = useState(petData.color || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(
        petData.fechaNacimiento 
            ? (petData.fechaNacimiento.toDate ? petData.fechaNacimiento.toDate() : new Date(petData.fechaNacimiento))
            : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Validación
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!especie.trim()) {
            newErrors.especie = 'La especie es obligatoria';
        }

        if (!raza.trim()) {
            newErrors.raza = 'La raza es obligatoria';
        }

        if (!genero) {
            newErrors.genero = 'Selecciona el género';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                nombre: nombre.trim(),
                especie: especie.trim(),
                raza: raza.trim(),
                genero,
                peso: peso ? parseFloat(peso) : null,
                color: color.trim(),
                fechaNacimiento
            };

            await petManagementService.updatePet(petId, updateData);
            await loadUserPets(user.uid);

            Alert.alert(
                'Éxito',
                'Información actualizada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la información: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFechaNacimiento(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#262626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Mascota</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Imagen de la mascota */}
                {petData.imageUrl && (
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: petData.imageUrl }}
                            style={styles.petImage}
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* Formulario */}
                <View style={styles.form}>
                    {/* Nombre */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre *</Text>
                        <TextInput
                            style={[styles.input, errors.nombre && styles.inputError]}
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Nombre de tu mascota"
                            placeholderTextColor="#999"
                        />
                        {errors.nombre && (
                            <Text style={styles.errorText}>{errors.nombre}</Text>
                        )}
                    </View>

                    {/* Especie */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Especie *</Text>
                        <TextInput
                            style={[styles.input, errors.especie && styles.inputError]}
                            value={especie}
                            onChangeText={setEspecie}
                            placeholder="Ej: Perro, Gato, Conejo..."
                            placeholderTextColor="#999"
                        />
                        {errors.especie && (
                            <Text style={styles.errorText}>{errors.especie}</Text>
                        )}
                    </View>

                    {/* Raza */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Raza *</Text>
                        <TextInput
                            style={[styles.input, errors.raza && styles.inputError]}
                            value={raza}
                            onChangeText={setRaza}
                            placeholder="Raza de tu mascota"
                            placeholderTextColor="#999"
                        />
                        {errors.raza && (
                            <Text style={styles.errorText}>{errors.raza}</Text>
                        )}
                    </View>

                    {/* Género */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Género *</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    genero === 'macho' && styles.genderButtonActive
                                ]}
                                onPress={() => setGenero('macho')}
                            >
                                <Ionicons 
                                    name="male" 
                                    size={20} 
                                    color={genero === 'macho' ? '#fff' : '#4ECDC4'} 
                                />
                                <Text style={[
                                    styles.genderText,
                                    genero === 'macho' && styles.genderTextActive
                                ]}>
                                    Macho
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    genero === 'hembra' && styles.genderButtonActive
                                ]}
                                onPress={() => setGenero('hembra')}
                            >
                                <Ionicons 
                                    name="female" 
                                    size={20} 
                                    color={genero === 'hembra' ? '#fff' : '#FF6B6B'} 
                                />
                                <Text style={[
                                    styles.genderText,
                                    genero === 'hembra' && styles.genderTextActive
                                ]}>
                                    Hembra
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {errors.genero && (
                            <Text style={styles.errorText}>{errors.genero}</Text>
                        )}
                    </View>

                    {/* Fecha de Nacimiento */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TouchableOpacity 
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar" size={20} color="#4ECDC4" />
                            <Text style={styles.dateText}>{formatDate(fechaNacimiento)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={fechaNacimiento}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Peso */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Peso (kg)</Text>
                        <TextInput
                            style={styles.input}
                            value={peso}
                            onChangeText={setPeso}
                            placeholder="Peso en kilogramos"
                            placeholderTextColor="#999"
                            keyboardType="decimal-pad"
                        />
                    </View>

                    {/* Color */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Color</Text>
                        <TextInput
                            style={styles.input}
                            value={color}
                            onChangeText={setColor}
                            placeholder="Color del pelaje"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Botón Guardar */}
                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditPetScreen;