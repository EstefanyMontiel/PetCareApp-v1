import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useImagePicker } from '../hooks/useImagePicker';
import SafeContainer from './SafeContainer';
import KeyboardAvoidingContainer from './KeyboardAvoidingView';
import styles from '../styles/SettingsStyles';

const EditProfileScreen = ({ navigation }) => {
    const { user, userProfile, updateUserProfile, uploadProfilePhoto, loadUserProfile, deleteProfilePhoto } = useAuth();
    const { t } = useLanguage();
    const { pickImage, takePhoto } = useImagePicker();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setNombre(userProfile.nombre || '');
            setEmail(userProfile.correo || user?.email || '');
            setPhotoURL(userProfile.photoURL || '');
        }
    }, [userProfile, user]);

    // ✅ OPCIÓN PARA ELIMINAR O CAMBIAR FOTO
    const handlePhotoOptions = () => {
        const options = [
            {
                text: '📷 Tomar foto',
                onPress: () => selectFromCamera()
            },
            {
                text: '🖼️ Elegir de galería',
                onPress: () => selectFromGallery()
            }
        ];

        // ✅ AGREGAR OPCIÓN DE ELIMINAR si hay foto
        if (photoURL) {
            options.push({
                text: '🗑️ Eliminar foto actual',
                onPress: () => handleDeletePhoto(),
                style: 'destructive'
            });
        }

        options.push({
            text: 'Cancelar',
            style: 'cancel'
        });

        Alert.alert('Foto de perfil', 'Selecciona una opción', options);
    };

    // ✅ NUEVA FUNCIÓN: Eliminar foto de perfil
    const handleDeletePhoto = () => {
        Alert.alert(
            'Eliminar foto',
            '¿Estás seguro de que deseas eliminar tu foto de perfil?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setUploadingPhoto(true);
                            
                            // Si existe una función deleteProfilePhoto en el contexto
                            if (deleteProfilePhoto) {
                                await deleteProfilePhoto();
                            } else {
                                // Alternativa: actualizar a null
                                await updateUserProfile({ photoURL: null });
                            }
                            
                            await loadUserProfile(user.uid);
                            setPhotoURL('');
                            Alert.alert('✅ Éxito', 'Foto eliminada correctamente');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la foto');
                        } finally {
                            setUploadingPhoto(false);
                        }
                    }
                }
            ]
        );
    };

    const selectFromCamera = async () => {
        try {
            const imageUri = await takePhoto();
            if (imageUri) {
                await uploadPhoto(imageUri);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    const selectFromGallery = async () => {
        try {
            const imageUri = await pickImage();
            if (imageUri) {
                await uploadPhoto(imageUri);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la foto');
        }
    };

    const uploadPhoto = async (imageUri) => {
        try {
            setUploadingPhoto(true);
            const result = await uploadProfilePhoto(imageUri);
            
            if (result.success) {
                setPhotoURL(result.photoURL);
                Alert.alert('✅ Éxito', 'Foto actualizada correctamente');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la foto');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }

        try {
            setLoading(true);

            const updates = {
                nombre: nombre.trim()
            };

            await updateUserProfile(updates);
            await loadUserProfile(user.uid);
        
            Alert.alert('✅ Éxito', 'Perfil actualizado', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const getInitial = () => {
        return nombre?.charAt(0).toUpperCase() || 'U';
    };

    return (
        <SafeContainer>
            <KeyboardAvoidingContainer>
                <ScrollView 
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header mejorado */}
                    <View style={styles.editProfileHeader}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
                        </TouchableOpacity>
                        <Text style={styles.editProfileTitle}>
                            {t('editProfile.title')}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.photoSection}>
                            <View style={styles.photoWrapper}>
                                {uploadingPhoto ? (
                                    <View style={styles.profileImagePlaceholder}>
                                        <ActivityIndicator size="large" color="#4ECDC4" />
                                    </View>
                                ) : photoURL ? (
                                    <Image 
                                        source={{ uri: photoURL }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style={styles.profileImagePlaceholder}>
                                        <Text style={styles.profileInitial}>
                                            {getInitial()}
                                        </Text>
                                    </View>
                                )}
                                
                                {/* Botón flotante sobre la imagen */}
                                <TouchableOpacity 
                                    style={styles.editPhotoButtonFloat}
                                    onPress={handlePhotoOptions}
                                    disabled={uploadingPhoto}
                                >
                                    <Ionicons name="camera" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.editPhotoButtonText}
                                onPress={handlePhotoOptions}
                                disabled={uploadingPhoto}
                            >
                                <Text style={styles.editPhotoTextLabel}>
                                    {photoURL ? 'Cambiar o eliminar foto' : 'Agregar foto de perfil'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Campo Nombre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre completo</Text>
                            <TextInput
                                style={styles.input}
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Tu nombre"
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Campo Email (solo lectura) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Correo electrónico</Text>
                            <TextInput
                                style={[styles.input, styles.inputDisabled]}
                                value={email}
                                editable={false}
                                placeholderTextColor="#999"
                            />
                            <Text style={styles.inputHint}>
                                El correo no se puede modificar
                            </Text>
                        </View>

                        {/* Botón Guardar */}
                        <TouchableOpacity 
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.saveButtonText}>
                                        Guardar cambios
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingContainer>
        </SafeContainer>
    );
};

export default EditProfileScreen;