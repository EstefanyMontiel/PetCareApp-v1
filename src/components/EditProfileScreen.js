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
    const { user, userProfile, updateUserProfile, uploadProfilePhoto, loadUserProfile } = useAuth();
    const { t } = useLanguage();
    const { pickImage, takePhoto } = useImagePicker();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    
    // Errores de validación
    const [errors, setErrors] = useState({
        nombre: '',
        email: ''
    });

    // Cargar datos iniciales
    useEffect(() => {
        if (userProfile) {
            setNombre(userProfile.nombre || user?.displayName || '');
            setEmail(userProfile.correo || user?.email || '');
            setPhotoURL(userProfile.photoURL || '');
        }
    }, [userProfile, user]);

    // Validar email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validar formulario
    const validateForm = () => {
        let valid = true;
        let newErrors = { nombre: '', email: '' };

        if (!nombre.trim() || nombre.trim().length < 3) {
            newErrors.nombre = t('editProfile.nameError');
            valid = false;
        }

        if (!email.trim() || !isValidEmail(email)) {
            newErrors.email = t('editProfile.emailError');
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Manejar selección de foto
    const handlePhotoSelection = () => {
        Alert.alert(
            t('editProfile.changePhoto'),
            t('editProfile.selectOption'),
            [
                {
                    text: t('editProfile.camera'),
                    onPress: handleTakePhoto
                },
                {
                    text: t('editProfile.gallery'),
                    onPress: handlePickImage
                },
                {
                    text: t('editProfile.cancel'),
                    style: 'cancel'
                }
            ]
        );
    };

    // Tomar foto con cámara
    const handleTakePhoto = async () => {
        try {
            setUploadingPhoto(true);
            const imageUri = await takePhoto();
            
            if (imageUri) {
                const result = await uploadProfilePhoto(imageUri);
                if (result.success) {
                    setPhotoURL(result.photoURL);
                    Alert.alert(
                        t('common.success'),
                        'Foto actualizada exitosamente'
                    );
                }
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            Alert.alert(
                t('common.error'),
                'No se pudo actualizar la foto'
            );
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Seleccionar foto de galería
    const handlePickImage = async () => {
        try {
            setUploadingPhoto(true);
            const imageUri = await pickImage();
            
            if (imageUri) {
                const result = await uploadProfilePhoto(imageUri);
                if (result.success) {
                    setPhotoURL(result.photoURL);
                    Alert.alert(
                        t('common.success'),
                        'Foto actualizada exitosamente'
                    );
                }
            }
        } catch (error) {
            console.error('Error seleccionando foto:', error);
            Alert.alert(
                t('common.error'),
                'No se pudo actualizar la foto'
            );
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Guardar cambios
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Preparar datos a actualizar
            const updates = {
                nombre: nombre.trim()
            };

            // Solo actualizar email si cambió
            if (email.trim() !== (userProfile?.correo || user?.email)) {
                updates.correo = email.trim();
            }

            await updateUserProfile(updates);
            
            // Recargar perfil actualizado
            await loadUserProfile(user.uid);

            Alert.alert(
                t('common.success'),
                t('editProfile.success'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            
            let errorMessage = t('editProfile.error');
            
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Por seguridad, debes volver a iniciar sesión para cambiar tu correo';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este correo ya está en uso';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo no es válido';
            }

            Alert.alert(t('common.error'), errorMessage);
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
                    {/* Header con botón atrás */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' }}>
                            {t('editProfile.title')}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Foto de perfil */}
                        <View style={styles.photoSection}>
                            {uploadingPhoto ? (
                                <View style={styles.profileImagePlaceholder}>
                                    <ActivityIndicator size="large" color="#fff" />
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
                            
                            <TouchableOpacity 
                                style={styles.editPhotoButton}
                                onPress={handlePhotoSelection}
                                disabled={uploadingPhoto}
                            >
                                <Text style={styles.editPhotoText}>
                                    {t('editProfile.changePhoto')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Campo Nombre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('editProfile.name')}</Text>
                            <TextInput
                                style={[styles.input, errors.nombre ? styles.inputError : null]}
                                value={nombre}
                                onChangeText={(text) => {
                                    setNombre(text);
                                    if (errors.nombre) {
                                        setErrors({ ...errors, nombre: '' });
                                    }
                                }}
                                placeholder={t('editProfile.namePlaceholder')}
                                autoCapitalize="words"
                            />
                            {errors.nombre ? (
                                <Text style={styles.errorText}>{errors.nombre}</Text>
                            ) : null}
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
                                <Text style={styles.saveButtonText}>
                                    {t('editProfile.save')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingContainer>
        </SafeContainer>
    );
};

export default EditProfileScreen;
