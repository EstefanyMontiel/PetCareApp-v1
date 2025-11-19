import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vaccinationService } from '../../services/vaccionationService';
import styles from '../../styles/HealthScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const VaccinationScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
    // Estados (solo para la lista)
    const [vaccinations, setVaccinations] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        loadVaccinations();
    }, []);

    // 📋 Cargar vacunaciones
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

    // 📅 Formatear fecha
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

    // 🗑️ Eliminar vacunación
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

    // ✅ NAVEGAR A LA PANTALLA DE FORMULARIO
    const handleAddVaccination = () => {
        navigation.navigate('AddVaccination', {
            petId,
            petName,
            petSpecies,
            onSuccess: loadVaccinations // Callback para recargar
        });
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
                
                {/* ✅ BOTÓN QUE NAVEGA A LA NUEVA PANTALLA */}
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddVaccination}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* ✅ SOLO LA LISTA (sin formulario) */}
            <KeyboardAwareForm style={styles.content}>
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
                    <View style={styles.emptyState}>
                        <Ionicons name="medkit-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>
                            Sin vacunaciones registradas
                        </Text>
                        <Text style={styles.emptyStateText}>
                            Agrega las vacunas de {petName} para llevar un control completo
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default VaccinationScreen;