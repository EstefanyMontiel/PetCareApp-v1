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
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/AnnualExamScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const AnnualExamScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    const { t, language } = useLanguage();
    
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
            Alert.alert(t('common.error'), t('annualExam.loadError'));
        } finally {
            setLoadingList(false);
        }
    };

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
        if (!date) return t('common.notSet');
        const dateObj = date?.seconds 
            ? new Date(date.seconds * 1000) 
            : new Date(date);
        
        return dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
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
            case 'excelente': return `✨ ${t('annualExam.excellent')}`;
            case 'bueno': return `👍 ${t('annualExam.good')}`;
            case 'regular': return `⚠️ ${t('annualExam.regular')}`;
            case 'preocupante': return `🚨 ${t('annualExam.concerning')}`;
            default: return condition;
        }
    };

    // Eliminar examen
    const handleDeleteExam = (examId) => {
        Alert.alert(
            t('annualExam.deleteTitle'),
            t('annualExam.deleteConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await annualExamService.deleteExam(petId, examId);
                            await loadExams();
                            Alert.alert('✅', t('annualExam.deleted'));
                        } catch (error) {
                            Alert.alert(t('common.error'), t('annualExam.deleteError'));
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
                    <Text style={styles.title}>{t('annualExam.title')}</Text>
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
                                <Text style={styles.detail}>⚖️ {t('annualExam.weight')}: {exam.weight} kg</Text>
                            )}
                            {exam.temperature && (
                                <Text style={styles.detail}>🌡️ {t('annualExam.temperature')}: {exam.temperature}°C</Text>
                            )}
                            {exam.findings && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>{t('annualExam.findings')}:</Text>
                                    <Text style={styles.detailText}>{exam.findings}</Text>
                                </View>
                            )}
                            {exam.recommendations && (
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailTitle}>{t('annualExam.recommendations')}:</Text>
                                    <Text style={styles.detailText}>{exam.recommendations}</Text>
                                </View>
                            )}
                            {exam.nextExamDate && (
                                <Text style={styles.nextExam}>
                                    🔔 {t('annualExam.nextExam')}: {formatDate(exam.nextExamDate)}
                                </Text>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="clipboard-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>
                            {t('annualExam.noRecords')}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {t('annualExam.noRecordsSubtitle').replace('{petName}', petName)}
                        </Text>
                    </View>
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default AnnualExamScreen;