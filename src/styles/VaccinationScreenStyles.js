import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    
    // Header elegante y moderno
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    petName: {
        fontSize: 15,
        color: '#7F8C8D',
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
    
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    
    // Formulario minimalista
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 24,
        letterSpacing: 0.3,
    },
    
    inputContainer: {
        marginBottom: 20,
    },
    
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    
    speciesIndicator: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '700',
    },
    
    pickerContainer: {
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        overflow: 'hidden',
    },
    
    picker: {
        height: Platform.OS === 'ios' ? 150 : 50,
        width: '100%',
    },
    
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 52,
    },
    
    dateButtonText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '500',
    },
    
    textArea: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
        textAlignVertical: 'top',
        minHeight: 100,
        lineHeight: 22,
    },
    
    characterCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#95A5A6',
        marginTop: 6,
    },
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    
    cancelButton: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 52,
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
    },
    
    cancelButtonText: {
        color: '#7F8C8D',
        fontSize: 16,
        fontWeight: '600',
    },
    
    saveButton: {
        flex: 1,
        backgroundColor: '#4ECDC4',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 52,
        justifyContent: 'center',
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
    
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    
    buttonDisabled: {
        backgroundColor: '#BDC3C7',
        opacity: 0.6,
    },

    // Tarjetas de vacunación minimalistas
    vaccinationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    
    vaccineName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    
    vaccineDate: {
        fontSize: 14,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    
    deleteButton: {
        padding: 8,
        backgroundColor: '#FFE5E5',
        borderRadius: 10,
    },
    
    vaccineDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        lineHeight: 20,
    },

    // Estado vacío elegante
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    
    emptyStateText: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 22,
    },
});