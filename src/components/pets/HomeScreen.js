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
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { petImageService, petArchiveService } from '../../services/petServices';
import { useImagePicker } from '../../hooks/useImagePicker';
import styles from '../../styles/HomeScreenStyles';
import SafeContainer from '../SafeContainer';

const HomeScreen = ({ navigation }) => {
    const { user, userProfile, userPets, logout, loadUserPets } = useAuth();
    const { t } = useLanguage();
    const [refreshing, setRefreshing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({});
    const { pickImage, takePhoto } = useImagePicker();

    // Verificación de seguridad para evitar errores durante la inicialización
    if (!t) {
        return (
            <SafeContainer>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
            </SafeContainer>
        );
    }

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
            return `${diffDays} ${t('common.days')}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? t('common.month') : t('common.months')}`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? t('common.year') : t('common.years')}`;
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
            t('home.changeProfilePhoto'),
            t('common.selectOption'),
            [
                {
                    text: t('common.camera'),
                    onPress: () => selectImageFromCamera(petId)
                },
                {
                    text: t('common.gallery'),
                    onPress: () => selectImageFromGallery(petId)
                },
                {
                    text: t('common.cancel'),
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
            Alert.alert(t('common.success'), t('home.photoUpdateSuccess'));
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert(t('common.error'), t('home.photoUpdateError'));
        } finally {
            setUploadingImage(prev => ({ ...prev, [petId]: false }));
        }
    };

    const handleArchivePet = (pet) => {
        Alert.alert(
            t('home.archiveTitle'),
            t('home.archiveMessage', { petName: pet.nombre }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('home.archiveButton'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await petArchiveService.archivePet(pet.id);
                            await loadUserPets(user.uid);
                            Alert.alert(t('home.archiveSuccess'), t('home.archiveSuccessMessage', { petName: pet.nombre }));
                        } catch (error) {
                            console.error('Error archivando mascota:', error);
                            Alert.alert(t('common.error'), t('home.archiveError'));
                        }
                    }
                }
            ]
        );
    };

    // Menú de opciones para cada mascota
const showPetOptions = (pet) => {
    Alert.alert(
        pet.nombre,
        t('common.selectOption'),
        [
            {
                text: t('home.editInfo'),
                onPress: () => navigateToOption(pet, 'edit')
            },
            {
                text: t('home.changePhoto'),
                onPress: () => handleImageSelection(pet.id)
            },
            {
                text: t('home.archivePet'),
                onPress: () => handleArchivePet(pet),
                style: 'default'
            },
            {
                text: t('home.deletePermanently'),
                onPress: () => handleDeletePet(pet),
                style: 'destructive'
            },
            {
                text: t('common.cancel'),
                style: 'cancel'
            }
        ]
    );
};

const handleDeletePet = (pet) => {
    Alert.alert(
        t('home.deleteTitle'),
        t('home.deleteMessage', { petName: pet.nombre }),
        [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('home.deleteButton'),
                style: 'destructive',
                onPress: async () => {
                    try {
                        const { petManagementService } = require('../../services/petServices');
                        await petManagementService.deletePet(pet.id);
                        await loadUserPets(user.uid);
                        Alert.alert(t('home.deleteSuccess'), t('home.deleteSuccessMessage', { petName: pet.nombre }));
                    } catch (error) {
                        console.error('Error eliminando mascota:', error);
                        Alert.alert(t('common.error'), t('home.deleteError', { error: error.message }));
                    }
                }
            }
        ]
    );
};

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
                        <Text style={styles.optionText}>{t('home.vaccination')}</Text>
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
                        <Text style={styles.optionText}>{t('home.deworming')}</Text>
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
                        <Text style={styles.optionText}>{t('home.annualExam')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeContainer style={styles.container}>
            {/* Header */}
<View style={styles.headerContainer}>
    <View style={styles.header}>
        {/* Logo con ícono */}
            <View style={styles.logoContainer}>
            <View style={styles.logoIconWrapper}>
                <Ionicons name="paw" size={18} color="#fff" />
            </View>
            <View style={styles.logoTextContainer}>
                <Text style={styles.logoText}>{t('home.title')}</Text>
                <Text style={styles.logoSubtext}>{t('home.subtitle')}</Text>
            </View>
        </View>        <TouchableOpacity 
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
                        
                        <TouchableOpacity 
                            style={styles.huellitasButton}
                            onPress={() => navigation.navigate('HuellitasEternas')}
                        >
                            <View style={styles.huellitasIconContainer}>
                                <Ionicons name="heart" size={22} color="#E74C3C" />
                            </View>
                            <View style={styles.huellitasTextContainer}>
                                <Text style={styles.huellitasTitle}>{t('home.huellitasEternas')}</Text>
                                <Text style={styles.huellitasSubtitle}>
                                    {t('home.huellitasSubtitle')}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="paw-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>{t('home.emptyStateTitle')}</Text>
                        <Text style={styles.emptyStateText}>
                            {t('home.emptyStateText')}
                        </Text>
                        <TouchableOpacity 
                            style={styles.emptyStateButton}
                            onPress={() => navigation.navigate('PetRegister')}
                        >
                            <Text style={styles.emptyStateButtonText}>{t('home.registerPetButton')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeContainer>
    );
};

export default HomeScreen;