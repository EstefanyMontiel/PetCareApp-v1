import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SafeContainer from './SafeContainer';
import KeyboardAvoidingContainer from './KeyboardAvoidingView';
import Button from './Button';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { auth, db, storage } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

export default function EditProfileScreen({ navigation }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          t('editProfile.error'),
          'Necesitamos permisos para acceder a la cámara y galería'
        );
      }
    }
  };

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email || '');
        
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setName(userData.nombre || user.displayName || '');
          setPhotoURL(userData.photoURL || user.photoURL || '');
        } else {
          setName(user.displayName || '');
          setPhotoURL(user.photoURL || '');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name || name.trim().length < 3) {
      newErrors.name = t('editProfile.nameError');
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = t('editProfile.emailError');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    Alert.alert(
      t('editProfile.changePhoto'),
      '',
      [
        {
          text: t('editProfile.takePhoto'),
          onPress: () => pickImage('camera')
        },
        {
          text: t('editProfile.chooseFromGallery'),
          onPress: () => pickImage('gallery')
        },
        {
          text: t('editProfile.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        await uploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('editProfile.error'), t('editProfile.photoError'));
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a reference to the file
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;
      const storageRef = storage.ref().child(`profile_photos/${filename}`);
      
      // Upload file
      await storageRef.put(blob);
      
      // Get download URL
      const downloadURL = await storageRef.getDownloadURL();
      setPhotoURL(downloadURL);
      
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      Alert.alert(t('editProfile.error'), t('editProfile.photoError'));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      // Update email if changed
      if (email !== user.email) {
        await user.updateEmail(email);
      }

      // Update display name
      await user.updateProfile({
        displayName: name,
        photoURL: photoURL
      });

      // Update Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        nombre: name,
        correo: email,
        photoURL: photoURL,
        updatedAt: new Date()
      }, { merge: true });

      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('editProfile.success'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile:', error);
      
      let errorMessage = t('editProfile.error');
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = t('changePassword.recentLoginRequired');
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está en uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('editProfile.emailError');
      }
      
      Alert.alert(t('common.error'), errorMessage);
    }
  };

  return (
    <SafeContainer style={styles.container}>
      <KeyboardAvoidingContainer>
        <View style={styles.content}>
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={handleImagePicker}
              disabled={loading}
            >
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={60} color={COLORS.textTertiary} />
                </View>
              )}
              <View style={styles.photoOverlay}>
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoLabel}>{t('editProfile.changePhoto')}</Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.name')}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('editProfile.namePlaceholder')}
                placeholderTextColor={COLORS.textTertiary}
                editable={!loading}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.email')}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('editProfile.emailPlaceholder')}
                placeholderTextColor={COLORS.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Save Button */}
          <Button
            title={loading ? t('editProfile.saving') : t('editProfile.save')}
            onPress={handleSave}
            disabled={loading}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingContainer>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    marginTop: verticalScale(20),
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoLabel: {
    marginTop: SPACING.md,
    fontSize: scale(14),
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    paddingHorizontal: SPACING.md,
    ...SHADOW_STYLE,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  errorText: {
    fontSize: scale(12),
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
