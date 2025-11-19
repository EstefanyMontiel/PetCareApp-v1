import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        padding: scale(20),
        paddingBottom: scale(40),
    },
    
    // ✅ Header mejorado con degradado
    profileHeader: {
        alignItems: 'center',
        paddingVertical: scale(30),
        paddingHorizontal: scale(20),
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: scale(20),
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
    profileImageContainer: {
        position: 'relative',
        marginBottom: scale(15),
    },
    profileImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        borderWidth: 4,
        borderColor: '#4ECDC4',
    },
    profileImagePlaceholder: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#E8F8F7',
    },
    profileInitial: {
        fontSize: scale(40),
        fontWeight: 'bold',
        color: '#fff',
    },
    profileName: {
        fontSize: scale(22),
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: scale(5),
    },
    profileEmail: {
        fontSize: scale(14),
        color: '#7F8C8D',
        marginBottom: scale(10),
    },

    // ✅ NUEVO: Badge de verificación
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F8F7',
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: 20,
        marginTop: scale(8),
    },
    verifiedText: {
        fontSize: scale(12),
        color: '#4ECDC4',
        fontWeight: '600',
        marginLeft: scale(4),
    },

    // ✅ NUEVO: Tarjetas de estadísticas
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(20),
        gap: scale(10),
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: scale(16),
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    statNumber: {
        fontSize: scale(24),
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: scale(8),
    },
    statLabel: {
        fontSize: scale(12),
        color: '#7F8C8D',
        marginTop: scale(4),
    },

    // Secciones
    sectionTitle: {
        fontSize: scale(16),
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: scale(20),
        marginBottom: scale(12),
        marginLeft: scale(5),
    },
    settingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: scale(16),
        marginBottom: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
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
    settingIcon: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: '#E8F8F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: scale(16),
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: scale(2),
    },
    settingDescription: {
        fontSize: scale(13),
        color: '#7F8C8D',
    },
    settingArrow: {
        marginLeft: scale(8),
    },

    // Selector de idioma
    languageSelector: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: scale(20),
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
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(16),
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
        fontSize: scale(16),
        color: '#2C3E50',
        flex: 1,
        fontWeight: '500',
    },
    languageCheckmark: {
        marginLeft: scale(8),
    },

    // Botón de cerrar sesión
    logoutButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 16,
        paddingVertical: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: scale(10),
        marginBottom: scale(20),
        ...Platform.select({
            ios: {
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '700',
    },

    // ✅ NUEVO: Footer
    footerText: {
        textAlign: 'center',
        fontSize: scale(12),
        color: '#95A5A6',
        marginTop: scale(10),
        marginBottom: scale(20),
    },

    // Edit Profile Screen
    editProfileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: scale(16),
        paddingTop: Platform.OS === 'ios' ? scale(50) : scale(20),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F8F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editProfileTitle: {
        fontSize: scale(18),
        fontWeight: '700',
        color: '#2C3E50',
    },
    formContainer: {
        padding: scale(20),
    },

    // ✅ Foto de perfil mejorada
    photoSection: {
        alignItems: 'center',
        marginBottom: scale(30),
    },
    photoWrapper: {
        position: 'relative',
        marginBottom: scale(15),
    },
    editPhotoButtonFloat: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4ECDC4',
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    editPhotoButtonText: {
        paddingVertical: scale(8),
    },
    editPhotoTextLabel: {
        fontSize: scale(14),
        color: '#4ECDC4',
        fontWeight: '600',
    },

    // Inputs
    inputGroup: {
        marginBottom: scale(20),
    },
    inputLabel: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: scale(8),
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1.5,
        borderColor: '#E8EBED',
        borderRadius: 12,
        paddingHorizontal: scale(16),
        paddingVertical: scale(14),
        fontSize: scale(15),
        color: '#2C3E50',
    },
    inputDisabled: {
        backgroundColor: '#F0F0F0',
        color: '#95A5A6',
    },
    inputHint: {
        fontSize: scale(12),
        color: '#95A5A6',
        marginTop: scale(6),
        marginLeft: scale(4),
    },

    // Botón guardar
    saveButton: {
        backgroundColor: '#4ECDC4',
        borderRadius: 12,
        paddingVertical: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: scale(20),
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

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ✅ AGREGAR AL FINAL
toggleIndicator: {
    width: scale(50),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#E0E0E0',
    padding: scale(3),
    justifyContent: 'center',
},
toggleIndicatorActive: {
    backgroundColor: '#4ECDC4',
},
toggleDot: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    backgroundColor: '#fff',
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        android: {
            elevation: 2,
        },
    }),
},
toggleDotActive: {
    alignSelf: 'flex-end',
},
});
