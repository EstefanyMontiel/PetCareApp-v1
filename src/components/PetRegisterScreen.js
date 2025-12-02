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
import { useLanguage } from '../context/LanguageContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/PetRegisterStyles';

const PetRegisterScreen = ({ navigation }) => {
    const { user, addPet } = useAuth();
    const { t, language } = useLanguage();
    const [selectedSpecies, setSelectedSpecies] = useState('Perro');
    const [breed, setBreed] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [petName, setPetName] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // ✅ NUEVO: Estado para el género
    const [gender, setGender] = useState('');

    const speciesOptions = [
        { key: 'Perro', label: t('petRegister.dog') },
        { key: 'Gato', label: t('petRegister.cat') }
    ];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBirthDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleRegister = async () => {
        // Validaciones
        if (!petName.trim()) {
            Alert.alert(t('common.error'), t('petRegister.nameRequired'));
            return;
        }
        
        if (!breed.trim()) {
            Alert.alert(t('common.error'), t('petRegister.breedRequired'));
            return;
        }

        // ✅ NUEVO: Validar género
        if (!gender) {
            Alert.alert(t('common.error'), t('petRegister.sexRequired'));
            return;
        }

        if (!user) {
            Alert.alert(t('common.error'), t('petRegister.loginRequired'));
            return;
        }

        setLoading(true);
        try {
            const petData = {
                nombre: petName.trim(),
                especie: selectedSpecies,
                raza: breed.trim(),
                fechaNacimiento: birthDate,
                genero: gender, // ✅ NUEVO: Agregar género
            };

            console.log('📝 Datos a registrar:', petData);

            await addPet(petData);
            
            Alert.alert(
                t('petRegister.success'),
                t('petRegister.successMessage').replace('{petName}', petName),
                [{ 
                    text: t('petRegister.viewPets'), 
                    onPress: () => {
                        // Limpiar formulario
                        setPetName('');
                        setBreed('');
                        setBirthDate(new Date());
                        setSelectedSpecies('Perro');
                        setGender(''); // ✅ NUEVO: Limpiar género
                        navigation.navigate('MainTabs', { screen: 'Home' });
                    }
                }]
            );
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            Alert.alert(t('common.error'), error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer style={styles.container}>
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
                    <Text style={styles.title}>{t('petRegister.title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('petRegister.subtitle')}
                    </Text>
                </View>

                {/* Nombre de la Mascota */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('petRegister.petName')} *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('petRegister.petNamePlaceholder')}
                        value={petName}
                        onChangeText={setPetName}
                        placeholderTextColor="#BDC3C7"
                    />
                </View>

                {/* Especie */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('petRegister.species')} *</Text>
                    <View style={styles.speciesContainer}>
                        {speciesOptions.map((species) => (
                            <TouchableOpacity
                                key={species.key}
                                style={[
                                    styles.speciesButton,
                                    selectedSpecies === species.key && styles.speciesButtonSelected
                                ]}
                                onPress={() => setSelectedSpecies(species.key)}
                            >
                                <Ionicons 
                                    name={species.key === 'Perro' ? 'paw' : 'paw'} 
                                    size={22} 
                                    color={selectedSpecies === species.key ? '#4ECDC4' : '#95A5A6'}
                                />
                                <Text style={[
                                    styles.speciesText,
                                    selectedSpecies === species.key && styles.speciesTextSelected
                                ]}>
                                    {species.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

               {/* ✅ ACTUALIZADO: Selector de Género - Más compacto */}
<View style={styles.inputContainer}>
    <Text style={styles.label}>{t('petRegister.sex')} *</Text>
    <View style={styles.genderContainer}>
        <TouchableOpacity
            style={[
                styles.genderButton,
                gender === 'macho' && styles.genderButtonMaleActive
            ]}
            onPress={() => setGender('macho')}
        >
            <View style={[
                styles.genderIconCircle,
                gender === 'macho' && styles.genderIconCircleMaleActive
            ]}>
                <Ionicons 
                    name="male" 
                    size={18} // ← Reducido de 24 a 18
                    color={gender === 'macho' ? '#fff' : '#3498DB'}
                />
            </View>
            <Text style={[
                styles.genderText,
                gender === 'macho' && styles.genderTextActive
            ]}>
                {t('petRegister.male')}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.genderButton,
                gender === 'hembra' && styles.genderButtonFemaleActive
            ]}
            onPress={() => setGender('hembra')}
        >
            <View style={[
                styles.genderIconCircle,
                gender === 'hembra' && styles.genderIconCircleFemaleActive
            ]}>
                <Ionicons 
                    name="female" 
                    size={18} // ← Reducido de 24 a 18
                    color={gender === 'hembra' ? '#fff' : '#E74C3C'}
                />
            </View>
            <Text style={[
                styles.genderText,
                gender === 'hembra' && styles.genderTextActive
            ]}>
                {t('petRegister.female')}
            </Text>
        </TouchableOpacity>
    </View>
</View>

                {/* Raza */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('petRegister.breed')} *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('petRegister.breedPlaceholder')}
                        value={breed}
                        onChangeText={setBreed}
                        placeholderTextColor="#BDC3C7"
                    />
                </View>

                {/* Fecha de Nacimiento */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('petRegister.birthDate')} *</Text>
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
                            <Text style={styles.registerButtonText}>{t('petRegister.registerButton')}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeContainer>
    );
};

export default PetRegisterScreen;