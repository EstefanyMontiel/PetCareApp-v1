import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';

export default function SettingScreen() {
    const settingsSections = [
        {
            title: 'Perfil',
            items: [
                { icon: 'person-outline', title: 'Editar perfil', description: 'Cambiar nombre y foto' },
                { icon: 'notifications-outline', title: 'Notificaciones', description: 'Gestionar alertas y recordatorios' },
            ]
        },
        {
            title: 'Privacidad',
            items: [
                { icon: 'shield-outline', title: 'Privacidad de datos', description: 'Controlar información compartida' },
                { icon: 'lock-closed-outline', title: 'Cambiar contraseña', description: 'Actualizar credenciales de acceso' },
            ]
        },
        {
            title: 'Acerca de',
            items: [
                { icon: 'help-circle-outline', title: 'Ayuda y soporte', description: 'Preguntas frecuentes y contacto' },
                { icon: 'information-circle-outline', title: 'Acerca de PetCare', description: 'Versión e información de la app' },
            ]
        }
    ];

    return (
        <SafeContainer style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="settings-outline" size={60} color={COLORS.primary} />
                <Text style={styles.title}>Configuraciones</Text>
                <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
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
                
                <View style={styles.comingSoonContainer}>
                    <Text style={styles.comingSoon}>
                        Más opciones de configuración estarán disponibles pronto
                    </Text>
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
    comingSoonContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    comingSoon: {
        fontSize: scale(14),
        color: COLORS.textTertiary,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: scale(20),
    },
});