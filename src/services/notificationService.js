import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Configuración de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  // ✅ Nuevo
        shouldShowList: true,  
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const notificationService = {
    // Solicitar permisos
    async requestPermissions() {
        try {
            if (!Device.isDevice) {
                Alert.alert('Error', 'Las notificaciones solo funcionan en dispositivos físicos');
                return false;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permisos denegados', 'No podrás recibir recordatorios');
                return false;
            }

            // Configurar canal de notificación en Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#4ECDC4',
                    sound: 'default',
                });
            }

            return true;
        } catch (error) {
            console.error('Error solicitando permisos:', error);
            return false;
        }
    },

    // Programar notificación
    async scheduleNotification(title, body, date, data = {}) {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return null;

            // Calcular segundos hasta la fecha
            const now = new Date();
            const targetDate = new Date(date);
            const seconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

            if (seconds <= 0) {
                Alert.alert('Error', 'La fecha debe ser futura');
                return null;
            }

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                    data: data,
                    sound: 'default',
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: {
                    seconds: seconds,
                },
            });

            console.log('✅ Notificación programada:', notificationId);
            return notificationId;
        } catch (error) {
            console.error('❌ Error programando notificación:', error);
            return null;
        }
    },

    // Programar notificación con hora específica
    async scheduleNotificationAtTime(title, body, dateTime, data = {}) {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) return null;

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                    data: data,
                    sound: 'default',
                },
                trigger: {
                    date: dateTime,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Error programando notificación:', error);
            return null;
        }
    },

    // Cancelar notificación
    async cancelNotification(notificationId) {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
            console.log('✅ Notificación cancelada');
        } catch (error) {
            console.error('❌ Error cancelando notificación:', error);
        }
    },

    // Cancelar todas las notificaciones
    async cancelAllNotifications() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('✅ Todas las notificaciones canceladas');
        } catch (error) {
            console.error('❌ Error cancelando notificaciones:', error);
        }
    },

    // Obtener notificaciones programadas
    async getScheduledNotifications() {
        try {
            const notifications = await Notifications.getAllScheduledNotificationsAsync();
            return notifications;
        } catch (error) {
            console.error('Error obteniendo notificaciones:', error);
            return [];
        }
    },
};