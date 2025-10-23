import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFA',
    },
    scrollContent: {
        padding: scale(20),
    },
    
    // Header con foto de perfil
    profileHeader: {
        alignItems: 'center',
        paddingVertical: scale(30),
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: scale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: scale(15),
    },
    profileImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: '#E0E0E0',
    },
    profileImagePlaceholder: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: '#3db2d2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        fontSize: scale(40),
        fontWeight: 'bold',
        color: '#fff',
    },
    profileName: {
        fontSize: scale(22),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: scale(5),
    },
    profileEmail: {
        fontSize: scale(14),
        color: '#666',
    },

    // Secciones
    sectionTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#333',
        marginTop: scale(20),
        marginBottom: scale(10),
        marginLeft: scale(5),
    },
    settingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: scale(16),
        marginBottom: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    settingIcon: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#E8F5F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(15),
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#333',
        marginBottom: scale(4),
    },
    settingDescription: {
        fontSize: scale(13),
        color: '#666',
    },
    settingArrow: {
        marginLeft: scale(10),
    },

    // Formularios
    formContainer: {
        padding: scale(20),
    },
    inputGroup: {
        marginBottom: scale(20),
    },
    label: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#333',
        marginBottom: scale(8),
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1DBE5',
        borderRadius: 12,
        paddingHorizontal: scale(16),
        paddingVertical: Platform.select({
            ios: scale(14),
            android: scale(12),
        }),
        fontSize: scale(15),
        color: '#333',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: scale(12),
        marginTop: scale(4),
        marginLeft: scale(4),
    },

    // Foto de perfil en edición
    photoSection: {
        alignItems: 'center',
        marginBottom: scale(30),
    },
    editPhotoButton: {
        marginTop: scale(10),
        paddingVertical: scale(8),
        paddingHorizontal: scale(16),
    },
    editPhotoText: {
        color: '#3db2d2ff',
        fontSize: scale(14),
        fontWeight: '600',
    },

    // Switch de notificaciones
    notificationItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: scale(16),
        marginBottom: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationContent: {
        flex: 1,
        marginRight: scale(10),
    },
    notificationTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#333',
    },
    notificationSubtitle: {
        fontSize: scale(13),
        color: '#666',
        marginTop: scale(4),
    },

    // Selector de idioma
    languageSelector: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: scale(16),
        marginBottom: scale(12),
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    languageOptionLast: {
        borderBottomWidth: 0,
    },
    languageFlag: {
        fontSize: scale(24),
        marginRight: scale(12),
    },
    languageText: {
        flex: 1,
        fontSize: scale(16),
        color: '#333',
    },
    languageCheckmark: {
        marginLeft: scale(10),
    },

    // Botones
    saveButton: {
        backgroundColor: '#3db2d2ff',
        borderRadius: 12,
        paddingVertical: Platform.select({
            ios: scale(16),
            android: scale(14),
        }),
        alignItems: 'center',
        marginTop: scale(20),
        marginBottom: scale(40),
    },
    saveButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
    },

    logoutButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        paddingVertical: Platform.select({
            ios: scale(16),
            android: scale(14),
        }),
        alignItems: 'center',
        marginTop: scale(20),
        marginBottom: scale(40),
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});