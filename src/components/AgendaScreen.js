    import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import { scale, verticalScale, SHADOW_STYLE } from '../components/responsive';

export default function AgendaScreen() {
    return (
        <SafeContainer style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="calendar-outline" size={60} color="#4ECDC4" />
                <Text style={styles.title}>Agenda</Text>
                <Text style={styles.subtitle}>Próximamente</Text>
            </View>
            
            <View style={styles.content}>
                <View style={styles.featureCard}>
                    <Ionicons name="calendar" size={24} color="#4ECDC4" />
                    <Text style={styles.featureTitle}>Recordatorios</Text>
                    <Text style={styles.featureDescription}>
                        Programa citas veterinarias y recibe notificaciones
                    </Text>
                </View>
                
                <View style={styles.featureCard}>
                    <Ionicons name="notifications" size={24} color="#4ECDC4" />
                    <Text style={styles.featureTitle}>Alertas</Text>
                    <Text style={styles.featureDescription}>
                        Nunca olvides las vacunas y desparasitaciones
                    </Text>
                </View>
                
                <View style={styles.featureCard}>
                    <Ionicons name="time" size={24} color="#4ECDC4" />
                    <Text style={styles.featureTitle}>Historial</Text>
                    <Text style={styles.featureDescription}>
                        Lleva un registro completo de la salud de tu mascota
                    </Text>
                </View>
            </View>
            
            <Text style={styles.comingSoon}>
                Esta función estará disponible pronto
            </Text>
        </SafeContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F8F9',
    },
    header: {
        alignItems: 'center',
        paddingTop: verticalScale(60),
        paddingBottom: verticalScale(40),
    },
    title: {
        fontSize: scale(28),
        fontWeight: 'bold',
        color: '#333',
        marginTop: verticalScale(16),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(16),
        color: '#666',
        marginTop: verticalScale(8),
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: verticalScale(20),
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        ...SHADOW_STYLE,
    },
    featureTitle: {
        fontSize: scale(18),
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: scale(14),
        color: '#666',
        textAlign: 'center',
        lineHeight: scale(20),
    },
    comingSoon: {
        fontSize: scale(14),
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingBottom: verticalScale(40),
        fontStyle: 'italic',
    },
});