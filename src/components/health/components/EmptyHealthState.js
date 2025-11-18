// ============================================
// 📭 EMPTY HEALTH STATE COMPONENT
// ============================================
// ✅ Estado vacío reutilizable

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyHealthState = ({ icon = 'medical-outline', title, message, petName }) => {
    return (
        <View style={styles.emptyState}>
            <Ionicons name={icon} size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>{title}</Text>
            <Text style={styles.emptyStateText}>
                {message.replace('{petName}', petName)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7F8C8D',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#95A5A6',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default React.memo(EmptyHealthState);