import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Image, 
    StyleSheet, 
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { petArchiveService } from '../services/petServices';
import styles from '../styles/HuellitasScreenStyles';

export default function HuellitasEternasScreen() {
    const { user } = useAuth();
    const [archivedPets, setArchivedPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArchivedPets();
    }, []);

    const loadArchivedPets = async () => {
        try {
            setLoading(true);
            const pets = await petArchiveService.getArchivedPets(user.uid);
            setArchivedPets(pets);
        } catch (error) {
            console.error('Error cargando mascotas archivadas:', error);
            Alert.alert('Error', 'No se pudieron cargar las mascotas archivadas');
        } finally {
            setLoading(false);
        }
    };

    const handleRestorePet = (pet) => {
        Alert.alert(
            '🔄 Restaurar Mascota',
            `¿Deseas restaurar a ${pet.nombre} a tu lista de mascotas activas?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        try {
                            await petArchiveService.restorePet(pet.id);
                            await loadArchivedPets();
                            Alert.alert('✓', `${pet.nombre} ha sido restaurada`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo restaurar la mascota');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (date) => {
        if (!date) return 'Fecha desconocida';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const ArchivedPetCard = ({ pet }) => (
        <View style={styles.petCard}>
            {/* Imagen con overlay */}
            <View style={styles.petImageContainer}>
                {pet.imageUrl ? (
                    <Image 
                        source={{ uri: pet.imageUrl }} 
                        style={styles.petImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.petImage, styles.placeholderImage]}>
                        <Ionicons name="paw" size={40} color="#fff" />
                    </View>
                )}
                {/* Overlay con efecto de memoria */}
                <View style={styles.imageOverlay} />
            </View>

            {/* Información */}
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.nombre}</Text>
                <Text style={styles.petDetails}>
                    {pet.especie} • {pet.raza}
                </Text>
                <Text style={styles.archivedDate}>
                    💫 {formatDate(pet.archivedDate)}
                </Text>
                
                {/* Botón opcional para restaurar */}
                <TouchableOpacity
                    style={styles.restoreButton}
                    onPress={() => handleRestorePet(pet)}
                >
                    <Ionicons name="arrow-undo" size={16} color="#4CAF50" />
                    <Text style={styles.restoreText}>Restaurar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="heart" size={40} color="#FF6B6B" />
                <Text style={styles.headerTitle}>Huellitas Eternas</Text>
                <Text style={styles.headerSubtitle}>
                    Siempre en nuestros corazones 🐾
                </Text>
            </View>

            {/* Lista de mascotas archivadas */}
            <ScrollView style={styles.content}>
                {archivedPets.length > 0 ? (
                    archivedPets.map(pet => (
                        <ArchivedPetCard key={pet.id} pet={pet} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No hay mascotas en Huellitas Eternas
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Este espacio guardará los recuerdos de tus compañeros
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
