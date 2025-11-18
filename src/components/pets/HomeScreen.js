import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Image,
    ActivityIndicator, 
    Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { petImageService, petArchiveService } from '../../services/petServices';
import { useImagePicker } from '../../hooks/useImagePicker';
import styles from '../../styles/HomeScreenStyles';
import SafeContainer from '../SafeContainer';

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
                    petName: pet.nombre,
                    petSpecies: pet.especie
                });
                break;
            case 'annual':
                navigation.navigate('Examen anual', { 
                    petId: pet.id, 
                    petName: pet.nombre,
                    petSpecies: pet.especie
                });
                break;
            case 'edit':
                navigation.navigate('EditPet', {
                    petId: pet.id,
                    petData: pet
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
            const imageUrl = await petImageService.uploadPetImage(petId, imageUri);
            await petImageService.updatePetImage(petId, imageUrl);
            await loadUserPets(user.uid);
            Alert.alert('Éxito', 'Foto actualizada correctamente');
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto');
        } finally {
            setUploadingImage(prev => ({ ...prev, [petId]: false }));
        }
    };

    const handleArchivePet = (pet) => {
        Alert.alert(
            '💔 Archivar Mascota',
            `¿Deseas mover a ${pet.nombre} a "Huellitas Eternas"?\n\nEsta acción marcará a tu mascota como inactiva.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Archivar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await petArchiveService.archivePet(pet.id);
                            await loadUserPets(user.uid);
                            Alert.alert('✓ Archivada', `${pet.nombre} ha sido movida a Huellitas Eternas`);
                        } catch (error) {
                            console.error('Error archivando mascota:', error);
                            Alert.alert('Error', 'No se pudo archivar la mascota.');
                        }
                    }
                }
            ]
        );
    };

    // Menú de opciones para cada mascota
    // ✅ ACTUALIZADO: Menú con opción de eliminar
const showPetOptions = (pet) => {
    Alert.alert(
        pet.nombre,
        'Selecciona una opción',
        [
            {
                text: '✏️ Editar información',
                onPress: () => navigateToOption(pet, 'edit')
            },
            {
                text: '📸 Cambiar foto',
                onPress: () => handleImageSelection(pet.id)
            },
            {
                text: '💔 Archivar mascota',
                onPress: () => handleArchivePet(pet),
                style: 'default'
            },
            {
                text: '🗑️ Eliminar permanentemente',
                onPress: () => handleDeletePet(pet),
                style: 'destructive'
            },
            {
                text: 'Cancelar',
                style: 'cancel'
            }
        ]
    );
};

// ✅ NUEVA FUNCIÓN: Eliminar mascota
const handleDeletePet = (pet) => {
    Alert.alert(
        '⚠️ Eliminar Permanentemente',
        `¿Estás seguro de que deseas eliminar a ${pet.nombre}?\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER.\n\nSe eliminarán todos los registros de vacunas, desparasitaciones y exámenes.\n\n💡 Si prefieres conservar los recuerdos, usa "Archivar mascota" en su lugar.`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const { petManagementService } = require('../../services/petServices');
                        await petManagementService.deletePet(pet.id);
                        await loadUserPets(user.uid);
                        Alert.alert('✓ Eliminada', `${pet.nombre} ha sido eliminada permanentemente`);
                    } catch (error) {
                        console.error('Error eliminando mascota:', error);
                        Alert.alert('Error', 'No se pudo eliminar la mascota: ' + error.message);
                    }
                }
            }
        ]
    );
};

    // 🎨 Tarjeta de mascota minimalista
    const PetCard = ({ pet }) => (
        <View style={styles.petCard}>
            {/* Botón de opciones en la esquina */}
            <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => showPetOptions(pet)}
            >
                <Ionicons name="ellipsis-horizontal" size={20} color="#7F8C8D" />
            </TouchableOpacity>

            {/* Imagen de la mascota centrada */}
            <View style={styles.petImageContainer}>
                <TouchableOpacity 
                    style={styles.petImageWrapper}
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
                                name="paw" 
                                size={40} 
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
                
            </View>

            {/* Información centrada */}
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.nombre}</Text>
                <Text style={styles.petBreed}>{pet.raza}</Text>
                <Text style={styles.petAge}>{calculateAge(pet.fechaNacimiento)}</Text>
            </View>

            {/* Opciones */}
            <View style={styles.optionsList}>
                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'vaccination')}
                >
                    <View style={styles.optionLeft}>
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="medical" size={18} color="#4ECDC4" />
                        </View>
                        <Text style={styles.optionText}>Vacunación</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'deworming')}
                >
                    <View style={styles.optionLeft}>
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="shield-checkmark" size={18} color="#4ECDC4" />
                        </View>
                        <Text style={styles.optionText}>Desparasitación</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.optionItem}
                    onPress={() => navigateToOption(pet, 'annual')}
                >
                    <View style={styles.optionLeft}>
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="clipboard" size={18} color="#4ECDC4" />
                        </View>
                        <Text style={styles.optionText}>Examen anual</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeContainer style={styles.container}>
            {/* Header */}
           {/* Header Mejorado con Gradiente y Logo */}
<View style={styles.headerContainer}>
    <View style={styles.header}>
        {/* Logo con ícono */}
        <View style={styles.logoContainer}>
            <View style={styles.logoIconWrapper}>
                <Ionicons name="paw" size={18} color="#fff" />
            </View>
            <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>PetCare</Text>
                <Text style={styles.logoSubtext}>Tu compañero de confianza</Text>
            </View>
        </View>
        
        {/* Botón de agregar mascota */}
        <TouchableOpacity 
            style={styles.addPetButton}
            onPress={() => navigation.navigate('PetRegister')}
            activeOpacity={0.7}
        >
            <View style={styles.addPetButtonInner}>
                <Ionicons name="add" size={20} color="#fff" />
            </View>
        </TouchableOpacity>
    </View>
</View>
            {/* Lista de mascotas */}
            <ScrollView 
                style={styles.petsContainer}
                contentContainerStyle={styles.petsContentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {userPets.length > 0 ? (
                    <>
                        {userPets.map((pet) => (
                            <PetCard key={pet.id} pet={pet} />
                        ))}
                        
                        {/* 💝 Botón de Huellitas Eternas minimalista */}
                        <TouchableOpacity 
                            style={styles.huellitasButton}
                            onPress={() => navigation.navigate('HuellitasEternas')}
                        >
                            <View style={styles.huellitasIconContainer}>
                                <Ionicons name="heart" size={22} color="#E74C3C" />
                            </View>
                            <View style={styles.huellitasTextContainer}>
                                <Text style={styles.huellitasTitle}>Huellitas Eternas</Text>
                                <Text style={styles.huellitasSubtitle}>
                                    Honra la memoria de tus compañeros
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="paw-outline" size={64} color="#ccc" />
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
            </ScrollView>
        </SafeContainer>
    );
};

export default HomeScreen;