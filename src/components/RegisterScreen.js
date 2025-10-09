import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/LoginScreenStyles';

export default function RegisterScreen({ navigation }) {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    // Validar campo individual
    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'nombre':
                if (!value.trim()) {
                    newErrors.nombre = 'El nombre es requerido';
                } else if (value.trim().length < 2) {
                    newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
                } else {
                    delete newErrors.nombre;
                }
                break;
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
            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Confirma tu contraseña';
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = 'Las contraseñas no coinciden';
                } else {
                    delete newErrors.confirmPassword;
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

    const handleRegister = async () => {
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
            console.log('🔐 Intentando registro...');
            
            const result = await register(formData.correo, formData.password, formData.nombre);
            
            console.log('✅ Registro exitoso');

            // Limpiar formulario
            setFormData({
                nombre: '',
                correo: '',
                password: '',
                confirmPassword: '',
            });
            setTouched({});
            setErrors({});

            // Mostrar mensaje de éxito y navegar
            Alert.alert(
                '¡Registro Exitoso!',
                'Tu cuenta ha sido creada correctamente',
                [{ 
                    text: 'Continuar', 
                    onPress: () => {
                        // La navegación se maneja automáticamente por el AuthContext
                    }
                }]
            );

        } catch (error) {
            console.error('❌ Error en registro:', error);
            
            let errorMessage = 'Ocurrió un error durante el registro';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo electrónico ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El correo electrónico no es válido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es demasiado débil';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }

            Alert.alert('Error de registro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = Object.keys(errors).length === 0 && 
                       formData.nombre && 
                       formData.correo && 
                       formData.password && 
                       formData.confirmPassword;

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
                <Text style={styles.title}>Crear Cuenta</Text>

                {/* Campo Nombre */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre completo</Text>
                    <TextInput
                        style={[
                            styles.input,
                            touched.nombre && errors.nombre && styles.inputError
                        ]}
                        placeholder="Tu nombre completo"
                        value={formData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        onBlur={() => handleBlur('nombre')}
                        autoCapitalize="words"
                    />
                    {touched.nombre && errors.nombre && (
                        <Text style={styles.errorText}>{errors.nombre}</Text>
                    )}
                </View>

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

                {/* Campo Confirmar Contraseña */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirmar Contraseña</Text>
                    <TextInput
                        style={[
                            styles.input,
                            touched.confirmPassword && errors.confirmPassword && styles.inputError
                        ]}
                        placeholder="Confirma tu contraseña"
                        value={formData.confirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        onBlur={() => handleBlur('confirmPassword')}
                        secureTextEntry
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                </View>

                {/* Botón de Registro */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        (!isFormValid || loading) && styles.buttonDisabled
                    ]}
                    onPress={handleRegister}
                    disabled={!isFormValid || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Crear Cuenta</Text>
                    )}
                </TouchableOpacity>

                {/* Botón de Login */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
                    <Text style={styles.linkText}>
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

