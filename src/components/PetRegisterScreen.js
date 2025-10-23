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
import { useAuth } from '../context/AuthContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/PetRegisterStyles';

const PetRegisterScreen = ({ navigation }) => {
    const { user, addPet } = useAuth();
    const [selectedSpecies, setSelectedSpecies] = useState('Perro');
    const [breed, setBreed] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [petName, setPetName] = useState('');
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

    const handleRegister = async () => {
        if (!petName.trim()) {
            Alert.alert('Error', 'El nombre de la mascota es requerido');
            return;
        }
        
        if (!breed.trim()) {
            Alert.alert('Error', 'La raza es requerida');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'Debes iniciar sesión para registrar una mascota');
            return;
        }

        setLoading(true);
        try {
            const petData = {
                nombre: petName.trim(),
                especie: selectedSpecies,
                raza: breed.trim(),
                fechaNacimiento: birthDate,
            };

            await addPet(petData);
            
            Alert.alert(
                '🎉 ¡Mascota registrada!',
                `${petName} ha sido agregado exitosamente`,
                [{ 
                    text: 'Ver mis mascotas', 
                    onPress: () => {
                        setPetName('');
                        setBreed('');
                        setBirthDate(new Date());
                        setSelectedSpecies('Perro');
                        navigation.navigate('Home');
                    }
                }]
            );
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer style={styles.container}>
            {/* Header minimalista */}

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
                    <Text style={styles.title}>¡Registra a tu peludo!</Text>
                    <Text style={styles.subtitle}>
                        Completa la información de tu nueva mascota
                    </Text>
                </View>

                {/* Nombre de la Mascota */}
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

                {/* Botón de Registro */}
                <TouchableOpacity
                    style={[styles.registerButton, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="add-circle" size={20} color="#fff" />
                            <Text style={styles.registerButtonText}>Registrar Mascota</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeContainer>
    );
};

export default PetRegisterScreen;