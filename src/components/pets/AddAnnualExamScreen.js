import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from '../DatePickerModal';
import { annualExamService } from '../../services/annualExamService';
import styles from '../../styles/AnnualExamScreenStyles'; // ✅ USA LOS MISMOS ESTILOS
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const AddAnnualExamScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies, onSuccess } = route.params;
    
    // Estados del formulario
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
            
            Alert.alert('✅ Éxito', 'Examen anual registrado correctamente', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (onSuccess) onSuccess();
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            console.error('Error al guardar:', error);
            Alert.alert('❌ Error', 'No se pudo guardar el examen');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* ✅ HEADER */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleCancel}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>📋 Nuevo Examen Anual</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleSaveExam}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons name="checkmark" size={28} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAwareForm style={styles.content}>
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
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Veterinario */}
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

                    {/* Clínica */}
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
                            textAlignVertical="top"
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
                            textAlignVertical="top"
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
                            textAlignVertical="top"
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
                            textAlignVertical="top"
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
                            textAlignVertical="top"
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
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Próximo Examen */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Próximo Examen Anual (Opcional)</Text>
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
                        <DatePickerModal
                            visible={showNextExamPicker}
                            onClose={() => setShowNextExamPicker(false)}
                            onSelect={(date) => setNextExamDate(date)}
                            selectedDate={nextExamDate || new Date()}
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
            </KeyboardAwareForm>
        </View>
    );
};

export default AddAnnualExamScreen;