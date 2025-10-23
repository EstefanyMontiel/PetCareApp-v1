import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import Button from './Button';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS } from '../styles/theme';
import { auth, db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationsScreen({ navigation }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    enabled: true,
    vaccines: true,
    deworming: true,
    annualExam: true,
  });

  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.notifications) {
            setNotifications(userData.notifications);
          }
        }
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user authenticated');
      }

      // Update Firestore
      await db.collection('users').doc(user.uid).set({
        notifications: notifications,
        updatedAt: new Date()
      }, { merge: true });

      setLoading(false);
      Alert.alert(
        t('common.success'),
        t('notifications.success'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Error saving notification preferences:', error);
      Alert.alert(t('common.error'), t('notifications.error'));
    }
  };

  const notificationOptions = [
    {
      key: 'enabled',
      icon: 'notifications',
      title: t('notifications.general'),
      description: t('notifications.generalDesc'),
    },
    {
      key: 'vaccines',
      icon: 'medical',
      title: t('notifications.vaccines'),
      description: t('notifications.vaccinesDesc'),
      disabled: !notifications.enabled,
    },
    {
      key: 'deworming',
      icon: 'fitness',
      title: t('notifications.deworming'),
      description: t('notifications.dewormingDesc'),
      disabled: !notifications.enabled,
    },
    {
      key: 'annualExam',
      icon: 'clipboard',
      title: t('notifications.annualExam'),
      description: t('notifications.annualExamDesc'),
      disabled: !notifications.enabled,
    },
  ];

  return (
    <SafeContainer style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="notifications" size={60} color={COLORS.primary} />
          <Text style={styles.title}>{t('notifications.title')}</Text>
          <Text style={styles.subtitle}>{t('notifications.subtitle')}</Text>
        </View>

        {/* Notification Options */}
        <View style={styles.optionsContainer}>
          {notificationOptions.map((option) => (
            <View key={option.key} style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={option.disabled ? COLORS.textTertiary : COLORS.primary} 
                />
              </View>
              <View style={styles.optionContent}>
                <Text 
                  style={[
                    styles.optionTitle,
                    option.disabled && styles.optionTitleDisabled
                  ]}
                >
                  {option.title}
                </Text>
                <Text 
                  style={[
                    styles.optionDescription,
                    option.disabled && styles.optionDescriptionDisabled
                  ]}
                >
                  {option.description}
                </Text>
              </View>
              <Switch
                value={notifications[option.key]}
                onValueChange={() => handleToggle(option.key)}
                trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
                thumbColor={notifications[option.key] ? COLORS.primary : COLORS.gray400}
                disabled={option.disabled || loading}
              />
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Las notificaciones te ayudarán a mantener al día el cuidado de tu mascota
          </Text>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? t('notifications.saving') : t('notifications.save')}
            onPress={handleSave}
            disabled={loading}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(30),
    paddingHorizontal: SPACING.lg,
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
  optionsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW_STYLE,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  optionContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  optionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  optionTitleDisabled: {
    color: COLORS.textTertiary,
  },
  optionDescription: {
    fontSize: scale(14),
    color: COLORS.textSecondary,
    lineHeight: scale(18),
  },
  optionDescriptionDisabled: {
    color: COLORS.textTertiary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.info}15`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: scale(14),
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    lineHeight: scale(20),
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
});
