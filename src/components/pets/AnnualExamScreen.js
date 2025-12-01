import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { annualExamService } from '../../services/annualExamService';
import styles from '../../styles/AnnualExamScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const AnnualExamScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
    // ✅ SOLO ESTADOS DE LA LISTA
    const [exams, setExams] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    // Cargar exámenes
    const loadExams = async () => {
        try {
            setLoadingList(true);
            const data = await annualExamService.getExams(petId);
            setExams(data);
        } catch (error) {
            console.error('Error cargando exámenes:', error);
            Alert.alert('Error', 'No se pudieron cargar los exámenes');
        } finally {
            setLoadingList(false);
        }
    };

    // ✅ NAVEGAR A LA PANTALLA DE FORMULARIO
    const handleAddExam = () => {
        navigation.navigate('AddAnnualExam', {
            petId,
            petName,
            petSpecies,
            onSuccess: loadExams
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

    // Funciones de condición
    const getConditionColor = (condition) => {
        switch(condition) {
            case 'excelente': return '#4CAF50';
            case 'bueno': return '#8BC34A';
            case 'regular': return '#FF9800';
            case 'preocupante': return '#FF6B6B';
            default: return '#999';
        }
    };

    const getConditionLabel = (condition) => {
        switch(condition) {
            case 'excelente': return '✨ Excelente';
            case 'bueno': return '👍 Bueno';
            case 'regular': return '⚠️ Regular';
            case 'preocupante': return '🚨 Preocupante';
            default: return condition;
        }
    };

    // Eliminar examen
    const handleDeleteExam = (examId) => {
        Alert.alert(
            'Eliminar Examen',
            '¿Estás seguro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await annualExamService.deleteExam(petId, examId);
                            await loadExams();
                            Alert.alert('✅', 'Examen eliminado');
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
                    <Text style={styles.title}>Examen Anual</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                {/* ✅ BOTÓN QUE NAVEGA A LA NUEVA PANTALLA */}
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddExam}
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
                ) : exams.length > 0 ? (
                    exams.map((exam) => (
                        <View key={exam.id} style={styles.examCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="clipboard" size={24} color="#3498DB" />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.examDate}>
                                        {formatDate(exam.examDate)}
                                    </Text>
                                    {exam.clinic && (
                                        <Text style={styles.clinic}>🏥 {exam.clinic}</Text>
                                    )}
                                    {exam.veterinarian && (
                                        <Text style={styles.veterinarian}>
                                            👨‍⚕️ Dr. {exam.veterinarian}
                                        </Text>
                                    )}
                                    <View style={[
                                        styles.conditionBadge,
                                        { backgroundColor: getConditionColor(exam.generalCondition) }
                                    ]}>
                                        <Text style={styles.conditionBadgeText}>
                                            {getConditionLabel(exam.generalCondition)}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteExam(exam.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>

                            {/* Detalles expandibles */}
                            {exam.weight && (
                                <Text style={styles.detail}>⚖️ Peso: {exam.weight} kg</Text>
                            )}
                            {exam.temperature && (
                                <Text style={styles.detail}>🌡️ Temperatura: {exam.temperature}°C</Text>
                            )}
                            {exam.findings && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>Hallazgos:</Text>
                                    <Text style={styles.detailText}>{exam.findings}</Text>
                                </View>
                            )}
                            {exam.recommendations && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>Recomendaciones:</Text>
                                    <Text style={styles.detailText}>{exam.recommendations}</Text>
                                </View>
                            )}
                            {exam.nextExamDate && (
                                <Text style={styles.nextExam}>
                                    🔔 Próximo examen: {formatDate(exam.nextExamDate)}
                                </Text>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="clipboard-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>
                            Sin exámenes anuales registrados
                        </Text>
                        <Text style={styles.emptyStateText}>
                            Registra los chequeos anuales de {petName} para un control completo de su salud
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default AnnualExamScreen;