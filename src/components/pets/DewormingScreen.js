import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dewormingService } from '../../services/dewormingService';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/DewormingScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const DewormingScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    const { t, language } = useLanguage();
    
    const [dewormings, setDewormings] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        loadDewormings();
    }, []);

    // Cargar desparasitaciones
    const loadDewormings = async () => {
        try {
            setLoadingList(true);
            const data = await dewormingService.getDewormings(petId);
            setDewormings(data);
        } catch (error) {
            console.error('Error cargando desparasitaciones:', error);
            Alert.alert(t('common.error'), t('deworming.loadError'));
        } finally {
            setLoadingList(false);
        }
    };

    const handleAddDeworming = () => {
        navigation.navigate('AddDeworming', {
            petId,
            petName,
            petSpecies,
            onSuccess: loadDewormings
        });
    };

    // Formatear fecha
    const formatDate = (date) => {
        if (!date) return language === 'es' ? 'No establecida' : 'Not set';
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Eliminar desparasitación
    const handleDeleteDeworming = (dewormingId) => {
        Alert.alert(
            t('deworming.deleteTitle'),
            t('deworming.deleteConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dewormingService.deleteDeworming(petId, dewormingId);
                            await loadDewormings();
                            Alert.alert('✅', t('deworming.deleted'));
                        } catch (error) {
                            Alert.alert(t('common.error'), t('deworming.deleteError'));
                        }
                    }
                }
            ]
        );
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
                    <Text style={styles.title}> {t('deworming.title')}</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddDeworming}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <KeyboardAwareForm style={styles.content}>
                {loadingList ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4ECDC4" />
                    </View>
                ) : dewormings.length > 0 ? (
                    dewormings.map((deworming) => (
                        <View key={deworming.id} style={styles.dewormingCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons 
                                    name={deworming.productType === 'interno' ? 'bug' : 'shield-checkmark'} 
                                    size={24} 
                                    color="#4ECDC4" 
                                />
                                <View style={styles.cardInfo}>
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText}>
                                            {deworming.productType === 'interno' ? `🦠 ${t('deworming.internal')}` : `🛡️ ${t('deworming.external')}`}
                                        </Text>
                                    </View>
                                    <Text style={styles.productName}>{deworming.productName}</Text>
                                    <Text style={styles.date}>
                                        📅 {formatDate(deworming.applicationDate)}
                                    </Text>
                                    {deworming.nextDoseDate && (
                                        <Text style={styles.nextDose}>
                                            🔔 {t('deworming.nextDose')}: {formatDate(deworming.nextDoseDate)}
                                        </Text>
                                    )}
                                    {deworming.weight && (
                                        <Text style={styles.details}>
                                            ⚖️ {t('deworming.weight')}: {deworming.weight} kg
                                        </Text>
                                    )}
                                    {deworming.dose && (
                                        <Text style={styles.details}>
                                            💊 {t('deworming.dose')}: {deworming.dose}
                                        </Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteDeworming(deworming.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                            {deworming.description && (
                                <Text style={styles.description}>{deworming.description}</Text>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="bug-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>
                            {t('deworming.noRecords')}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {t('deworming.noRecordsSubtitle').replace('{petName}', petName)}
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default DewormingScreen;