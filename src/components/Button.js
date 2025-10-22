import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, disabled, loading, variant = 'primary' }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'secondary' && styles.buttonSecondary,
                disabled && styles.buttonDisabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={[
                    styles.buttonText,
                    variant === 'secondary' && styles.buttonTextSecondary,
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3db2d2ff',
        borderRadius: Platform.select({
            ios: 8,
            android: 10,
        }),
        paddingVertical: Platform.select({
            ios: 16,
            android: 14,
        }),
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        // Sombra multiplataforma
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    buttonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3db2d2ff',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        ...Platform.select({
            ios: {
                shadowOpacity: 0,
            },
            android: {
                elevation: 0,
            },
        }),
    },
    buttonText: {
        color: '#fff',
        fontSize: Platform.select({
            ios: 16,
            android: 15,
        }),
        fontWeight: '600',
    },
    buttonTextSecondary: {
        color: '#3db2d2ff',
    },
});

export default Button;