import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';

export default function SettingScreen({ navigation }) {
    const { t, language, changeLanguage } = useLanguage();

    const settingsSections = [
        {
            title: t('settings.profile'),
            items: [
                { 
                    icon: 'person-outline', 
                    title: t('settings.editProfile'), 
                    description: t('settings.editProfileDesc'),
                    screen: 'EditProfile'
                },
                { 
                    icon: 'notifications-outline', 
                    title: t('settings.notifications'), 
                    description: t('settings.notificationsDesc'),
                    screen: 'Notifications'
                },
            ]
        },
        {
            title: t('settings.privacy'),
            items: [
                { 
                    icon: 'lock-closed-outline', 
                    title: t('settings.changePassword'), 
                    description: t('settings.changePasswordDesc'),
                    screen: 'ChangePassword'
                },
            ]
        },
        {
            title: t('settings.about'),
            items: [
                { 
                    icon: 'help-circle-outline', 
                    title: t('settings.helpSupport'), 
                    description: t('settings.helpSupportDesc') 
                },
                { 
                    icon: 'information-circle-outline', 
                    title: t('settings.aboutPetCare'), 
                    description: t('settings.aboutPetCareDesc') 
                },
            ]
        }
    ];

    const handleNavigate = (screen) => {
        if (screen) {
            navigation.navigate(screen);
        }
    };

    const handleLanguageToggle = () => {
        const newLanguage = language === 'es' ? 'en' : 'es';
        changeLanguage(newLanguage);
    };

    return (
        <SafeContainer style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="settings-outline" size={60} color={COLORS.primary} />
                <Text style={styles.title}>{t('settings.title')}</Text>
                <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
            </View>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {settingsSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.items.map((item, itemIndex) => (
                            <TouchableOpacity 
                                key={itemIndex} 
                                style={styles.settingItem}
                                activeOpacity={0.7}
                                onPress={() => handleNavigate(item.screen)}
                            >
                                <View style={styles.settingIconContainer}>
                                    <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.settingContent}>
                                    <Text style={styles.settingTitle}>{item.title}</Text>
                                    <Text style={styles.settingDescription}>{item.description}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
                
                {/* Language Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
                    <TouchableOpacity 
                        style={styles.settingItem}
                        activeOpacity={0.7}
                        onPress={handleLanguageToggle}
                    >
                        <View style={styles.settingIconContainer}>
                            <Ionicons name="language" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>
                                {language === 'es' ? t('languages.spanish') : t('languages.english')}
                            </Text>
                            <Text style={styles.settingDescription}>{t('settings.languageDesc')}</Text>
                        </View>
                        <View style={styles.languageToggle}>
                            <Text style={styles.languageOption}>
                                {language === 'es' ? 'ES' : 'EN'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        paddingTop: verticalScale(60),
        paddingBottom: verticalScale(40),
        paddingHorizontal: SPACING.lg,
    },
    title: {
        fontSize: scale(28),
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: verticalScale(16),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(16),
        color: COLORS.textSecondary,
        marginTop: verticalScale(8),
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOW_STYLE,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: `${COLORS.primary}15`,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: scale(14),
        color: COLORS.textSecondary,
        lineHeight: scale(18),
    },
    languageToggle: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.sm,
        minWidth: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageOption: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#fff',
    },
});