import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const DatePickerModal = ({ 
    visible, 
    onClose, 
    onSelect, 
    selectedDate = new Date(),
    minimumDate,
    maximumDate 
}) => {
    const { t, language } = useLanguage();
    const [tempDate, setTempDate] = useState(selectedDate);
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

    // Verificación de seguridad
    if (!t || !language) return null;

    const months = t('agenda.monthNames');

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    useEffect(() => {
        if (visible) {
            setTempDate(selectedDate);
            setCurrentMonth(selectedDate.getMonth());
            setCurrentYear(selectedDate.getFullYear());
        }
    }, [visible, selectedDate]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDayPress = (day) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setTempDate(newDate);
    };

    const handleConfirm = () => {
        onSelect(tempDate);
        onClose();
    };

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        
        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <View key={`empty-${i}`} style={styles.dayCell} />
            );
        }

        // Días del mes
        for (let day = 1; day <= totalDays; day++) {
            const isSelected = 
                tempDate.getDate() === day &&
                tempDate.getMonth() === currentMonth &&
                tempDate.getFullYear() === currentYear;
            
            const isToday = 
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayCell,
                        isSelected && styles.daySelected,
                        isToday && !isSelected && styles.dayToday,
                    ]}
                    onPress={() => handleDayPress(day)}
                >
                    <Text
                        style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isToday && !isSelected && styles.dayTextToday,
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

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
                                    <Ionicons name="calendar" size={24} color="#4ECDC4" />
                                    <Text style={styles.headerTitle}>{t('datePicker.selectDate')}</Text>
                                </View>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#7F8C8D" />
                                </TouchableOpacity>
                            </View>

                            {/* Navegación de mes/año */}
                            <View style={styles.monthNavigator}>
                                <TouchableOpacity 
                                    onPress={handlePrevMonth}
                                    style={styles.navButton}
                                >
                                    <Ionicons name="chevron-back" size={24} color="#4ECDC4" />
                                </TouchableOpacity>
                                
                                <View style={styles.monthYearContainer}>
                                    <Text style={styles.monthText}>{months[currentMonth]}</Text>
                                    <Text style={styles.yearText}>{currentYear}</Text>
                                </View>
                                
                                <TouchableOpacity 
                                    onPress={handleNextMonth}
                                    style={styles.navButton}
                                >
                                    <Ionicons name="chevron-forward" size={24} color="#4ECDC4" />
                                </TouchableOpacity>
                            </View>

                            {/* Días de la semana */}
                            <View style={styles.weekDaysContainer}>
                                {t('agenda.dayNamesShort').map((day, index) => (
                                    <View key={index} style={styles.weekDayCell}>
                                        <Text style={styles.weekDayText}>{day}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Calendario */}
                            <View style={styles.calendarGrid}>
                                {renderCalendar()}
                            </View>

                            {/* Botones */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>{t('datePicker.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.confirmButton}
                                    onPress={handleConfirm}
                                >
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    <Text style={styles.confirmButtonText}>{t('datePicker.confirm')}</Text>
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
    monthNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    navButton: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#E8F9F7',
    },
    monthYearContainer: {
        alignItems: 'center',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    yearText: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7F8C8D',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    daySelected: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
    },
    dayToday: {
        borderWidth: 2,
        borderColor: '#4ECDC4',
        borderRadius: 12,
    },
    dayText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    dayTextToday: {
        color: '#4ECDC4',
        fontWeight: '700',
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

export default DatePickerModal;