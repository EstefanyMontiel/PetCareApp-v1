import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from './DatePickerModal';
import { annualExamService } from '../services/annualExamService';
import styles from '../styles/AnnualExamScreenStyles';
import KeyboardAwareForm from './common/KeyboardAwareForm';


const AnnualExamScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies } = route.params;
    
    // Estados
    const [exams, setExams] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [examDate, setExamDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [veterinarian, setVeterinarian] = useState('');
    const [clinic, setClinic] = useState('');
    const [weight, setWeight] = useState('');
    const [temperature, setTemperature] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    
    // Resultados de exámenes
    const [bloodTest, setBloodTest] = useState('');
    const [urineTest, setUrineTest] = useState('');
    const [fecalTest, setFecalTest] = useState('');
    const [dentalExam, setDentalExam] = useState('');
    
    // Estado general
    const [generalCondition, setGeneralCondition] = useState('excelente');
    const [findings, setFindings] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [nextExamDate, setNextExamDate] = useState(null);
    const [showNextExamPicker, setShowNextExamPicker] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

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

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setExamDate(selectedDate);
        }
    };

    const handleNextExamChange = (event, selectedDate) => {
        setShowNextExamPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setNextExamDate(selectedDate);
        }
    };

    const validateForm = () => {
        if (!examDate) {
            Alert.alert('Error', 'Selecciona la fecha del examen');
            return false;
        }
        if (examDate > new Date()) {
            Alert.alert('Error', 'La fecha del examen no puede ser futura');
            return false;
        }
        return true;
    };

    const handleSaveExam = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const examData = {
                examDate: examDate,
                veterinarian: veterinarian.trim(),
                clinic: clinic.trim(),
                weight: weight ? parseFloat(weight) : null,
                temperature: temperature.trim(),
                heartRate: heartRate.trim(),
                bloodPressure: bloodPressure.trim(),
                bloodTest: bloodTest.trim(),
                urineTest: urineTest.trim(),
                fecalTest: fecalTest.trim(),
                dentalExam: dentalExam.trim(),
                generalCondition: generalCondition,
                findings: findings.trim(),
                recommendations: recommendations.trim(),
                nextExamDate: nextExamDate,
                petSpecies: petSpecies
            };

            await annualExamService.saveExam(petId, examData);
            await loadExams();
            
            // Limpiar formulario
            clearForm();
            setShowAddForm(false);

            Alert.alert('✅ Éxito', 'Examen anual registrado correctamente');
        } catch (error) {
            console.error('Error al guardar:', error);
            Alert.alert('❌ Error', 'No se pudo guardar el examen');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setExamDate(new Date());
        setVeterinarian('');
        setClinic('');
        setWeight('');
        setTemperature('');
        setHeartRate('');
        setBloodPressure('');
        setBloodTest('');
        setUrineTest('');
        setFecalTest('');
        setDentalExam('');
        setGeneralCondition('excelente');
        setFindings('');
        setRecommendations('');
        setNextExamDate(null);
    };

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

    const handleCancel = () => {
        clearForm();
        setShowAddForm(false);
    };

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

    return (
        <View style={styles.container}>
            {/* Header */}
         {/* Header Mejorado con Gradiente */}
<View style={styles.header}>
    <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
    >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
    </TouchableOpacity>
    
    <View style={styles.headerInfo}>
        <Text style={styles.title}> Examen Anual</Text>
        <Text style={styles.petName}>{petName}</Text>
    </View>
    
    <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddForm(true)}
    >
        <Ionicons name="add" size={28} color="#FFFFFF" />
    </TouchableOpacity>
</View>


<KeyboardAwareForm style={styles.content}>
                {/* FORMULARIO */}
                {showAddForm && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Nuevo Examen Anual</Text>

                        {/* Fecha del Examen */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Fecha del Examen *</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatDate(examDate)}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                        
                        <DatePickerModal
                            visible={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                            onSelect={(date) => setExamDate(date)}
                            selectedDate={examDate}
                        />
                        )}

                        {/* Veterinario y Clínica */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Veterinario</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del veterinario"
                                value={veterinarian}
                                onChangeText={setVeterinarian}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Clínica/Hospital</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la clínica"
                                value={clinic}
                                onChangeText={setClinic}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>📊 Signos Vitales</Text>

                        {/* Peso y Temperatura */}
                        <View style={styles.rowContainer}>
                            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Peso (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="5.5"
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="decimal-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <Text style={styles.label}>Temperatura (°C)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="38.5"
                                    value={temperature}
                                    onChangeText={setTemperature}
                                    keyboardType="decimal-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Frecuencia Cardíaca y Presión */}
                        <View style={styles.rowContainer}>
                            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Frecuencia Cardíaca</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="120 bpm"
                                    value={heartRate}
                                    onChangeText={setHeartRate}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <Text style={styles.label}>Presión Arterial</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="120/80"
                                    value={bloodPressure}
                                    onChangeText={setBloodPressure}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>🔬 Resultados de Laboratorio</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Análisis de Sangre</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Resultados del examen de sangre..."
                                value={bloodTest}
                                onChangeText={setBloodTest}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Análisis de Orina</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Resultados del examen de orina..."
                                value={urineTest}
                                onChangeText={setUrineTest}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Examen Coprológico</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Resultados del examen fecal..."
                                value={fecalTest}
                                onChangeText={setFecalTest}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Examen Dental</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Estado de dientes y encías..."
                                value={dentalExam}
                                onChangeText={setDentalExam}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#999"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>🏥 Evaluación General</Text>

                        {/* Estado General */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Estado General *</Text>
                            <View style={styles.conditionContainer}>
                                {['excelente', 'bueno', 'regular', 'preocupante'].map((condition) => (
                                    <TouchableOpacity
                                        key={condition}
                                        style={[
                                            styles.conditionButton,
                                            generalCondition === condition && {
                                                backgroundColor: getConditionColor(condition),
                                                borderColor: getConditionColor(condition),
                                            }
                                        ]}
                                        onPress={() => setGeneralCondition(condition)}
                                    >
                                        <Text style={[
                                            styles.conditionButtonText,
                                            generalCondition === condition && styles.conditionButtonTextActive
                                        ]}>
                                            {getConditionLabel(condition)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Hallazgos */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Hallazgos Importantes</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Cualquier hallazgo relevante encontrado durante el examen..."
                                value={findings}
                                onChangeText={setFindings}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Recomendaciones */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Recomendaciones del Veterinario</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Tratamientos, cambios en dieta, medicamentos recomendados..."
                                value={recommendations}
                                onChangeText={setRecommendations}
                                multiline
                                numberOfLines={4}
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Próximo Examen */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Próximo Examen Anual</Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowNextExamPicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatDate(nextExamDate)}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {showNextExamPicker && (
                            <DateTimePicker
                                value={nextExamDate || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleNextExamChange}
                                minimumDate={new Date()}
                            />
                        )}

                        {/* Botones */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, loading && styles.buttonDisabled]}
                                onPress={handleSaveExam}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* LISTA DE EXÁMENES */}
                {loadingList ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4ECDC4" />
                    </View>
                ) : exams.length > 0 ? (
                    exams.map((exam) => (
                        <View key={exam.id} style={styles.examCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="clipboard" size={24} color="#4ECDC4" />
                                <View style={styles.cardInfo}>
                                    <Text style={styles.examDate}>
                                        📅 {formatDate(exam.examDate)}
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
                    !showAddForm && (
                        <View style={styles.emptyState}>
                            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyStateTitle}>
                                Sin exámenes anuales registrados
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Registra los chequeos anuales de {petName} para un control completo de su salud
                            </Text>
                        </View>
                    )
                )}
            </KeyboardAwareForm>
        </View>
    );
};

export default AnnualExamScreen;