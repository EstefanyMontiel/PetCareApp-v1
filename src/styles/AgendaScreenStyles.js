import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: 0.3,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    addButton: {
        padding: 4,
    },

    content: {
        flex: 1,
    },

    // Calendario
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
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

    // Eventos del día seleccionado
    eventsSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    eventsSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
    },
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
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
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    eventIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    eventTime: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
    },
    eventPet: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '600',
    },
    eventActions: {
        flexDirection: 'row',
        gap: 8,
    },
    checkButton: {
        padding: 4,
    },
    deleteButton: {
        padding: 4,
    },
    eventDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        lineHeight: 20,
    },

    // Estado vacío
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#7F8C8D',
        marginTop: 12,
    },

    // Próximos eventos
    upcomingSection: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    upcomingSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
    },
    upcomingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 4,
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
    upcomingIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    upcomingInfo: {
        flex: 1,
    },
    upcomingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    upcomingDate: {
        fontSize: 13,
        color: '#7F8C8D',
    },

    // Modal
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: '90%',
    },
    modalHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E0E0E0',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 24,
    },

    // Inputs del modal
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
    },
    dateButtonText: {
        fontSize: 15,
        color: '#2C3E50',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    // Botones de tipo
    typeButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E8EBED',
        backgroundColor: '#F8F9FA',
        gap: 6,
    },
    typeButtonActive: {
        borderColor: '#4ECDC4',
        backgroundColor: '#4ECDC4',
    },
    typeButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    typeButtonTextActive: {
        color: '#FFFFFF',
    },

    // Botones de mascota
    petButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    petButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        backgroundColor: '#FFFFFF',
    },
    petButtonActive: {
        borderColor: '#4ECDC4',
        backgroundColor: '#E8F9F7',
    },
    petButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    petButtonTextActive: {
        color: '#4ECDC4',
    },
    noPetsText: {
        fontSize: 14,
        color: '#7F8C8D',
        fontStyle: 'italic',
    },

    // Toggle de notificación
    notificationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 24,
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
    },

    // Botones del modal
    modalButtonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
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
// ... (mantén todos los estilos anteriores)

    // ✅ NUEVOS: Mejoras al modal
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalCloseButton: {
        padding: 4,
    },

    // ✅ NUEVOS: Tarjeta de evento completado
    eventCardCompleted: {
        opacity: 0.6,
        backgroundColor: '#F8F9FA',
    },
    eventTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#95A5A6',
    },

    // ✅ NUEVOS: Botón en estado vacío
    emptyStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    emptyStateButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },

    // ✅ NUEVO: Pet info en upcoming
    upcomingPet: {
        fontSize: 12,
        color: '#4ECDC4',
        marginTop: 2,
        fontWeight: '600',
    },

    // ✅ MEJORADO: Toggle switch personalizado
    notificationToggleActive: {
        backgroundColor: '#E8F9F7',
        borderColor: '#4ECDC4',
        borderWidth: 1.5,
    },
    notificationTextActive: {
        color: '#2C3E50',
        fontWeight: '700',
    },
    toggleSwitch: {
        width: 56,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E8EBED',
        padding: 3,
        justifyContent: 'center',
    },
    toggleSwitchActive: {
        backgroundColor: '#4ECDC4',
    },
    toggleCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    toggleCircleActive: {
        alignSelf: 'flex-end',
    },

    // ✅ MEJORADO: Botones de mascota con iconos
    petButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        backgroundColor: '#FFFFFF',
        gap: 6,
    },
    petButtonActive: {
        borderColor: '#4ECDC4',
        backgroundColor: '#4ECDC4',
    },
    petButtonTextActive: {
        color: '#FFFFFF',
    },
});