import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: 0.3,
    },
    
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
    },
    
    // Icono y título
    iconContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F9F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 22,
    },
    
    // Inputs
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
        minHeight: 52,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    
    // Selector de especie
    speciesContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    speciesButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8EBED',
        backgroundColor: '#FFFFFF',
        gap: 10,
    },
    speciesButtonSelected: {
        borderColor: '#4ECDC4',
        backgroundColor: '#E8F9F7',
    },
    speciesText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#95A5A6',
    },
    speciesTextSelected: {
        color: '#4ECDC4',
    },
    
    // Selector de fecha
    dateButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 52,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    dateText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '500',
    },
    
    // Botones
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 32,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        minHeight: 54,
    },
    cancelButtonText: {
        color: '#7F8C8D',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 54,
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    buttonDisabled: {
        backgroundColor: '#BDC3C7',
        opacity: 0.6,
    },
});

export default styles;