import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        padding: 8,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addButtonText: {
        marginLeft: 4,
        color: '#007AFF',
        fontWeight: '600',
    },
    petCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    petHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    petAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    petBreed: {
        fontSize: 14,
        color: '#666',
    },
    petDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    petDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petDetailText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyStateButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    emptyStateButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    // Estilos para imágenes de mascotas
    petImageContainer: {
        position: 'relative',
        marginBottom: 15,
        alignItems: 'center',
    },
    petImage: {
        position: 'relative',
    },
    petImageStyle: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    placeholderImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4ECDC4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Estilos para información de la mascota
    petInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    petName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    petBreed: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    petAge: {
        fontSize: 12,
        color: '#999',
    },
    // Estilos para las opciones
    optionsList: {
        marginTop: 10,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f8f9fa',
        marginBottom: 8,
        borderRadius: 8,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    // Estilos para el header con logo
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        backgroundColor: '#4ECDC4',
        borderRadius: 20,
        padding: 8,
        marginRight: 10,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addPetButton: {
        backgroundColor: '#f0f8ff',
        borderRadius: 20,
        padding: 8,
    },
    petsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },

    //Boton registar mascotas inactivas 

    eternasButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#6B9B8E',
        margin: 15,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eternasButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginLeft: 10,
    },
    petsContainer: {
        padding: 15,
    },
});

export default styles;