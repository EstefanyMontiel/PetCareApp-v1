// src/components/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/LoginScreenStyles';
import SafeContainer from './SafeContainer';

export default function RegisterScreen({ navigation }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();

  // Validar campo individual
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          newErrors.nombre = t('auth.nameRequired');
        } else if (value.trim().length < 2) {
          newErrors.nombre = t('auth.nameMinLength');
        } else {
          delete newErrors.nombre;
        }
        break;
      case 'correo':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.correo = t('auth.emailRequired');
        } else if (!emailRegex.test(value)) {
          newErrors.correo = t('auth.emailInvalid');
        } else {
          delete newErrors.correo;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = t('auth.passwordRequired');
        } else if (value.length < 6) {
          newErrors.password = t('auth.passwordMinLength');
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = t('auth.confirmPasswordRequired');
        } else if (value !== formData.password) {
          newErrors.confirmPassword = t('auth.passwordsNotMatch');
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

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setFocusedInput(null);
    validateField(name, formData[name]);
  };

  const handleFocus = (name) => {
    setFocusedInput(name);
  };

  const validateForm = () => {
    const newTouched = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert(
        t('auth.formError'),
        t('auth.formErrorMessage'),
        [{ text: t('common.ok') }]
      );
      return;
    }

    setLoading(true);
    try {
      console.log('Intentando registro...');

      await register(formData.correo, formData.password, formData.nombre);

      console.log('✅ Registro exitoso');

      setFormData({
        nombre: '',
        correo: '',
        password: '',
        confirmPassword: '',
      });
      setTouched({});
      setErrors({});

      Alert.alert(
        t('auth.registerSuccess'),
        t('auth.registerSuccessMessage'),
        [
          {
            text: t('auth.continue'),
            onPress: () => {},
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error en registro:', error);

      let errorMessage = t('auth.genericRegisterError');

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = t('auth.emailAlreadyInUse');
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.invalidEmail');
          break;
        case 'auth/weak-password':
          errorMessage = t('auth.weakPassword');
          break;
        case 'auth/network-request-failed':
          errorMessage = t('auth.networkError');
          break;
        default:
          errorMessage = error.message || t('auth.unknownError');
      }

      Alert.alert(t('auth.registerError'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.nombre &&
    formData.correo &&
    formData.password &&
    formData.confirmPassword;

  // Calcular fuerza de contraseña
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con Logo */}
          <View style={styles.headerContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/LogoApp.png')}
              resizeMode="contain"
            />
            <Text style={styles.labelTitle}>{t('auth.createAccount')}</Text>
            <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Nombre */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.fullName')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'nombre' && styles.inputFocused,
                    touched.nombre && errors.nombre && styles.inputError,
                  ]}
                  placeholder={t('auth.fullNamePlaceholder')}
                  placeholderTextColor="#BDC3C7"
                  value={formData.nombre}
                  onChangeText={(text) => handleChange('nombre', text)}
                  onBlur={() => handleBlur('nombre')}
                  onFocus={() => handleFocus('nombre')}
                  autoCapitalize="words"
                />
                {formData.nombre && !errors.nombre && (
                  <View style={styles.inputIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                  </View>
                )}
              </View>
              {touched.nombre && errors.nombre && (
                <Text style={styles.errorText}>⚠️ {errors.nombre}</Text>
              )}
            </View>

            {/* Campo Correo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'correo' && styles.inputFocused,
                    touched.correo && errors.correo && styles.inputError,
                  ]}
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor="#BDC3C7"
                  value={formData.correo}
                  onChangeText={(text) => handleChange('correo', text)}
                  onBlur={() => handleBlur('correo')}
                  onFocus={() => handleFocus('correo')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {formData.correo && !errors.correo && (
                  <View style={styles.inputIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                  </View>
                )}
              </View>
              {touched.correo && errors.correo && (
                <Text style={styles.errorText}>⚠️ {errors.correo}</Text>
              )}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'password' && styles.inputFocused,
                    touched.password && errors.password && styles.inputError,
                    { paddingRight: 50 },
                  ]}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor="#BDC3C7"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => handleFocus('password')}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>
              
              {/* Indicador de fuerza de contraseña */}
              {formData.password && (
                <View style={styles.passwordStrengthContainer}>
                  {[1, 2, 3, 4].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.passwordStrengthBar,
                        passwordStrength >= level &&
                          styles.passwordStrengthBarActive,
                      ]}
                    />
                  ))}
                </View>
              )}
              
              {touched.password && errors.password && (
                <Text style={styles.errorText}>⚠️ {errors.password}</Text>
              )}
            </View>

            {/* Campo Confirmar Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'confirmPassword' && styles.inputFocused,
                    touched.confirmPassword &&
                      errors.confirmPassword &&
                      styles.inputError,
                    { paddingRight: 50 },
                  ]}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  placeholderTextColor="#BDC3C7"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  onBlur={() => handleBlur('confirmPassword')}
                  onFocus={() => handleFocus('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>
              )}
            </View>

            {/* Botón de Registro */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>{t('auth.register')}</Text>
              )}
            </TouchableOpacity>

            {/* Link a Login */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.link}
            >
              <Text style={styles.linkText}>
                {t('auth.hasAccount')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {t('auth.registerTerms')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}