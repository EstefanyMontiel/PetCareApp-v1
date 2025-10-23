import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/SettingsStyles';

const SettingScreen = ({ navigation }) => {
    const { user, userProfile, logout } = useAuth();
    const { t, language, changeLanguage } = useLanguage();

    const handleLogout = () => {
        Alert.alert(
            t('settings.logout'),
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel'
                },
                {
                    text: t('common.ok'),
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert(t('common.error'), 'Error al cerrar sesión');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'es' ? 'en' : 'es';
        changeLanguage(newLanguage);
    };

    const getInitial = () => {
        return userProfile?.nombre?.charAt(0).toUpperCase() || 
            user?.displayName?.charAt(0).toUpperCase() || 
            'U';
    };

    return (
        <SafeContainer>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header con perfil */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileImageContainer}>
                        {userProfile?.photoURL ? (
                            <Image 
                                source={{ uri: userProfile.photoURL }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Text style={styles.profileInitial}>
                                    {getInitial()}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.profileName}>
                        {userProfile?.nombre || user?.displayName || 'Usuario'}
                    </Text>
                    <Text style={styles.profileEmail}>
                        {userProfile?.correo || user?.email}
                    </Text>
                </View>

                {/* Sección Perfil */}
                <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
                
                <TouchableOpacity 
                    style={styles.settingCard}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="person-outline" size={22} color="#3db2d2ff" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>
                            {t('settings.editProfile')}
                        </Text>
                        <Text style={styles.settingDescription}>
                            {t('settings.editProfileDesc')}
                        </Text>
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#999" 
                        style={styles.settingArrow}
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.settingCard}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="notifications-outline" size={22} color="#3db2d2ff" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>
                            {t('settings.notifications')}
                        </Text>
                        <Text style={styles.settingDescription}>
                            {t('settings.notificationsDesc')}
                        </Text>
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#999" 
                        style={styles.settingArrow}
                    />
                </TouchableOpacity>

                {/* Sección Privacidad */}
                <Text style={styles.sectionTitle}>
                    {t('settings.privacy')}
                </Text>
                
                <TouchableOpacity 
                    style={styles.settingCard}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="lock-closed-outline" size={22} color="#3db2d2ff" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>
                            {t('settings.changePassword')}
                        </Text>
                        <Text style={styles.settingDescription}>
                            {t('settings.changePasswordDesc')}
                        </Text>
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#999" 
                        style={styles.settingArrow}
                    />
                </TouchableOpacity>

                {/* Selector de Idioma */}
                <Text style={styles.sectionTitle}>
                    {t('settings.language')}
                </Text>
                
                <View style={styles.languageSelector}>
                    <TouchableOpacity 
                        style={[styles.languageOption]}
                        onPress={() => changeLanguage('es')}
                    >
                        <Text style={styles.languageFlag}>🇪🇸</Text>
                        <Text style={styles.languageText}>Español</Text>
                        {language === 'es' && (
                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color="#3db2d2ff"
                                style={styles.languageCheckmark}
                            />
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.languageOption, styles.languageOptionLast]}
                        onPress={() => changeLanguage('en')}
                    >
                        <Text style={styles.languageFlag}>🇺🇸</Text>
                        <Text style={styles.languageText}>English</Text>
                        {language === 'en' && (
                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color="#3db2d2ff"
                                style={styles.languageCheckmark}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Botón Cerrar Sesión */}
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>
                        {t('settings.logout')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeContainer>
    );
};

export default SettingScreen;
