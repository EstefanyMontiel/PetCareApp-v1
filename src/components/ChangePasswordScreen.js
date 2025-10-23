import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SafeContainer from './SafeContainer';
import KeyboardAvoidingContainer from './KeyboardAvoidingView';
import styles from '../styles/SettingsStyles';

const ChangePasswordScreen = ({ navigation }) => {
    const { changePassword } = useAuth();
    const { t } = useLanguage();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para mostrar/ocultar contraseñas
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Errores de validación
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Validar formulario
    const validateForm = () => {
        let valid = true;
        let newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (!currentPassword) {
            newErrors.currentPassword = t('changePassword.currentPasswordError');
            valid = false;
        }

        if (!newPassword || newPassword.length < 6) {
            newErrors.newPassword = t('changePassword.newPasswordError');
            valid = false;
        }

        if (newPassword === currentPassword) {
            newErrors.newPassword = t('changePassword.samePasswordError');
            valid = false;
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = t('changePassword.confirmPasswordError');
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Cambiar contraseña
    const handleChangePassword = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            await changePassword(currentPassword, newPassword);

            Alert.alert(
                t('common.success'),
                t('changePassword.success'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Error cambiando contraseña:', error);

            let errorMessage = t('changePassword.error');

            if (error.code === 'auth/wrong-password') {
                errorMessage = t('changePassword.wrongPasswordError');
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es demasiado débil';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Por seguridad, debes volver a iniciar sesión';
            }

            Alert.alert(t('common.error'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeContainer>
            <KeyboardAvoidingContainer>
                <ScrollView 
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#333' }}>
                            {t('changePassword.title')}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Información de seguridad */}
                        <View style={{
                            backgroundColor: '#E8F5F7',
                            padding: 15,
                            borderRadius: 12,
                            marginBottom: 20,
                            flexDirection: 'row'
                        }}>
                            <Ionicons name="information-circle" size={24} color="#3db2d2ff" />
                            <Text style={{ flex: 1, marginLeft: 10, color: '#333', fontSize: 14 }}>
                                Tu contraseña debe tener al menos 6 caracteres y ser diferente a la actual.
                            </Text>
                        </View>

                        {/* Campo Contraseña Actual */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                {t('changePassword.currentPassword')}
                            </Text>
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    style={[styles.input, errors.currentPassword ? styles.inputError : null]}
                                    value={currentPassword}
                                    onChangeText={(text) => {
                                        setCurrentPassword(text);
                                        if (errors.currentPassword) {
                                            setErrors({ ...errors, currentPassword: '' });
                                        }
                                    }}
                                    placeholder="••••••••"
                                    secureTextEntry={!showCurrentPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 15, top: 15 }}
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <Ionicons 
                                        name={showCurrentPassword ? "eye-off" : "eye"} 
                                        size={24} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.currentPassword ? (
                                <Text style={styles.errorText}>{errors.currentPassword}</Text>
                            ) : null}
                        </View>

                        {/* Campo Nueva Contraseña */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                {t('changePassword.newPassword')}
                            </Text>
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    style={[styles.input, errors.newPassword ? styles.inputError : null]}
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        if (errors.newPassword) {
                                            setErrors({ ...errors, newPassword: '' });
                                        }
                                    }}
                                    placeholder="••••••••"
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 15, top: 15 }}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <Ionicons 
                                        name={showNewPassword ? "eye-off" : "eye"} 
                                        size={24} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.newPassword ? (
                                <Text style={styles.errorText}>{errors.newPassword}</Text>
                            ) : null}
                        </View>

                        {/* Campo Confirmar Contraseña */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                {t('changePassword.confirmPassword')}
                            </Text>
                            <View style={{ position: 'relative' }}>
                                <TextInput
                                    style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: '' });
                                        }
                                    }}
                                    placeholder="••••••••"
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: 15, top: 15 }}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons 
                                        name={showConfirmPassword ? "eye-off" : "eye"} 
                                        size={24} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword ? (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            ) : null}
                        </View>

                        {/* Botón Cambiar Contraseña */}
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>
                                    {t('changePassword.save')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingContainer>
        </SafeContainer>
    );
};

export default ChangePasswordScreen;