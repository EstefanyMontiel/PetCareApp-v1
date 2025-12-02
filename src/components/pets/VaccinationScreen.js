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
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/HealthScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const VaccinationScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    const { t, language } = useLanguage();
    
    // Estados (solo para la lista)
    const [vaccinations, setVaccinations] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        loadVaccinations();
    }, []);

    const loadVaccinations = async () => {
        try {
            setLoadingList(true);
            const data = await vaccinationService.getVaccinations(petId);
            setVaccinations(data);
        } catch (error) {
            console.error('Error cargando vacunaciones:', error);
            Alert.alert(t('common.error'), t('vaccination.loadError'));
        } finally {
            setLoadingList(false);
        }
    };

    // 📅 Formatear fecha
    const formatDate = (date) => {
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // 🗑️ Eliminar vacunación
    const handleDeleteVaccination = (vaccinationId) => {
        Alert.alert(
            t('vaccination.deleteTitle'),
            t('vaccination.deleteConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await vaccinationService.deleteVaccination(petId, vaccinationId);
                            await loadVaccinations();
                            Alert.alert(t('vaccination.deleted'));
                        } catch (error) {
                            Alert.alert(t('common.error'), t('vaccination.deleteError'));
                        }
                    }
                }
            ]
        );
    };

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
                    <Text style={styles.title}>💉 {t('vaccination.title')}</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddVaccination}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

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
                            {t('vaccination.noRecords')}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {t('vaccination.noRecordsSubtitle').replace('{petName}', petName)}
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default VaccinationScreen;