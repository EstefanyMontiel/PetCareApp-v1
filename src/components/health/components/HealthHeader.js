// ============================================
// 🏥 HEALTH HEADER COMPONENT
// ============================================
// ✅ Header reutilizable para todas las pantallas de salud

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HealthHeader = ({ title, petName, onBack, onAdd }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={onBack}
            >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.petName}>{petName}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.addButton}
                onPress={onAdd}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4ECDC4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    petName: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: '#4ECDC4',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
});

export default React.memo(HealthHeader);