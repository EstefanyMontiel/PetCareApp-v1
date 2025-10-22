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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/PetRegisterStyles';
import KeyboardAvoidingContainer from './KeyboardAvoidingView';
import SafeContainer from './SafeContainer';
import Button from './Button';
    
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

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // ✅ Función de registro actualizada
    const handleRegister = async () => {
        // Validaciones
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
            // ✅ Usar la función addPet del contexto
            const petData = {
                nombre: petName.trim(),
                especie: selectedSpecies,
                raza: breed.trim(),
                fechaNacimiento: birthDate,
            };

            await addPet(petData);
            
            Alert.alert(
                '¡Mascota registrada correctamente!',
                `${petName} ha sido registrado exitosamente`,
                [{ 
                    text: 'Ver mis mascotas', 
                    onPress: () => {
                        // Limpiar campos
                        setPetName('');
                        setBreed('');
                        setBirthDate(new Date());
                        setSelectedSpecies('Perro');
                        
                        // ✅ Navegar a HomeScreen
                        navigation.navigate('Home');
                    }
                }]
            );
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            Alert.alert('Error al registrar mascota', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer>
            <KeyboardAvoidingContainer>
                <View style={styles.content}>
                <Text style={styles.labelTitle}>¡Registra a tu peludo!</Text>

                {/* Nombre de la Mascota */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de la mascota</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa el nombre de tu mascota"
                        value={petName}
                        onChangeText={setPetName}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Especie */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Especie</Text>
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
                                <Text
                                    style={[
                                        styles.speciesText,
                                        selectedSpecies === species && styles.speciesTextSelected
                                    ]}
                                >
                                    {species}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Raza */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raza</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa la raza de tu mascota"
                        value={breed}
                        onChangeText={setBreed}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Fecha de Nacimiento */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Fecha de nacimiento</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
                        <Text style={styles.dateText}>
                            {formatDate(birthDate)}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={birthDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            locale="es-ES"
                        />
                    )}
                </View>

                    {/* Botón Registrar */}
                    <Button
                        title="Registrar Mascota"
                        onPress={handleRegister}
                        disabled={loading}
                        loading={loading}
                    />

                    {/* Botón para saltar registro de mascota */}
                    <TouchableOpacity 
                        style={styles.link}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.linkText}>Registrar mascota más tarde</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingContainer>
        </SafeContainer>
    );
};

export default PetRegisterScreen;