import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, 
    Image, Platform
    } from 'react-native';
import styles from '../styles/LoginScreenStyles';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        correo: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    // Validar campo individual
    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'correo':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.correo = 'El correo es requerido';
                } else if (!emailRegex.test(value)) {
                    newErrors.correo = 'Ingresa un correo válido';
                } else {
                    delete newErrors.correo;
                }
                break;
            case 'password':
                if (!value) {
                    newErrors.password = 'La contraseña es requerida';
                } else if (value.length < 6) {
                    newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
                } else {
                    delete newErrors.password;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en los inputs
    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            validateField(name, value);
        }
    };

    // Manejar blur (cuando el usuario sale del input)
    const handleBlur = (name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name, formData[name]);
    };

    // Validar formulario completo
    const validateForm = () => {
        const newTouched = {};
        Object.keys(formData).forEach(key => {
            newTouched[key] = true;
        });
        setTouched(newTouched);

        let isValid = true;
        Object.keys(formData).forEach(key => {
            if (!validateField(key, formData[key])) {
                isValid = false;
            }
        });

        return isValid;
    };

    // ✅ Función de login simplificada usando SOLO el contexto
    const handleLogin = async () => {
        if (!validateForm()) {
            Alert.alert(
                'Error en el formulario',
                'Por favor, corrige los errores antes de continuar',
                [{ text: 'OK' }]
            );
            return;
        }

        setLoading(true);
        try {
            console.log('🔐 Intentando inicio de sesión desde LoginScreen...');
            
            await login(formData.correo, formData.password);
            
            console.log('✅ Login exitoso en LoginScreen');

            // Limpiar formulario
            setFormData({
                correo: '',
                password: '',
            });
            setTouched({});
            
            /* Mostrar mensaje de éxito al ingresar a la pantalla homeScreen
            Alert.alert(
                '¡Inicio de Sesión Exitoso!',
                'Bienvenido'
            );*/

        } catch (error) {
            console.error('Error en login:', error);
            let errorMessage = 'Ocurrió un error durante el inicio de sesión';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El correo electrónico no es válido';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }
            
            Alert.alert('Error de inicio de sesión', errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const isFormValid = Object.keys(errors).length === 0 && formData.correo && formData.password;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                <Image style={styles.logo}
                    source={require('../../assets/LogoApp.png')}
                    resizeMode="contain"
                />
                <Text style={styles.labelTitle}>¡Bienvenido!</Text>

                {/* Campo Correo */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={[
                            styles.input,
                            touched.correo && errors.correo && styles.inputError
                        ]}
                        placeholder="ejemplo@correo.com"
                        value={formData.correo}
                        onChangeText={(text) => handleChange('correo', text)}
                        onBlur={() => handleBlur('correo')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {touched.correo && errors.correo && (
                        <Text style={styles.errorText}>{errors.correo}</Text>
                    )}
                </View>

                {/* Campo Contraseña */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={[
                            styles.input,
                            touched.password && errors.password && styles.inputError
                        ]}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        onBlur={() => handleBlur('password')}
                        secureTextEntry
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                </View>

                {/* Botón de INICIO*/}
                <TouchableOpacity
                    style={[
                        styles.button,
                        (!isFormValid || loading) && styles.buttonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={!isFormValid || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar</Text>
                    )}
                </TouchableOpacity>

                {/* Botón de Registro */}
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;