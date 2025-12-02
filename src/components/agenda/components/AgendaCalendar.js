import React, { useMemo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useLanguage } from '../../../context/LanguageContext';
import styles from '../../../styles/AgendaScreenStyles';

// Configurar locales para español
LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};

// Configurar locales para inglés
LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today'
};

const AgendaCalendar = ({ markedDates, selectedDate, onDayPress }) => {
    const { language } = useLanguage();
    const [calendarKey, setCalendarKey] = useState(0);

    // Cambiar el locale del calendario cuando cambie el idioma
    useEffect(() => {
        // Establecer el locale correcto según el idioma
        LocaleConfig.defaultLocale = language;
        // Forzar re-render del calendario
        setCalendarKey(prev => prev + 1);
    }, [language]);

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
                key={`calendar-${calendarKey}-${language}`}
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

export default React.memo(AgendaCalendar);