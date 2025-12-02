import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from '../../../styles/AgendaScreenStyles';

// Configurar calendario en español (solo una vez)
LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const AgendaCalendar = ({ markedDates, selectedDate, onDayPress }) => {
    // Memoiza la configuración de fechas marcadas
    const finalMarkedDates = useMemo(() => ({
        ...markedDates,
        [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: '#4ECDC4',
        },
    }), [markedDates, selectedDate]);

    // Tema del calendario memoizado
    const calendarTheme = useMemo(() => ({
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#7F8C8D',
        selectedDayBackgroundColor: '#4ECDC4',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#4ECDC4',
        dayTextColor: '#2C3E50',
        textDisabledColor: '#d9e1e8',
        dotColor: '#4ECDC4',
        selectedDotColor: '#ffffff',
        arrowColor: '#4ECDC4',
        monthTextColor: '#2C3E50',
        indicatorColor: '#4ECDC4',
        textDayFontWeight: '500',
        textMonthFontWeight: '700',
        textDayHeaderFontWeight: '600',
        textDayFontSize: 15,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 13,
    }), []);

    const handleDayPress = (day) => {
        onDayPress(day.dateString);
    };

    return (
        <View style={styles.calendarContainer}>
            <Calendar
                current={new Date().toISOString().split('T')[0]}
                onDayPress={handleDayPress}
                markedDates={finalMarkedDates}
                theme={calendarTheme}
                enableSwipeMonths={true}
                markingType={'multi-dot'}
            />
        </View>
    );
};

// ✅ Memoiza el componente completo
export default React.memo(AgendaCalendar);