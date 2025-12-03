import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    
    // ===== HEADER ELEGANTE CON GRADIENTE =====
    instagramHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: Platform.OS === 'ios' ? 54 : 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        ... Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFE5E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instagramHeaderTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#95A5A6',
        marginTop: -2,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIconButton: {
        padding: 6,
        position: 'relative',
    },

    // ===== TABS MEJORADAS =====
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        paddingHorizontal: 8,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
        position: 'relative',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    activeTabButton: {
        backgroundColor: '#F0F9FF',
    },
    tabButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#95A5A6',
    },
    activeTabButtonText: {
        color: '#4ECDC4',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 8,
        right: 8,
        height: 3,
        backgroundColor: '#4ECDC4',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },

    // ===== SCROLL CONTENT =====
    scrollContent: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },

    // ===== TARJETA DE MASCOTA ARCHIVADA MEJORADA =====
    instagramCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        ... Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    petAvatarContainer: {
        marginRight: 12,
    },
    petAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F0F0F0',
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    petAvatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petHeaderInfo: {
        flex: 1,
    },
    petCardName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.3,
    },
    petCardDetails: {
        fontSize: 13,
        color: '#7F8C8D',
        marginTop: 3,
    },
    cardImageContainer: {
        width: '100%',
        height: width * 1.1,
        backgroundColor: '#F5F5F5',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardImagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        color: '#BDC3C7',
        fontWeight: '600',
    },
    uploadingOverlay: {
        ... StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(44, 62, 80, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardActionsRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    iconButton: {
        padding: 6,
    },
    cardFooter: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    memorialDate: {
        fontSize: 12,
        color: '#95A5A6',
        marginBottom: 8,
        fontWeight: '500',
    },
    farewellMessage: {
        fontSize: 14,
        color: '#2C3E50',
        lineHeight: 20,
        fontStyle: 'italic',
    },

    // ===== POST DE COMUNIDAD MEJORADO =====
    instagramPost: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    postUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#E8F9F7',
    },
    postUserName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.2,
    },
    postLocation: {
        fontSize: 12,
        color: '#7F8C8D',
        marginTop: 3,
    },
    postImage: {
        width: '100%',
        height: width * 1.1,
        backgroundColor: '#F5F5F5',
    },
    postActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    leftActions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionButton: {
        padding: 6,
    },
    likesText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    captionContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    captionText: {
        fontSize: 14,
        color: '#2C3E50',
        lineHeight: 22,
    },
    captionUserName: {
        fontWeight: '700',
    },
    petNameBold: {
        fontWeight: '700',
        color: '#E74C3C',
    },
    petBreed: {
        color: '#7F8C8D',
    },
    viewCommentsButton: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    viewCommentsText: {
        fontSize: 14,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    postTime: {
        fontSize: 11,
        color: '#95A5A6',
        paddingHorizontal: 16,
        paddingBottom: 14,
    },

    // ===== BOTÓN FLOTANTE (FAB) MEJORADO =====
    fab: {
        position: 'absolute',
        bottom: 28,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        ... Platform.select({
            ios: {
                shadowColor: '#4ECDC4',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
            },
            android: {
                elevation: 10,
            },
        }),
    },

    // ===== MODAL CREAR RECUERDO ELEGANTE =====
    createModalContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    createModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: Platform.OS === 'ios' ?  54 : 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cancelButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    createModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.3,
    },
    publishButton: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    publishButtonDisabled: {
        color: '#BDC3C7',
    },
    createModalContent: {
        flex: 1,
    },
    imageSelector: {
        width: '100%',
        height: width * 1.1,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    imageSelectorPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
    },
    imageSelectorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#95A5A6',
        fontWeight: '600',
    },
    formContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    inputField: {
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2C3E50',
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
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
    messageInput: {
        height: 140,
        paddingTop: 14,
        textAlignVertical: 'top',
    },

    // ===== MODAL COMENTARIOS MEJORADO =====
    commentsModalContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    commentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: Platform.OS === 'ios' ? 54 : 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    commentsHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.3,
    },
    commentsList: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    commentItem: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentUserName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#2C3E50',
        lineHeight: 20,
        marginBottom: 8,
    },
    
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
        color: '#7F8C8D',
        fontWeight: '600',
    },
    replyButton: {
        fontSize: 13,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    commentTime: {
        fontSize: 11,
        color: '#95A5A6',
    },

    repliesContainer: {
        marginTop: 12,
        marginLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#E8E8E8',
        paddingLeft: 12,
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    replyAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#BDC3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    replyContent: {
        flex: 1,
    },
    replyUserName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 13,
        color: '#2C3E50',
        lineHeight: 18,
        marginBottom: 4,
    },
    replyTime: {
        fontSize: 11,
        color: '#95A5A6',
    },

    noComments: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    noCommentsText: {
        marginTop: 16,
        fontSize: 16,
        color: '#95A5A6',
        fontWeight: '500',
    },

    commentInputArea: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: Platform.OS === 'ios' ?  36 : 14,
        ... Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    replyingToBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4ECDC4',
    },
    replyingToText: {
        fontSize: 13,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    commentInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    commentInputField: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#2C3E50',
        maxHeight: 100,
    },
    sendCommentButton: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    sendCommentButtonDisabled: {
        color: '#BDC3C7',
    },

    // ===== MODAL COMPARTIR MEJORADO =====
    shareModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(44, 62, 80, 0.8)',
        justifyContent: 'flex-end',
    },
    shareModalContent: {
        width: '100%',
        maxHeight: '85%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    shareModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    shareModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        letterSpacing: -0.3,
    },
    sharePreviewImage: {
        width: '100%',
        height: 240,
        backgroundColor: '#F5F5F5',
    },
    shareMessageInput: {
        padding: 20,
        fontSize: 15,
        color: '#2C3E50',
        minHeight: 140,
        maxHeight: 220,
        textAlignVertical: 'top',
        lineHeight: 22,
    },
    shareConfirmButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        alignItems: 'center',
        margin: 20,
        borderRadius: 12,
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
    shareConfirmButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    // ===== ESTADOS VACÍOS MEJORADOS =====
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 22,
    },

    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
    },

    // ===== BADGE DE NOTIFICACIONES MEJORADO =====
    notificationBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#E74C3C',
        borderRadius: 12,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    notificationBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        paddingHorizontal: 5,
    },
});