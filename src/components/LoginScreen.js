// src/components/LoginScreen.js
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
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SafeContainer from './SafeContainer';
import styles from '../styles/LoginScreenStyles';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validar campo individual
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
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

  const handleLogin = async () => {
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
      console.log('🔐 Intentando inicio de sesión...');

      await login(formData.correo, formData.password);

      console.log('✅ Login exitoso');

      setFormData({
        correo: '',
        password: '',
      });
      setTouched({});
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = t('auth.genericLoginError');

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('auth.userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('auth.wrongPassword');
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.invalidEmail');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.tooManyRequests');
          break;
        case 'auth/invalid-credential':
          errorMessage = t('auth.invalidCredential');
          break;
        default:
          errorMessage = error.message || t('auth.unknownError');
      }

      Alert.alert(t('auth.loginError'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 && formData.correo && formData.password;

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
            <Text style={styles.labelTitle}>{t('auth.welcome')}</Text>
            <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
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
              {touched.password && errors.password && (
                <Text style={styles.errorText}>⚠️ {errors.password}</Text>
              )}
            </View>

            {/* Botón de Iniciar Sesión */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>{t('auth.login')}</Text>
              )}
            </TouchableOpacity>

            {/* Link a Registro */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.link}
            >
              <Text style={styles.linkText}>
                {t('auth.noAccount')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {t('auth.termsFooter')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

export default LoginScreen;