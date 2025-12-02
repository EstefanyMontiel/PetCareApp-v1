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
import styles from '../../styles/DewormingScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const DewormingScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
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
            Alert.alert('Error', 'No se pudieron cargar las desparasitaciones');
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
        if (!date) return 'No establecida';
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Eliminar desparasitación
    const handleDeleteDeworming = (dewormingId) => {
        Alert.alert(
            'Eliminar Desparasitación',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dewormingService.deleteDeworming(petId, dewormingId);
                            await loadDewormings();
                            Alert.alert('✅', 'Desparasitación eliminada');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar');
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
                    <Text style={styles.title}> Desparasitación</Text>
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
                                            {deworming.productType === 'interno' ? '🦠 Interna' : '🛡️ Externa'}
                                        </Text>
                                    </View>
                                    <Text style={styles.productName}>{deworming.productName}</Text>
                                    <Text style={styles.date}>
                                        📅 {formatDate(deworming.applicationDate)}
                                    </Text>
                                    {deworming.nextDoseDate && (
                                        <Text style={styles.nextDose}>
                                            🔔 Próxima: {formatDate(deworming.nextDoseDate)}
                                        </Text>
                                    )}
                                    {deworming.weight && (
                                        <Text style={styles.details}>
                                            ⚖️ Peso: {deworming.weight} kg
                                        </Text>
                                    )}
                                    {deworming.dose && (
                                        <Text style={styles.details}>
                                            💊 Dosis: {deworming.dose}
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
                            Sin desparasitaciones registradas
                        </Text>
                        <Text style={styles.emptyStateText}>
                            Mantén un registro de las desparasitaciones de {petName}
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default DewormingScreen;