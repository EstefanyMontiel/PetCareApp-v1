    import { StyleSheet, Dimensions, Platform } from 'react-native';
    import { SHADOW_STYLE, SAFE_AREA_PADDING, scale, verticalScale } from '../components/responsive';
    import { COLORS, SPACING } from './theme';

    const { width } = Dimensions.get('window');

    export default StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.surface,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            backgroundColor: COLORS.background,
            padding: SPACING.md + SPACING.xs,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
             // ✅ Safe area para iOS
        ...Platform.select({
            ios: {
                paddingTop: 60, // Espacio para notch
            },
            android: {
                paddingTop: SPACING.md + SPACING.xs,
            },
        }),
        },
        headerTitle: {
            fontSize: scale(24),
            fontWeight: 'bold',
            color: COLORS.textPrimary,
            marginTop: verticalScale(10),
        },
        headerSubtitle: {
            fontSize: scale(14),
            color: COLORS.textSecondary,
            marginTop: verticalScale(5),
        },
        
        // Tabs
        tabContainer: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            gap: 8,
        },
        activeTab: {
            borderBottomWidth: 2,
            borderBottomColor: '#4ECDC4',
        },
        tabText: {
            fontSize: 15,
            color: '#999',
            fontWeight: '500',
        },
        activeTabText: {
            color: '#4ECDC4',
            fontWeight: '600',
        },
        
        content: {
            flex: 1,
        },
        
        // Tarjeta personal
        petCard: {
            backgroundColor: '#fff',
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 15,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        petImageContainer: {
            position: 'relative',
            width: '100%',
            height: 200,
        },
        petImage: {
            width: '100%',
            height: '100%',
        },
        placeholderImage: {
            backgroundColor: '#ddd',
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        petInfo: {
            padding: 15,
        },
        petName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 5,
        },
        petDetails: {
            fontSize: 14,
            color: '#666',
            marginBottom: 5,
        },
        archivedDate: {
            fontSize: 13,
            color: '#FF6B6B',
            marginBottom: 15,
        },
        cardActions: {
            flexDirection: 'row',
            gap: 10,
        },
        shareButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E8F9F7',
            paddingVertical: 10,
            borderRadius: 8,
            gap: 5,
        },
        shareButtonText: {
            color: '#4ECDC4',
            fontSize: 14,
            fontWeight: '600',
        },
        restoreButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E8F5E9',
            paddingVertical: 10,
            borderRadius: 8,
            gap: 5,
        },
        restoreText: {
            color: '#4CAF50',
            fontSize: 14,
            fontWeight: '600',
        },
        
        // Tarjetas comunitarias (estilo Instagram)
        communityCard: {
            backgroundColor: '#fff',
            marginBottom: 15,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#eee',
        },
        postHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        userAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#4ECDC4',
            justifyContent: 'center',
            alignItems: 'center',
        },
        userName: {
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
        },
        postTime: {
            fontSize: 11,
            color: '#999',
        },
        postImage: {
            width: width,
            height: width,
        },
        postActions: {
            flexDirection: 'row',
            padding: 12,
            gap: 15,
        },
        actionButton: {
            padding: 5,
        },
        likesCount: {
            paddingHorizontal: 12,
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
            marginBottom: 8,
        },
        postContent: {
            paddingHorizontal: 12,
            paddingBottom: 12,
        },
        petNameBold: {
            fontSize: 15,
            fontWeight: '700',
            color: '#333',
            marginBottom: 5,
        },
        petBreed: {
            fontWeight: '400',
            color: '#666',
        },
        postMessage: {
            fontSize: 14,
            color: '#333',
            lineHeight: 20,
        },
        commentsSection: {
            paddingHorizontal: 12,
            paddingBottom: 12,
        },
        viewComments: {
            fontSize: 13,
            color: '#999',
        },
        
        // Modal
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '80%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
        },
        previewSection: {
            alignItems: 'center',
            marginBottom: 20,
        },
        previewImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 10,
        },
        previewPetName: {
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
        },
        messageInput: {
            backgroundColor: '#f8f9fa',
            borderRadius: 10,
            padding: 15,
            fontSize: 15,
            color: '#333',
            minHeight: 100,
            marginBottom: 20,
        },
        confirmShareButton: {
            backgroundColor: '#4ECDC4',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
            borderRadius: 10,
            gap: 8,
        },
        confirmShareText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
        
        // Empty state
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 40,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '600',
            color: '#666',
            textAlign: 'center',
            marginTop: 20,
        },
        emptySubtext: {
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            marginTop: 10,
        },
       //  estilos para botón de cámara
    cameraButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(76, 205, 196, 0.9)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    addPhotoText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8,
        fontWeight: '500',
    },
    disabledText: {
        color: '#ccc',
    },

    //  Botón de opciones en post
    optionsButton: {
        padding: 8,
    },

    // Modal de comentarios
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
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                paddingTop: 50, // Para el notch en iOS
            },
            android: {
                paddingTop: 16,
            },
        }),
    },
    backButtonFloating: {
        padding: 8,
    },
    commentsHeaderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#262626',
        textAlign: 'center',
        flex: 1,
    },
    commentsList: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    commentUserName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#262626',
        marginRight: 8,
    },
    commentText: {
        fontSize: 13,
        color: '#262626',
        lineHeight: 18,
        flex: 1,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    commentTime: {
        fontSize: 12,
        color: '#8e8e8e',
        marginRight: 16,
    },
    commentLikeButton: {
        marginRight: 16,
    },
    commentLikeText: {
        fontSize: 12,
        color: '#8e8e8e',
        fontWeight: '600',
    },
    commentReplyButton: {
        marginRight: 16,
    },
    commentReplyText: {
        fontSize: 12,
        color: '#8e8e8e',
        fontWeight: '600',
    },
    noCommentsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    noCommentsText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#262626',
        marginTop: 15,
        textAlign: 'center',
    },
    noCommentsSubtext: {
        fontSize: 14,
        color: '#8e8e8e',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 18,
    },
    
    // Input de comentario (fijo abajo)
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderTopColor: '#dbdbdb',
        ...Platform.select({
            ios: {
                paddingBottom: 34, // Espacio para el indicator home en iOS
            },
            android: {
                paddingBottom: 12,
            },
        }),
    },
    commentInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dbdbdb',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    commentInput: {
        flex: 1,
        fontSize: 14,
        color: '#262626',
        paddingVertical: 0,
        maxHeight: 80,
    },
    sendButton: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    sendButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0095f6',
    },
    sendButtonDisabled: {
        opacity: 0.3,
    },

    // Para evitar que el teclado tape
    buttonDisabled: {
        opacity: 0.6,
    },
});