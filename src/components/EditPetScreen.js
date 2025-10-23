import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { db } from '../config/firebase';
import SafeContainer from './SafeContainer';
import styles from '../styles/PetRegisterStyles';

const EditPetScreen = ({ route, navigation }) => {
    const { petId, petData } = route.params;
    
    const [petName, setPetName] = useState(petData.nombre || '');
    const [selectedSpecies, setSelectedSpecies] = useState(petData.especie || 'Perro');
    const [breed, setBreed] = useState(petData.raza || '');
    const [birthDate, setBirthDate] = useState(
        petData.fechaNacimiento?.seconds 
            ? new Date(petData.fechaNacimiento.seconds * 1000) 
            : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const speciesOptions = ['Perro', 'Gato'];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleUpdate = async () => {
        // Validaciones
        if (!petName.trim()) {
            Alert.alert('Error', 'El nombre de la mascota es requerido');
            return;
        }
        
        if (!breed.trim()) {
            Alert.alert('Error', 'La raza es requerida');
            return;
        }

        setLoading(true);
        try {
            await db.collection('mascotas').doc(petId).update({
                nombre: petName.trim(),
                especie: selectedSpecies,
                raza: breed.trim(),
                fechaNacimiento: birthDate,
                updatedAt: new Date()
            });
            
            Alert.alert(
                '✅ Actualizado',
                `Los datos de ${petName} han sido actualizados`,
                [{ 
                    text: 'OK', 
                    onPress: () => navigation.goBack()
                }]
            );
        } catch (error) {
            console.error('Error actualizando mascota:', error);
            Alert.alert('Error', 'No se pudieron actualizar los datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Mascota</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Icono de mascota */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="paw" size={40} color="#4ECDC4" />
                    </View>
                    <Text style={styles.subtitle}>Actualiza la información</Text>
                </View>

                {/* Nombre */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de la mascota *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Max, Luna, Bella..."
                        value={petName}
                        onChangeText={setPetName}
                        placeholderTextColor="#BDC3C7"
                    />
                </View>

                {/* Especie */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Especie *</Text>
                    <View style={styles.speciesContainer}>
                        {speciesOptions.map((species) => (
                            <TouchableOpacity
                                key={species}
                                style={[
                                    styles.speciesButton,
                                    selectedSpecies === species && styles.speciesButtonSelected
                                ]}
                                onPress={() => setSelectedSpecies(species)}
                            >
                                <Ionicons 
                                    name={species === 'Perro' ? 'paw' : 'paw'} 
                                    size={22} 
                                    color={selectedSpecies === species ? '#4ECDC4' : '#95A5A6'}
                                />
                                <Text style={[
                                    styles.speciesText,
                                    selectedSpecies === species && styles.speciesTextSelected
                                ]}>
                                    {species}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Raza */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raza *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Golden Retriever, Mestizo..."
                        value={breed}
                        onChangeText={setBreed}
                        placeholderTextColor="#BDC3C7"
                    />
                </View>

                {/* Fecha de Nacimiento */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Fecha de nacimiento *</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
                        <Ionicons name="calendar-outline" size={20} color="#7F8C8D" />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={birthDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {/* Botones */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.buttonDisabled]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.registerButtonText}>Actualizar</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeContainer>
    );
};

export default EditPetScreen;