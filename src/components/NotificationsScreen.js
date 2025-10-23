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
import SafeContainer from './SafeContainer';
import styles from '../styles/SettingsStyles';

const NotificationsScreen = ({ navigation }) => {
    const { user, userProfile, updateNotificationPreferences, loadUserProfile } = useAuth();
    const { t } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState({
        enabled: true,
        vaccines: true,
        deworming: true,
        annualExam: true
    });

    // Cargar preferencias actuales
    useEffect(() => {
        if (userProfile?.notifications) {
            setPreferences(userProfile.notifications);
        }
    }, [userProfile]);

    // Manejar cambio de switch principal
    const handleToggleAll = (value) => {
        setPreferences({
            enabled: value,
            vaccines: value,
            deworming: value,
            annualExam: value
        });
    };

    // Manejar cambio de switches individuales
    const handleToggle = (key, value) => {
        const newPreferences = {
            ...preferences,
            [key]: value
        };

        // Si se activa alguno, activar el principal
        if (value && !preferences.enabled) {
            newPreferences.enabled = true;
        }

        // Si se desactivan todos, desactivar el principal
        if (!value && !newPreferences.vaccines && !newPreferences.deworming && !newPreferences.annualExam) {
            newPreferences.enabled = false;
        }

        setPreferences(newPreferences);
    };

    // Guardar preferencias
    const handleSave = async () => {
        try {
            setLoading(true);

            await updateNotificationPreferences(preferences);
            await loadUserProfile(user.uid);

            Alert.alert(
                t('common.success'),
                t('notifications.success'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Error guardando preferencias:', error);
            Alert.alert(
                t('common.error'),
                t('notifications.error')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer>
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' }}>
                        {t('notifications.title')}
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Notificaciones Generales */}
                    <Text style={styles.sectionTitle}>
                        {t('notifications.generalTitle')}
                    </Text>

                    <View style={styles.notificationItem}>
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>
                                {t('notifications.enableAll')}
                            </Text>
                        </View>
                        <Switch
                            value={preferences.enabled}
                            onValueChange={handleToggleAll}
                            trackColor={{ false: '#D1D1D6', true: '#3db2d2ff' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : preferences.enabled ? '#fff' : '#f4f3f4'}
                        />
                    </View>

                    {/* Recordatorios */}
                    <Text style={styles.sectionTitle}>
                        {t('notifications.remindersTitle')}
                    </Text>

                    {/* Recordatorio de Vacunas */}
                    <View style={styles.notificationItem}>
                        <View style={styles.notificationContent}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="medical" size={20} color="#3db2d2ff" style={{ marginRight: 10 }} />
                                <Text style={styles.notificationTitle}>
                                    {t('notifications.vaccines')}
                                </Text>
                            </View>
                            <Text style={styles.notificationSubtitle}>
                                Te avisaremos cuando sea tiempo de vacunar
                            </Text>
                        </View>
                        <Switch
                            value={preferences.vaccines}
                            onValueChange={(value) => handleToggle('vaccines', value)}
                            trackColor={{ false: '#D1D1D6', true: '#3db2d2ff' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : preferences.vaccines ? '#fff' : '#f4f3f4'}
                            disabled={!preferences.enabled}
                        />
                    </View>

                    {/* Recordatorio de Desparasitación */}
                    <View style={styles.notificationItem}>
                        <View style={styles.notificationContent}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="fitness" size={20} color="#3db2d2ff" style={{ marginRight: 10 }} />
                                <Text style={styles.notificationTitle}>
                                    {t('notifications.deworming')}
                                </Text>
                            </View>
                            <Text style={styles.notificationSubtitle}>
                                Te avisaremos cuando sea tiempo de desparasitar
                            </Text>
                        </View>
                        <Switch
                            value={preferences.deworming}
                            onValueChange={(value) => handleToggle('deworming', value)}
                            trackColor={{ false: '#D1D1D6', true: '#3db2d2ff' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : preferences.deworming ? '#fff' : '#f4f3f4'}
                            disabled={!preferences.enabled}
                        />
                    </View>

                    {/* Recordatorio de Exámenes Anuales */}
                    <View style={styles.notificationItem}>
                        <View style={styles.notificationContent}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="clipboard" size={20} color="#3db2d2ff" style={{ marginRight: 10 }} />
                                <Text style={styles.notificationTitle}>
                                    {t('notifications.annualExam')}
                                </Text>
                            </View>
                            <Text style={styles.notificationSubtitle}>
                                Te avisaremos cuando sea tiempo del examen anual
                            </Text>
                        </View>
                        <Switch
                            value={preferences.annualExam}
                            onValueChange={(value) => handleToggle('annualExam', value)}
                            trackColor={{ false: '#D1D1D6', true: '#3db2d2ff' }}
                            thumbColor={Platform.OS === 'ios' ? '#fff' : preferences.annualExam ? '#fff' : '#f4f3f4'}
                            disabled={!preferences.enabled}
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
                            <Text style={styles.saveButtonText}>
                                {t('notifications.save')}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeContainer>
    );
};

export default NotificationsScreen;