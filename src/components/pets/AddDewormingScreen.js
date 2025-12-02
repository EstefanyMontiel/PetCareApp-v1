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
import ModernPicker from '../ModernPicker';
import { dewormingService } from '../../services/dewormingService';
import styles from '../../styles/DewormingScreenStyles';
import KeyboardAwareForm from '../common/KeyboardAwareForm';

const AddDewormingScreen = ({ route, navigation }) => {
    const { petId, petName, petSpecies, onSuccess } = route.params;
    
    // Estados del formulario (exactamente igual que tu DewormingScreen actual)
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productType, setProductType] = useState(''); // interno o externo
    const [applicationDate, setApplicationDate] = useState(new Date());
    const [nextDoseDate, setNextDoseDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showNextDosePicker, setShowNextDosePicker] = useState(false);
    const [weight, setWeight] = useState('');
    const [dose, setDose] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showProductPicker, setShowProductPicker] = useState(false);

    const dewormingProducts = {
        interno: [
            { label: 'Seleccionar producto...', value: '' },
            { label: 'Drontal (Perros y Gatos)', value: 'drontal' },
            { label: 'Milbemax (Perros y Gatos)', value: 'milbemax' },
            { label: 'Panacur (Fenbendazol)', value: 'panacur' },
            { label: 'Endogard (Perros)', value: 'endogard' },
            { label: 'Profender (Gatos)', value: 'profender' },
            { label: 'Caniquantel (Perros)', value: 'caniquantel' },
            { label: 'Otro', value: 'otro_interno' }
        ],
        externo: [
            { label: 'Seleccionar producto...', value: '' },
            { label: 'Bravecto (Perros y Gatos)', value: 'bravecto' },
            { label: 'NexGard (Perros)', value: 'nexgard' },
            { label: 'Simparica (Perros)', value: 'simparica' },
            { label: 'Frontline (Perros y Gatos)', value: 'frontline' },
            { label: 'Advantage (Perros y Gatos)', value: 'advantage' },
            { label: 'Revolution (Perros y Gatos)', value: 'revolution' },
            { label: 'Seresto (Collar - Perros y Gatos)', value: 'seresto' },
            { label: 'Otro', value: 'otro_externo' }
        ]
    };

    const getAvailableProducts = () => {
        if (!productType) return [{ label: 'Primero selecciona el tipo...', value: '' }];
        return dewormingProducts[productType] || [];
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

    const validateForm = () => {
        if (!productType) {
            Alert.alert('Error', 'Selecciona el tipo de desparasitación');
            return false;
        }
        if (!selectedProduct) {
            Alert.alert('Error', 'Selecciona un producto');
            return false;
        }
        if (!applicationDate) {
            Alert.alert('Error', 'Selecciona la fecha de aplicación');
            return false;
        }
        if (applicationDate > new Date()) {
            Alert.alert('Error', 'La fecha de aplicación no puede ser futura');
            return false;
        }
        return true;
    };

    const handleSaveDeworming = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const productName = getAvailableProducts().find(
                p => p.value === selectedProduct
            )?.label;

            const dewormingData = {
                productType: productType,
                product: selectedProduct,
                productName: productName,
                applicationDate: applicationDate,
                nextDoseDate: nextDoseDate,
                weight: weight ? parseFloat(weight) : null,
                dose: dose.trim(),
                description: description.trim(),
                petSpecies: petSpecies
            };

            await dewormingService.saveDeworming(petId, dewormingData);
            
            Alert.alert('✅ Éxito', 'Desparasitación registrada correctamente', [
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
            Alert.alert('❌ Error', 'No se pudo guardar la desparasitación');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleCancel}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>Desparasitación</Text>
                    <Text style={styles.petName}>{petName}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleSaveDeworming}
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
                    <Text style={styles.formTitle}>Nueva Desparasitación</Text>

                    {/* Tipo de desparasitación */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tipo de Desparasitación *</Text>
                        <View style={styles.typeButtonsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    productType === 'interno' && styles.typeButtonActive
                                ]}
                                onPress={() => {
                                    setProductType('interno');
                                    setSelectedProduct('');
                                }}
                            >
                                <Ionicons 
                                    name="bug" 
                                    size={20} 
                                    color={productType === 'interno' ? '#fff' : '#4ECDC4'} 
                                />
                                <Text style={[
                                    styles.typeButtonText,
                                    productType === 'interno' && styles.typeButtonTextActive
                                ]}>
                                    Interna
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    productType === 'externo' && styles.typeButtonActive
                                ]}
                                onPress={() => {
                                    setProductType('externo');
                                    setSelectedProduct('');
                                }}
                            >
                                <Ionicons 
                                    name="shield-checkmark" 
                                    size={20} 
                                    color={productType === 'externo' ? '#fff' : '#4ECDC4'} 
                                />
                                <Text style={[
                                    styles.typeButtonText,
                                    productType === 'externo' && styles.typeButtonTextActive
                                ]}>
                                    Externa
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selector de Producto */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Producto *</Text>
                        <TouchableOpacity
                            style={[
                                styles.modernPickerButton,
                                !productType && styles.modernPickerButtonDisabled
                            ]}
                            onPress={() => productType && setShowProductPicker(true)}
                            disabled={!productType}
                        >
                            <Text style={[
                                styles.modernPickerText,
                                !selectedProduct && styles.modernPickerPlaceholder
                            ]}>
                                {selectedProduct 
                                    ? getAvailableProducts().find(p => p.value === selectedProduct)?.label 
                                    : productType ? 'Seleccionar producto...' : 'Primero selecciona el tipo...'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ModernPicker
                        visible={showProductPicker}
                        onClose={() => setShowProductPicker(false)}
                        items={getAvailableProducts().filter(p => p.value !== '')}
                        onSelect={setSelectedProduct}
                        selectedValue={selectedProduct}
                        title={`Productos ${productType === 'interno' ? 'Internos' : 'Externos'}`}
                        searchPlaceholder="Buscar producto..."
                    />

                    {/* Fecha de Aplicación */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Fecha de Aplicación *</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {formatDate(applicationDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DatePickerModal
                            visible={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                            onSelect={(date) => setApplicationDate(date)}
                            selectedDate={applicationDate}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Próxima Dosis */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Próxima Dosis (Opcional)</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowNextDosePicker(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {formatDate(nextDoseDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {showNextDosePicker && (
                        <DatePickerModal
                            visible={showNextDosePicker}
                            onClose={() => setShowNextDosePicker(false)}
                            onSelect={(date) => setNextDoseDate(date)}
                            selectedDate={nextDoseDate || new Date()}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* Peso y Dosis */}
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
                            <Text style={styles.label}>Dosis</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="1 tableta"
                                value={dose}
                                onChangeText={setDose}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Descripción */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Notas (Opcional)</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Ej: Aplicado por veterinaria XYZ, próxima dosis en 3 meses..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                        />
                    </View>

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
                            onPress={handleSaveDeworming}
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

export default AddDewormingScreen;