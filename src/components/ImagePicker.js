    import React, { useState } from 'react';
    import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
    import * as ImagePickerExpo from 'expo-image-picker';
    import { Ionicons } from '@expo/vector-icons';

    export default function ImagePicker({ currentImage, onImageSelected }) {
    const [selectedImage, setSelectedImage] = useState(currentImage);

    const pickImage = async () => {
        // Solicitar permisos
        const permissionResult = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
        Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a las fotos');
        return;
        }

        // Abrir selector de imágenes
        const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        });

        if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Solicitar permisos de cámara
        const permissionResult = await ImagePickerExpo.requestCameraPermissionsAsync();
        
        if (permissionResult.granted === false) {
        Alert.alert('Permiso requerido', 'Necesitas dar permiso para usar la cámara');
        return;
        }

        // Abrir cámara
        const result = await ImagePickerExpo.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        });

        if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
        {selectedImage ? (
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <View style={styles.editOverlay}>
                <Ionicons name="camera" size={30} color="#fff" />
            </View>
            </TouchableOpacity>
        ) : (
            <View style={styles.placeholderContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Ionicons name="images" size={30} color="#6B9B8E" />
                <Text style={styles.buttonText}>Seleccionar foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
                <Ionicons name="camera" size={30} color="#6B9B8E" />
                <Text style={styles.buttonText}>Tomar foto</Text>
            </TouchableOpacity>
            </View>
        )}
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        alignItems: 'center',
    },
    placeholderContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        alignItems: 'center',
        padding: 20,
        borderWidth: 2,
        borderColor: '#6B9B8E',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    buttonText: {
        marginTop: 8,
        color: '#6B9B8E',
        fontWeight: '600',
    },
    });
