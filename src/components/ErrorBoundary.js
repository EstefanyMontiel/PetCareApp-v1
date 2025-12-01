import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * Displays a friendly error screen with retry option
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error for debugging (always log errors)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="warning-outline" size={80} color="#FF6B6B" />
                    </View>
                    <Text style={styles.title}>¡Algo salió mal!</Text>
                    <Text style={styles.message}>
                        Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
                    </Text>
                    <TouchableOpacity 
                        style={styles.retryButton} 
                        onPress={this.handleRetry}
                    >
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ECDC4',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 25,
        gap: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorBoundary;
