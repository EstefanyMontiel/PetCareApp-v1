import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const TimePickerModal = ({ 
    visible, 
    onClose, 
    onSelect, 
    selectedTime = new Date(),
    is24Hour = false 
}) => {
    const { t, language } = useLanguage();
    const [hour, setHour] = useState(selectedTime.getHours());
    const [minute, setMinute] = useState(selectedTime.getMinutes());
    const [period, setPeriod] = useState(selectedTime.getHours() >= 12 ? 'PM' : 'AM');

    // Verificación de seguridad
    if (!t || !language) return null;

    useEffect(() => {
        if (visible) {
            const h = selectedTime.getHours();
            const m = selectedTime.getMinutes();
            setHour(is24Hour ? h : (h % 12 || 12));
            setMinute(m);
            setPeriod(h >= 12 ? 'PM' : 'AM');
        }
    }, [visible, selectedTime, is24Hour]);

    const handleConfirm = () => {
        let finalHour = hour;
        if (!is24Hour) {
            if (period === 'PM' && hour !== 12) {
                finalHour = hour + 12;
            } else if (period === 'AM' && hour === 12) {
                finalHour = 0;
            }
        }
        
        const newTime = new Date(selectedTime);
        newTime.setHours(finalHour);
        newTime.setMinutes(minute);
        onSelect(newTime);
        onClose();
    };

    const hours = is24Hour 
        ? Array.from({ length: 24 }, (_, i) => i)
        : Array.from({ length: 12 }, (_, i) => i + 1);

    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.headerLeft}>
                                    <Ionicons name="time" size={24} color="#4ECDC4" />
                                    <Text style={styles.headerTitle}>{t('timePicker.selectTime')}</Text>
                                </View>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#7F8C8D" />
                                </TouchableOpacity>
                            </View>

                            {/* Vista previa de la hora */}
                            <View style={styles.timePreview}>
                                <Text style={styles.timePreviewText}>
                                    {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
                                    {!is24Hour && ` ${period}`}
                                </Text>
                            </View>

                            {/* Selectores */}
                            <View style={styles.pickerContainer}>
                                {/* Selector de horas */}
                                <View style={styles.pickerColumn}>
                                    <Text style={styles.pickerLabel}>{t('timePicker.hour')}</Text>
                                    <ScrollView 
                                        style={styles.scrollPicker}
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                    >
                                        {hours.map((h) => (
                                            <TouchableOpacity
                                                key={h}
                                                style={[
                                                    styles.pickerItem,
                                                    hour === h && styles.pickerItemSelected,
                                                ]}
                                                onPress={() => setHour(h)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.pickerItemText,
                                                        hour === h && styles.pickerItemTextSelected,
                                                    ]}
                                                >
                                                    {String(h).padStart(2, '0')}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Separador */}
                                <Text style={styles.separator}>:</Text>

                                {/* Selector de minutos */}
                                <View style={styles.pickerColumn}>
                                    <Text style={styles.pickerLabel}>{t('timePicker.minute')}</Text>
                                    <ScrollView 
                                        style={styles.scrollPicker}
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                    >
                                        {minutes.filter(m => m % 5 === 0).map((m) => (
                                            <TouchableOpacity
                                                key={m}
                                                style={[
                                                    styles.pickerItem,
                                                    minute === m && styles.pickerItemSelected,
                                                ]}
                                                onPress={() => setMinute(m)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.pickerItemText,
                                                        minute === m && styles.pickerItemTextSelected,
                                                    ]}
                                                >
                                                    {String(m).padStart(2, '0')}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Selector AM/PM */}
                                {!is24Hour && (
                                    <View style={styles.pickerColumn}>
                                        <Text style={styles.pickerLabel}>Periodo</Text>
                                        <View style={styles.periodContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.periodButton,
                                                    period === 'AM' && styles.periodButtonSelected,
                                                ]}
                                                onPress={() => setPeriod('AM')}
                                            >
                                                <Text
                                                    style={[
                                                        styles.periodButtonText,
                                                        period === 'AM' && styles.periodButtonTextSelected,
                                                    ]}
                                                >
                                                    AM
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.periodButton,
                                                    period === 'PM' && styles.periodButtonSelected,
                                                ]}
                                                onPress={() => setPeriod('PM')}
                                            >
                                                <Text
                                                    style={[
                                                        styles.periodButtonText,
                                                        period === 'PM' && styles.periodButtonTextSelected,
                                                    ]}
                                                >
                                                    PM
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Botones */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>{t('timePicker.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.confirmButton}
                                    onPress={handleConfirm}
                                >
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    <Text style={styles.confirmButtonText}>{t('timePicker.confirm')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    timePreview: {
        backgroundColor: '#E8F9F7',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    timePreviewText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#4ECDC4',
        letterSpacing: 2,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 8,
    },
    pickerColumn: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 8,
    },
    scrollPicker: {
        height: 180,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    pickerItemSelected: {
        backgroundColor: '#4ECDC4',
        marginVertical: 2,
        marginHorizontal: 8,
        borderRadius: 8,
    },
    pickerItemText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    pickerItemTextSelected: {
        color: '#fff',
        fontWeight: '800',
    },
    separator: {
        fontSize: 32,
        fontWeight: '800',
        color: '#4ECDC4',
        marginHorizontal: 4,
        marginTop: 20,
    },
    periodContainer: {
        gap: 8,
    },
    periodButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E8EBED',
    },
    periodButtonSelected: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    periodButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7F8C8D',
    },
    periodButtonTextSelected: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7F8C8D',
    },
    confirmButton: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ECDC4',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

export default TimePickerModal;