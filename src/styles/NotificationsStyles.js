import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: scale(16),
        paddingTop: Platform.OS === 'ios' ? scale(50) : scale(20),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F8F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        color: '#2C3E50',
    },

    content: {
        flex: 1,
        padding: scale(20),
    },

    // Banner informativo
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#E8F8F7',
        borderRadius: 16,
        padding: scale(16),
        marginBottom: scale(20),
        alignItems: 'center',
    },
    infoBannerText: {
        flex: 1,
        fontSize: scale(13),
        color: '#2C3E50',
        marginLeft: scale(12),
        lineHeight: scale(18),
    },

    // Toggle principal
    mainToggleCard: {
        borderRadius: 20,
        padding: scale(20),
        marginBottom: scale(24),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    mainToggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mainToggleIcon: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        backgroundColor: '#E8F8F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(16),
    },
    mainToggleText: {
        flex: 1,
    },
    mainToggleTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        marginBottom: scale(4),
    },
    mainToggleDescription: {
        fontSize: scale(14),
    },
    mainSwitch: {
        transform: [{ scale: 1.1 }],
    },

    // Sección
    sectionTitle: {
        fontSize: scale(16),
        fontWeight: '700',
        marginBottom: scale(12),
        marginTop: scale(8),
    },

    // Grupo de notificaciones
    notificationsGroup: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: scale(20),
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

    // Item de notificación
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    notificationIcon: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: scale(15),
        fontWeight: '600',
        marginBottom: scale(4),
    },
    notificationDescription: {
        fontSize: scale(13),
    },

    // Tarjeta de ayuda
    helpCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: scale(16),
        marginBottom: scale(20),
    },
    helpText: {
        flex: 1,
        fontSize: scale(13),
        color: '#7F8C8D',
        marginLeft: scale(12),
        lineHeight: scale(18),
    },

    // Botón guardar
    saveButton: {
        backgroundColor: '#4ECDC4',
        borderRadius: 16,
        paddingVertical: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: scale(20),
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
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '700',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
});