import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    
    // ===== HEADER MINIMALISTA (sin emojis) =====
    instagramHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: Platform.OS === 'ios' ? 50 : 14,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
    },
    instagramHeaderTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#262626',
        letterSpacing: -0.5,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIconButton: {
        padding: 4,
    },

    // ===== TABS =====
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
        position: 'relative',
    },
    activeTabButton: {
        // Activo
    },
    tabButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8e8e8e',
    },
    activeTabButtonText: {
        color: '#262626',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#262626',
    },

    // ===== SCROLL CONTENT =====
    scrollContent: {
        flex: 1,
    },

    // ===== TARJETA DE MASCOTA ARCHIVADA =====
    instagramCard: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#efefef',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    petAvatarContainer: {
        marginRight: 12,
    },
    petAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
    },
    petAvatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petHeaderInfo: {
        flex: 1,
    },
    petCardName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },
    petCardDetails: {
        fontSize: 12,
        color: '#8e8e8e',
        marginTop: 2,
    },
    cardImageContainer: {
        width: width,
        height: width * 1.25,
        backgroundColor: '#f0f0f0',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardImagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        color: '#c7c7cc',
        fontWeight: '500',
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardActionsRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    cardFooter: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    memorialDate: {
        fontSize: 11,
        color: '#8e8e8e',
        marginBottom: 6,
    },
    farewellMessage: {
        fontSize: 13,
        color: '#262626',
        lineHeight: 18,
    },

    // ===== POST DE COMUNIDAD =====
    instagramPost: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#efefef',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    postUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    postUserName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },
    postLocation: {
        fontSize: 11,
        color: '#8e8e8e',
        marginTop: 2,
    },
    postImage: {
        width: width,
        height: width * 1.25,
        backgroundColor: '#f0f0f0',
    },
    postActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    leftActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        padding: 4,
    },
    likesText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    captionContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    captionText: {
        fontSize: 14,
        color: '#262626',
        lineHeight: 20,
    },
    captionUserName: {
        fontWeight: '600',
    },
    petNameBold: {
        fontWeight: '600',
        color: '#FF6B6B',
    },
    petBreed: {
        color: '#8e8e8e',
    },
    viewCommentsButton: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    viewCommentsText: {
        fontSize: 14,
        color: '#8e8e8e',
    },
    postTime: {
        fontSize: 10,
        color: '#8e8e8e',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },

    // ===== BOTÓN FLOTANTE (FAB) =====
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },

    // ===== MODAL CREAR RECUERDO =====
    createModalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    createModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
        backgroundColor: '#fff',
    },
    cancelButton: {
        fontSize: 16,
        color: '#262626',
    },
    createModalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#262626',
    },
    publishButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0095f6',
    },
    publishButtonDisabled: {
        color: '#b2dffc',
    },
    createModalContent: {
        flex: 1,
    },
    imageSelector: {
        width: '100%',
        height: width * 1.25,
        backgroundColor: '#fafafa',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    imageSelectorPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSelectorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#c7c7cc',
        fontWeight: '500',
    },
    formContainer: {
        padding: 16,
        paddingBottom: 100, // ← Espacio extra para el teclado
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#dbdbdb',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#262626',
        backgroundColor: '#fafafa',
        marginBottom: 12,
    },
    messageInput: {
        height: 120,
        paddingTop: 12,
    },

    // ===== MODAL COMENTARIOS =====
    commentsModalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 50 : 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
        backgroundColor: '#fff',
    },
    commentsHeaderTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#262626',
    },
    commentsList: {
        flex: 1,
    },
    commentItem: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentUserName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#262626',
        lineHeight: 18,
        marginBottom: 8,
    },
    
    // ✅ NUEVO: Estilos para acciones de comentario (likes y responder)
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 4,
    },
    commentAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentLikesCount: {
        fontSize: 12,
        color: '#8e8e8e',
        fontWeight: '500',
    },
    replyButton: {
        fontSize: 12,
        color: '#8e8e8e',
        fontWeight: '600',
    },
    commentTime: {
        fontSize: 11,
        color: '#8e8e8e',
    },

    // ✅ NUEVO: Estilos para respuestas
    repliesContainer: {
        marginTop: 12,
        marginLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#efefef',
        paddingLeft: 12,
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    replyAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#d1d1d6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    replyContent: {
        flex: 1,
    },
    replyUserName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 13,
        color: '#262626',
        lineHeight: 16,
        marginBottom: 4,
    },
    replyTime: {
        fontSize: 10,
        color: '#8e8e8e',
    },

    noComments: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    noCommentsText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8e8e8e',
    },

        // ✅ MEJORADO: Input de comentarios con barra de respuesta
        commentInputArea: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#dbdbdb',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ?  32 : 12, // ✅ Más espacio en iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // ✅ Sombra para destacar
    },
    replyingToBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
    },
    replyingToText: {
        fontSize: 13,
        color: '#8e8e8e',
    },
    commentInputArea: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ?  32 : 12, // ✅ Más espacio en iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // ✅ Sombra para destacar
},
    sendCommentButtonDisabled: {
        color: '#b2dffc',
    },

    // ===== MODAL COMPARTIR =====
    shareModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end', // ← Cambio: aparece desde abajo
    },
    shareModalContent: {
        width: '100%',
        maxHeight: '80%', // ← Máximo 80% de la pantalla
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    shareModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
    },
    shareModalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#262626',
    },
    sharePreviewImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    shareMessageInput: {
        padding: 16,
        fontSize: 15,
        color: '#262626',
        minHeight: 120,
        maxHeight: 200, // ← Altura máxima
        textAlignVertical: 'top',
    },
    shareConfirmButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 14,
        alignItems: 'center',
        margin: 16,
        borderRadius: 8,
    },
    shareConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    sendCommentButtonDisabled: {
    color: '#b3d7f6',
},

        // ✅ NUEVO: Agregar si no existe
        replyingToBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 8,
            borderRadius: 8,
        },
        replyingToText: {
            fontSize: 13,
            color: '#8e8e8e',
            fontStyle: 'italic',
        },


    // ===== ESTADOS VACÍOS =====
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#262626',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#8e8e8e',
        textAlign: 'center',
        lineHeight: 20,
    },

    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
    },


// ✅ NUEVO: Badge de notificaciones
notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ed4956',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
},
notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 4,
},
});