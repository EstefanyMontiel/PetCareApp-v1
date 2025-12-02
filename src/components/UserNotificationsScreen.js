import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import SafeContainer from './SafeContainer';

const UserNotificationsScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const userNotifications = await notificationService. getUserNotifications(user.uid);
            setNotifications(userNotifications);
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const handleNotificationPress = async (notification) => {
        // Marcar como leída
        if (! notification.read) {
            await notificationService.markNotificationAsRead(notification.id);
            loadNotifications(); // Recargar lista
        }

        // Navegar según el tipo
        if (notification.data?. postId) {
            navigation.navigate('HuellitasEternas', { 
                openPost: notification.data.postId 
            });
        }
    };

    // ✅ NUEVO: Eliminar notificación individual
    const handleDeleteNotification = async (notificationId) => {
        try {
            await notificationService. deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la notificación');
        }
    };

    // ✅ NUEVO: Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.uid);
            await loadNotifications();
        } catch (error) {
            Alert. alert('Error', 'No se pudieron marcar las notificaciones');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return { name: 'heart', color: '#ed4956' };
            case 'comment':
                return { name: 'chatbubble', color: '#3db2d2ff' };
            case 'reply':
                return { name: 'return-down-forward', color: '#3db2d2ff' };
            case 'comment_like':
                return { name: 'heart-circle', color: '#ed4956' };
            case 'new_post':
                return { name: 'images', color: '#4ECDC4' };
            default:
                return { name: 'notifications', color: '#4ECDC4' };
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = date.toDate ?  date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const renderNotification = ({ item }) => {
        const icon = getNotificationIcon(item. type);
        
        return (
            <View style={[styles.notificationItem, ! item.read && styles.unreadNotification]}>
                <TouchableOpacity 
                    style={styles.notificationContent}
                    onPress={() => handleNotificationPress(item)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                        <Ionicons name={icon.name} size={24} color={icon.color} />
                    </View>
                    
                    <View style={styles. textContainer}>
                        <Text style={styles.notificationTitle}>{item. title}</Text>
                        <Text style={styles.notificationBody} numberOfLines={2}>
                            {item.body}
                        </Text>
                        <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
                    </View>

                    {! item.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>

                {/* ✅ NUEVO: Botón de eliminar */}
                <TouchableOpacity 
                    style={styles. deleteButton}
                    onPress={() => handleDeleteNotification(item.id)}
                >
                    <Ionicons name="close-circle" size={22} color="#8e8e8e" />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeContainer>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#262626" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
            </SafeContainer>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SafeContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#262626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                {/* ✅ NUEVO: Botón marcar todas como leídas */}
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllAsRead}>
                        <Text style={styles.markAllButton}>Marcar todas</Text>
                    </TouchableOpacity>
                )}
                {unreadCount === 0 && <View style={{ width: 28 }} />}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#4ECDC4"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={80} color="#c7c7cc" />
                        <Text style={styles.emptyText}>No tienes notificaciones</Text>
                    </View>
                }
            />
        </SafeContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dbdbdb',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#262626',
    },
    markAllButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    listContainer: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#efefef',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    unreadNotification: {
        backgroundColor: '#f0f9ff',
    },
    notificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#262626',
        marginBottom: 4,
    },
    notificationBody: {
        fontSize: 14,
        color: '#8e8e8e',
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: '#c7c7cc',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ECDC4',
        marginLeft: 8,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#8e8e8e',
        marginTop: 16,
    },
});

export default UserNotificationsScreen;