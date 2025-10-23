import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2C3E50',
    },
    petName: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#E8F9F7',
        borderRadius: 12,
        padding: 12,
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
    
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4ECDC4',
        marginTop: 16,
        marginBottom: 16,
        letterSpacing: 0.5,
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
        minHeight: 80,
    },
    
    // Botones de condición
    conditionContainer: {
        gap: 10,
    },
    conditionButton: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8EBED',
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
    },
    conditionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    conditionButtonTextActive: {
        color: '#FFFFFF',
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
    },

    // Tarjetas de exámenes
    examCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3498DB',
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
    
    examDate: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
    },
    
    clinic: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    
    veterinarian: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
    },
    
    conditionBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    conditionBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    
    deleteButton: {
        padding: 8,
        backgroundColor: '#FFE5E5',
        borderRadius: 10,
    },
    
    detail: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 8,
    },
    
    detailSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    detailTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
    },
    
    nextExam: {
        fontSize: 14,
        color: '#E67E22',
        marginTop: 12,
        fontWeight: '600',
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