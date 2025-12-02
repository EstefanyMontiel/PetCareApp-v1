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
import { useTheme } from '../context/ThemeContext';


const SettingScreen = ({ navigation }) => {
    const { user, userProfile, logout } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const { isDarkMode, toggleTheme, colors } = useTheme(); 

    // Verificación de seguridad
    if (!t) return null;

    const handleLogout = () => {
        Alert.alert(
            t('settings.logout'),
            t('settings.logoutConfirm'),
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
                            Alert.alert(t('common.error'), t('settings.logoutError'));
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const getInitial = () => {
        return userProfile?.nombre?.charAt(0).toUpperCase() || 
            user?.displayName?.charAt(0).toUpperCase() || 
            'U';
    };

    const showAppInfo = () => {
        Alert.alert(
            t('settings.appInfoTitle'),
            t('settings.appInfoDesc'),
            [{ text: t('common.ok') }]
        );
    };

    return (
        <SafeContainer>
            <ScrollView 
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
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
                        {userProfile?.nombre || user?.displayName || t('settings.defaultUser')}
                    </Text>
                    <Text style={styles.profileEmail}>
                        {userProfile?.correo || user?.email}
                    </Text>
                    
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                        <Text style={styles.verifiedText}>{t('settings.verifiedAccount')}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t('settings.profile')}</Text>
                
                <TouchableOpacity 
                    style={styles.settingCard}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="person-outline" size={22} color="#4ECDC4" />
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
                        <Ionicons name="notifications-outline" size={22} color="#4ECDC4" />
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

                {/* Opción Huellitas Eternas restaurada */}
                <TouchableOpacity 
                    style={styles.settingCard}
                    onPress={() => navigation.navigate('HuellitasEternas')}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="heart" size={24} color="#E74C3C" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>
                            {t('settings.huellitasEternas')}
                        </Text>
                        <Text style={styles.settingDescription}>
                            {t('settings.huellitasDesc')}
                        </Text>
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#999" 
                        style={styles.settingArrow}
                    />
                </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('settings.appearance')}
                        </Text>
                        
                        <TouchableOpacity 
                            style={[styles.settingCard, { backgroundColor: colors.cardBackground }]}
                            onPress={toggleTheme}
                        >
                            <View style={styles.settingIcon}>
                                <Ionicons 
                                    name={isDarkMode ? "moon" : "sunny"} 
                                    size={22} 
                                    color="#4ECDC4" 
                                />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={[styles.settingTitle, { color: colors.text }]}>
                                    {isDarkMode ? t('settings.darkMode') : t('settings.lightMode')}
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    {isDarkMode ? t('settings.disableDark') : t('settings.enableDark')}
                                </Text>
                            </View>
                            <View style={[
                                styles.toggleIndicator, 
                                isDarkMode && styles.toggleIndicatorActive
                            ]}>
                                <View style={[
                                    styles.toggleDot,
                                    isDarkMode && styles.toggleDotActive
                                ]} />
                            </View>
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
                        <Text style={styles.languageText}>{t('settings.spanish')}</Text>
                        {language === 'es' && (
                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color="#4ECDC4"
                                style={styles.languageCheckmark}
                            />
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.languageOption, styles.languageOptionLast]}
                        onPress={() => changeLanguage('en')}
                    >
                        <Text style={styles.languageFlag}>🇺🇸</Text>
                        <Text style={styles.languageText}>{t('settings.english')}</Text>
                        {language === 'en' && (
                            <Ionicons 
                                name="checkmark-circle" 
                                size={24} 
                                color="#4ECDC4"
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
                    <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutButtonText}>
                        {t('settings.logout')}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    {t('settings.footer')}
                </Text>
            </ScrollView>
        </SafeContainer>
    );
};

export default SettingScreen;