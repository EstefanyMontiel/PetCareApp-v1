    import { useState } from 'react';
    import * as ImagePicker from 'expo-image-picker';
    import { Alert } from 'react-native';

    export const useImagePicker = () => {
    const [loading, setLoading] = useState(false);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        Alert.alert(
            'Permisos requeridos',
            'Necesitamos permisos para acceder a tu galería de fotos.'
        );
        return false;
        }
        return true;
    };

    const pickImage = async () => {
        try {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return null;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }
        return null;
        } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'No se pudo seleccionar la imagen');
        return null;
        }
    };

    const takePhoto = async () => {
        try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
            'Permisos requeridos',
            'Necesitamos permisos para acceder a tu cámara.'
            );
            return null;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }
        return null;
        } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
        return null;
        }
    };

    const showImageOptions = () => {
        Alert.alert(
        'Seleccionar imagen',
        'Elige una opción',
        [
            { text: 'Cámara', onPress: takePhoto },
            { text: 'Galería', onPress: pickImage },
            { text: 'Cancelar', style: 'cancel' }
        ]
        );
    };

    return {
        loading,
        setLoading,
        pickImage,
        takePhoto,
        showImageOptions
    };
    };