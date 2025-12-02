import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../context/LanguageContext';
import styles from '../../../styles/AgendaScreenStyles';

const AgendaHeader = ({ onAddPress }) => {
    const { t } = useLanguage();
    
    // Verificación de seguridad
    if (!t) return null;
    
    return (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerIconWrapper}>
                        <Ionicons name="calendar" size={24} color="#fff" />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{t('agenda.title')}</Text>
                        <Text style={styles.headerSubtitle}>
                            {t('agenda.subtitle')}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={onAddPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.addButtonInner}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default React.memo(AgendaHeader);