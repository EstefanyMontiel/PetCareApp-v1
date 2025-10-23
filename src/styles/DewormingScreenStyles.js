import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    
    // Header elegante y moderno
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    },
    
    inputContainer: {
        marginBottom: 20,
    },
    
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
    },
    
    // Botones de tipo (Interno/Externo)
    typeButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8EBED',
        backgroundColor: '#F8F9FA',
        gap: 8,
    },
    typeButtonActive: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    typeButtonTextActive: {
        color: '#FFFFFF',
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
    },
    
    rowContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
        minHeight: 52,
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
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    
    buttonDisabled: {
        backgroundColor: '#BDC3C7',
        opacity: 0.6,
    },

    // Tarjetas de desparasitación
    dewormingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#9B59B6',
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
    },
    
    cardInfo: {
        marginLeft: 14,
        flex: 1,
    },
    
    typeBadge: {
        backgroundColor: '#E8F9F7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    
    productName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
    },
    
    date: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    
    nextDose: {
        fontSize: 14,
        color: '#E67E22',
        marginTop: 4,
        fontWeight: '600',
    },
    
    details: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
    },
    
    deleteButton: {
        padding: 8,
        backgroundColor: '#FFE5E5',
        borderRadius: 10,
    },
    
    description: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        lineHeight: 20,
    },

    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
    },
});