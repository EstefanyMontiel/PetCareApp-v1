import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/NotificationsStyles';

const NotificationsScreen = ({ navigation }) => {
    const { user, userProfile, updateNotificationPreferences, loadUserProfile } = useAuth();
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState({
        enabled: true,
        vaccines: true,
        deworming: true,
        annualExam: true,
        reminders: true,
        updates: false,
    });

    useEffect(() => {
        if (userProfile?.notifications) {
            setPreferences(userProfile.notifications);
        }
    }, [userProfile]);

    const handleToggle = (key, value) => {
        const newPreferences = {
            ...preferences,
            [key]: value
        };

        if (key === 'enabled') {
            // Si se desactiva el principal, desactivar todos
            if (!value) {
                Object.keys(newPreferences).forEach(k => {
                    if (k !== 'enabled') newPreferences[k] = false;
                });
            } else {
                // Si se activa el principal, activar algunos básicos
                newPreferences.vaccines = true;
                newPreferences.deworming = true;
                newPreferences.annualExam = true;
            }
        } else {
            // Si se activa alguno, activar el principal
            if (value && !preferences.enabled) {
                newPreferences.enabled = true;
            }

            // Si se desactivan todos, desactivar el principal
            const hasAnyActive = Object.keys(newPreferences)
                .filter(k => k !== 'enabled')
                .some(k => newPreferences[k]);
            
            if (!hasAnyActive) {
                newPreferences.enabled = false;
            }
        }

        setPreferences(newPreferences);
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            await updateNotificationPreferences(preferences);
            await loadUserProfile(user.uid);

            Alert.alert(
                '✅ Éxito',
                'Preferencias guardadas correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Error guardando preferencias:', error);
            Alert.alert('Error', 'No se pudieron guardar las preferencias');
        } finally {
            setLoading(false);
        }
    };

    // Componente de switch personalizado
    const NotificationSwitch = ({ icon, title, description, value, onToggle, iconColor }) => (
        <View style={[styles.notificationItem, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.notificationIcon, { backgroundColor: iconColor + '20' }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>
            <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {title}
                </Text>
                <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E0E0E0', true: '#4ECDC4' }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
            />
        </View>
    );

    return (
        <SafeContainer>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView 
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Banner informativo */}
                    <View style={styles.infoBanner}>
                        <Ionicons name="information-circle" size={24} color="#4ECDC4" />
                        <Text style={styles.infoBannerText}>
                            Configura qué notificaciones deseas recibir sobre tus mascotas
                        </Text>
                    </View>

                    {/* Switch principal */}
                    <View style={[styles.mainToggleCard, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.mainToggleContent}>
                            <View style={styles.mainToggleIcon}>
                                <Ionicons 
                                    name={preferences.enabled ? "notifications" : "notifications-off"} 
                                    size={28} 
                                    color="#4ECDC4" 
                                />
                            </View>
                            <View style={styles.mainToggleText}>
                                <Text style={[styles.mainToggleTitle, { color: colors.text }]}>
                                    Notificaciones Push
                                </Text>
                                <Text style={[styles.mainToggleDescription, { color: colors.textSecondary }]}>
                                    {preferences.enabled ? 'Activadas' : 'Desactivadas'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={preferences.enabled}
                            onValueChange={(value) => handleToggle('enabled', value)}
                            trackColor={{ false: '#E0E0E0', true: '#4ECDC4' }}
                            thumbColor={preferences.enabled ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#E0E0E0"
                            style={styles.mainSwitch}
                        />
                    </View>

                    {/* Sección de Salud */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🏥 Recordatorios de Salud
                    </Text>

                    <View style={styles.notificationsGroup}>
                        <NotificationSwitch
                            icon="medical"
                            title="Vacunas"
                            description="Recordatorios de vacunación pendiente"
                            value={preferences.vaccines}
                            onToggle={(value) => handleToggle('vaccines', value)}
                            iconColor="#4ECDC4"
                        />

                        <NotificationSwitch
                            icon="shield-checkmark"
                            title="Desparasitación"
                            description="Alertas de próximas desparasitaciones"
                            value={preferences.deworming}
                            onToggle={(value) => handleToggle('deworming', value)}
                            iconColor="#3498DB"
                        />

                        <NotificationSwitch
                            icon="clipboard"
                            title="Examen Anual"
                            description="Recordatorio de chequeo anual"
                            value={preferences.annualExam}
                            onToggle={(value) => handleToggle('annualExam', value)}
                            iconColor="#9B59B6"
                        />
                    </View>



                    {/* Botón Guardar */}
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.saveButtonText}>
                                    Guardar Preferencias
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeContainer>
    );
};

export default NotificationsScreen;