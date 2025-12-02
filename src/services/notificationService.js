import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import { auth, db } from '../config/firebase';


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
    
     // ✅ NUEVO: Guardar token de notificación del usuario
    async saveUserPushToken(userId) {
        try {
            if (!Device.isDevice) {
                console.log('⚠️ No es un dispositivo físico, saltando token de push');
                return null;
            }

            // Verificar si hay un projectId válido configurado
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (!projectId || projectId === 'your-project-id-here' || projectId === 'tu-project-id-aqui') {
                console.log('⚠️ No hay projectId configurado correctamente');
                console.log('💡 Solución: Ejecuta "npx eas init" para obtener un projectId válido');
                console.log('💡 Luego actualiza app.json -> extra.eas.projectId con el ID generado');
                return null;
            }

            const token = (await Notifications.getExpoPushTokenAsync({
                projectId: projectId
            })).data;

            // Guardar token en Firestore
            await db.collection('users').doc(userId).update({
                pushToken: token,
                updatedAt: new Date()
            });

            console.log('✅ Token guardado correctamente:', token);
            return token;
        } catch (error) {
            // Evitar mostrar el error completo si solo es por falta de projectId
            if (error.message && error.message.includes('projectId')) {
                console.log('⚠️ Configuración de push notifications pendiente');
                console.log('💡 Las notificaciones locales seguirán funcionando normalmente');
            } else {
                console.error('❌ Error guardando token:', error);
            }
            return null;
        }
    },

    // ✅ NUEVO: Enviar notificación push a un usuario específico
    async sendPushNotificationToUser(userId, title, body, data = {}) {
        try {
            // Obtener token del usuario
            const userDoc = await db.collection('users').doc(userId).get();
            const userData = userDoc.data();

            if (!userData || !userData.pushToken) {
                console.log('❌ Usuario no tiene token de push');
                return null;
            }

            // Verificar si el usuario tiene las notificaciones habilitadas
            if (userData.notifications && userData.notifications.enabled === false) {
                console.log('❌ Usuario tiene notificaciones deshabilitadas');
                return null;
            }

            // Enviar notificación usando Expo Push API
            const message = {
                to: userData.pushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data,
                priority: 'high',
            };

            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            const result = await response.json();
            console.log('✅ Notificación enviada:', result);
            return result;
        } catch (error) {
            console.error('❌ Error enviando notificación push:', error);
            return null;
        }
    },

    // ✅ NUEVO: Notificación local inmediata (para el usuario actual)
    async sendLocalNotification(title, body, data = {}) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                    data: data,
                    sound: 'default',
                },
                trigger: null, // null = inmediato
            });
            console.log('✅ Notificación local enviada');
        } catch (error) {
            console.error('❌ Error enviando notificación local:', error);
        }
    },

    // ✅ NUEVO: Crear notificación en Firestore (historial)
    async createNotificationRecord(recipientId, type, title, body, data = {}) {
        try {
            const notificationRef = await db.collection('notifications').add({
                recipientId: recipientId,
                type: type, // 'like', 'comment', 'new_post'
                title: title,
                body: body,
                data: data,
                read: false,
                createdAt: new Date(),
            });

            console.log('✅ Registro de notificación creado:', notificationRef.id);
            return notificationRef.id;
        } catch (error) {
            console.error('❌ Error creando registro de notificación:', error);
            return null;
        }
    },

    // ✅ NUEVO: Obtener notificaciones del usuario
    async getUserNotifications(userId, limit = 50) {
        try {
            const snapshot = await db.collection('notifications')
                .where('recipientId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('❌ Error obteniendo notificaciones:', error);
            return [];
        }
    },

    // ✅ NUEVO: Marcar notificación como leída
    async markNotificationAsRead(notificationId) {
        try {
            await db.collection('notifications').doc(notificationId).update({
                read: true,
                readAt: new Date()
            });
            console.log('✅ Notificación marcada como leída');
        } catch (error) {
            console.error('❌ Error marcando notificación:', error);
        }
    },

    // ✅ NUEVO: Obtener cantidad de notificaciones no leídas
    async getUnreadCount(userId) {
        try {
            const snapshot = await db.collection('notifications')
                .where('recipientId', '==', userId)
                .where('read', '==', false)
                .get();

            return snapshot.size;
        } catch (error) {
            console.error('❌ Error obteniendo contador:', error);
            return 0;
        }
    },

    // ✅ NUEVO: Eliminar notificación
async deleteNotification(notificationId) {
    try {
        await db. collection('notifications').doc(notificationId).delete();
        console. log('✅ Notificación eliminada');
        return { success: true };
    } catch (error) {
        console. error('❌ Error eliminando notificación:', error);
        throw error;
    }
},

// ✅ NUEVO: Marcar todas como leídas
async markAllAsRead(userId) {
    try {
        const snapshot = await db.collection('notifications')
            .where('recipientId', '==', userId)
            .where('read', '==', false)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { 
                read: true, 
                readAt: new Date() 
            });
        });

        await batch.commit();
        console.log('✅ Todas las notificaciones marcadas como leídas');
        return { success: true };
    } catch (error) {
        console.error('❌ Error marcando todas como leídas:', error);
        throw error;
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