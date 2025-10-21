import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#6B9B8E',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#6B9B8E',
        fontWeight: 'bold',
    },
    shareSection: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6B9B8E',
        borderStyle: 'dashed',
    },
    shareButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#6B9B8E',
        fontWeight: '600',
    },
    listContainer: {
        padding: 10,
    },
    myPetCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    petImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
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
    petDate: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
    },
    petMessage: {
        fontSize: 15,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        color: '#6B9B8E',
        fontWeight: '600',
    },
    galeriaCard: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6B9B8E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    petNameSmall: {
        fontSize: 12,
        color: '#666',
    },
    galeriaImage: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    leftActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginRight: 15,
    },
    cardFooter: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    likes: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    caption: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    captionUser: {
        fontWeight: 'bold',
    },
    viewComments: {
        fontSize: 14,
        color: '#999',
    },
    });

export default styles;
