import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { user, userProfile, userPets, logout, loadUserPets } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        if (user) {
            await loadUserPets(user.uid);
        }
        setRefreshing(false);
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate.seconds ? birthDate.seconds * 1000 : birthDate);
        const diffTime = Math.abs(today - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} días`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Cerrar Sesión', 
                    style: 'destructive',
                    onPress: logout
                }
            ]
        );
    };

    const PetCard = ({ pet }) => (
        <View style={styles.petCard}>
            <View style={styles.petHeader}>
                <View style={styles.petAvatar}>
                    <Ionicons 
                        name={pet.especie === 'Perro' ? 'paw' : 'paw'} 
                        size={30} 
                        color="#fff" 
                    />
                </View>
                <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.nombre}</Text>
                    <Text style={styles.petBreed}>{pet.raza}</Text>
                </View>
            </View>
            
            <View style={styles.petDetails}>
                <View style={styles.petDetailItem}>
                    <Ionicons name="paw-outline" size={16} color="#666" />
                    <Text style={styles.petDetailText}>{pet.especie}</Text>
                </View>
                
                <View style={styles.petDetailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.petDetailText}>
                        {calculateAge(pet.fechaNacimiento)}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>¡Hola!</Text>
                    <Text style={styles.userName}>
                        {userProfile?.nombre || user?.displayName || 'Usuario'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Mascotas */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mis Mascotas</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('PetRegister')}
                        style={styles.addButton}
                    >
                        <Ionicons name="add" size={20} color="#007AFF" />
                        <Text style={styles.addButtonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

                {userPets.length > 0 ? (
                    userPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="paw-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>No tienes mascotas registradas</Text>
                        <Text style={styles.emptyStateText}>
                            Agrega tu primera mascota para comenzar
                        </Text>
                        <TouchableOpacity 
                            style={styles.emptyStateButton}
                            onPress={() => navigation.navigate('PetRegister')}
                        >
                            <Text style={styles.emptyStateButtonText}>Registrar Mascota</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

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
});

export default HomeScreen;