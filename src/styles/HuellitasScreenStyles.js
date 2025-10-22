import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#FFE5E5',
        padding: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    petCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    petImageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    petImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Efecto nostálgico
    },
    petInfo: {
        padding: 16,
    },
    petName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    petDetails: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    archivedDate: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    restoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    restoreText: {
        color: '#4CAF50',
        marginLeft: 6,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#BBB',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default styles;