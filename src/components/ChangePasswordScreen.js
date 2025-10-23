import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import KeyboardAvoidingContainer from './KeyboardAvoidingView';
import Button from './Button';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { auth } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

export default function ChangePasswordScreen({ navigation }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword || currentPassword.length < 6) {
      newErrors.currentPassword = t('changePassword.passwordLengthError');
    }

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = t('changePassword.passwordLengthError');
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      newErrors.newPassword = t('changePassword.passwordSameError');
    }

    if (!confirmPassword || confirmPassword !== newPassword) {
      newErrors.confirmPassword = t('changePassword.passwordMatchError');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reauthenticate = async (currentPassword) => {
    const user = auth.currentUser;
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return await user.reauthenticateWithCredential(credential);
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      // First, reauthenticate the user
      await reauthenticate(currentPassword);

      // If reauthentication is successful, update the password
      await user.updatePassword(newPassword);

      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('changePassword.success'),
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear fields and go back
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      console.error('Error changing password:', error);

      let errorMessage = t('changePassword.error');
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = t('changePassword.currentPasswordError');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('changePassword.passwordLengthError');
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = t('changePassword.recentLoginRequired');
      }

      Alert.alert(t('common.error'), errorMessage);
    }
  };

  return (
    <SafeContainer style={styles.container}>
      <KeyboardAvoidingContainer>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="lock-closed" size={60} color={COLORS.primary} />
            <Text style={styles.title}>{t('changePassword.title')}</Text>
            <Text style={styles.subtitle}>{t('changePassword.subtitle')}</Text>
          </View>

          {/* Current Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('changePassword.currentPassword')}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={t('changePassword.currentPasswordPlaceholder')}
                placeholderTextColor={COLORS.textTertiary}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
          </View>

          {/* New Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('changePassword.newPassword')}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t('changePassword.newPasswordPlaceholder')}
                placeholderTextColor={COLORS.textTertiary}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('changePassword.confirmPassword')}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('changePassword.confirmPasswordPlaceholder')}
                placeholderTextColor={COLORS.textTertiary}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              La contraseña debe tener al menos 6 caracteres
            </Text>
          </View>

          {/* Change Password Button */}
          <Button
            title={loading ? t('changePassword.changing') : t('changePassword.change')}
            onPress={handleChangePassword}
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
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    marginTop: verticalScale(20),
  },
  title: {
    fontSize: scale(28),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: verticalScale(16),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(16),
    color: COLORS.textSecondary,
    marginTop: verticalScale(8),
    textAlign: 'center',
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
  eyeIcon: {
    padding: SPACING.xs,
  },
  errorText: {
    fontSize: scale(12),
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.info}15`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: scale(14),
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    lineHeight: scale(20),
  },
});
