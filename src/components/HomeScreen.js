import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { petImageService, petArchiveService } from '../services/petServices';
import { useImagePicker } from '../hooks/useImagePicker';
import styles from '../styles/HomeScreenStyles';
import SafeContainer from './SafeContainer';
import Button from './Button';
    
const HomeScreen = ({ navigation }) => {
    const { user, userProfile, userPets, logout, loadUserPets } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({});
    const { pickImage, takePhoto } = useImagePicker();

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

    const navigateToOption = (pet, option) => {
        switch(option) {
            case 'vaccination':
                navigation.navigate('Vacunación', { 
                    petId: pet.id, 
                    petName: pet.nombre,
                    petSpecies: pet.especie
                });
                break;
            case 'deworming':
                navigation.navigate('Desparasitación', { 
                    petId: pet.id, 
                    petName: pet.nombre 
                });
                break;
            case 'annual':
                navigation.navigate('Examen anual', { 
                    petId: pet.id, 
                    petName: pet.nombre 
                });
                break;
        }
    };

    const handleImageSelection = (petId) => {
        Alert.alert(
            'Cambiar foto de perfil',
            'Selecciona una opción',
            [
                {
                    text: 'Cámara',
                    onPress: () => selectImageFromCamera(petId)
                },
                {
                    text: 'Galería',
                    onPress: () => selectImageFromGallery(petId)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        );
    };

    const selectImageFromCamera = async (petId) => {
        const imageUri = await takePhoto();
        if (imageUri) {
            await uploadPetImage(petId, imageUri);
        }
    };

    const selectImageFromGallery = async (petId) => {
        const imageUri = await pickImage();
        if (imageUri) {
            await uploadPetImage(petId, imageUri);
        }
    };

    const uploadPetImage = async (petId, imageUri) => {
        try {
            setUploadingImage(prev => ({ ...prev, [petId]: true }));
            
            // Subir imagen a Storage
            const imageUrl = await petImageService.uploadPetImage(petId, imageUri);
            
            // Actualizar URL en Firestore
            await petImageService.updatePetImage(petId, imageUrl);
            
            // Recargar las mascotas para mostrar la nueva imagen
            await loadUserPets(user.uid);
            
            Alert.alert('Éxito', 'Foto actualizada correctamente');
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto');
        } finally {
            setUploadingImage(prev => ({ ...prev, [petId]: false }));
        }
    };

    // Función para archivar mascota
    const handleArchivePet = (pet) => {
        Alert.alert(
            '💔 Archivar Mascota',
            `¿Deseas mover a ${pet.nombre} a "Huellitas Eternas"?\n\nEsta acción marcará a tu mascota como inactiva y la podrás ver en el apartado de recuerdos.`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Archivar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await petArchiveService.archivePet(pet.id);
                            
                            // Recargar las mascotas
                            await loadUserPets(user.uid);
                            
                            Alert.alert(
                                '✓ Archivada', 
                                `${pet.nombre} ha sido movida a Huellitas Eternas`
                            );
                        } catch (error) {
                            console.error('Error archivando mascota:', error);
                            Alert.alert(
                                'Error', 
                                'No se pudo archivar la mascota. Intenta de nuevo.'
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

 const PetCard = ({ pet }) => (
        <View style={styles.petCard}>
            {/* Imagen de la mascota */}
            <View style={styles.petImageContainer}>
                <TouchableOpacity 
                    style={styles.petImage}
                    onPress={() => handleImageSelection(pet.id)}
                >
                    {pet.imageUrl ? (
                        <Image 
                            source={{ uri: pet.imageUrl }} 
                            style={styles.petImageStyle}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons 
                                name={pet.especie === 'Perro' ? 'paw' : 'paw'} 
                                size={30} 
                                color="#fff" 
                            />
                        </View>
                    )}
                    
                    {uploadingImage[pet.id] && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.editIcon}
                    onPress={() => handleImageSelection(pet.id)}
                >
                    <Ionicons name="camera" size={12} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Información de la mascota */}
            <View style={styles.petInfo}>
                <View style={styles.petHeader}>
                    <View style={styles.petBasicInfo}>
                        <Text style={styles.petName}>{pet.nombre}</Text>
                        <Text style={styles.petBreed}>{pet.raza}</Text>
                        <Text style={styles.petAge}>{calculateAge(pet.fechaNacimiento)}</Text>
                    </View>
                    
                    {/* Botón de archivar discreto */}
                    <TouchableOpacity
                        style={styles.archiveButton}
                        onPress={() => handleArchivePet(pet)}
                    >
                        <Ionicons name="archive-outline" size={18} color="#999" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Opciones */}
            <View style={styles.optionsList}>
                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'vaccination')}
                >
                    <View style={styles.optionLeft}>
                        <Ionicons 
                            name="medical-outline" 
                            size={20} 
                            color="#666" 
                            style={styles.optionIcon}
                        />
                        <Text style={styles.optionText}>Vacunación</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'deworming')}
                >
                    <View style={styles.optionLeft}>
                        <Ionicons 
                            name="bug-outline" 
                            size={20} 
                            color="#666" 
                            style={styles.optionIcon}
                        />
                        <Text style={styles.optionText}>Desparasitación</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'annual')}
                >
                    <View style={styles.optionLeft}>
                        <Ionicons 
                            name="clipboard-outline" 
                            size={20} 
                            color="#666" 
                            style={styles.optionIcon}
                        />
                        <Text style={styles.optionText}>Examen anual</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeContainer style={styles.container}>
            {/* Header con logo */}
            <View style={styles.header}>
                <View style={styles.logo}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="paw" size={24} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>PetCare</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addPetButton}
                    onPress={() => navigation.navigate('PetRegister')}
                >
                    <Ionicons name="add" size={20} color="#4ECDC4" />
                </TouchableOpacity>

            </View>


            {/* Lista de mascotas */}
            <ScrollView 
                style={styles.petsContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
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
                
                {/* Botón para Huellitas Eternas */}
                <TouchableOpacity 
                    style={styles.eternasButton}
                    onPress={() => navigation.navigate('HuellitasEternas')}
                >
                    <Ionicons name="heart" size={24} color="#fff" />
                    <Text style={styles.eternasButtonText}>Huellitas Eternas</Text>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
            </ScrollView>

        </SafeContainer>
    );
};

export default HomeScreen;