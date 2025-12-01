import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StyleSheet
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

    // ✅ Memoized load function
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const userNotifications = await notificationService.getUserNotifications(user.uid);
            setNotifications(userNotifications);
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        } finally {
            setLoading(false);
        }
    }, [user.uid]);

    // ✅ Initial load with cleanup
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            if (isMounted) {
                await loadNotifications();
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [loadNotifications]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const handleNotificationPress = async (notification) => {
        // Marcar como leída
        if (!notification.read) {
            await notificationService.markNotificationAsRead(notification.id);
            loadNotifications(); // Recargar lista
        }

        // Navegar según el tipo
        if (notification.data?.postId) {
            navigation.navigate('HuellitasEternas', { 
                openPost: notification.data.postId 
            });
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
                return { name: 'add-circle', color: '#4ECDC4' };
            default:
                return { name: 'notifications', color: '#666' };
        }
    };

    const formatRelativeTime = (date) => {
        if (!date) return '';
        const notifDate = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diff = now - notifDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes}m`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days}d`;
        return notifDate.toLocaleDateString();
    };

    const renderNotification = ({ item }) => {
        const icon = getNotificationIcon(item.type);

        return (
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    !item.read && styles.unreadNotification
                ]}
                onPress={() => handleNotificationPress(item)}
            >
                <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                    <Ionicons name={icon.name} size={24} color={icon.color} />
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationBody}>{item.body}</Text>
                    <Text style={styles.notificationTime}>
                        {formatRelativeTime(item.createdAt)}
                    </Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    if (loading && notifications.length === 0) {
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

    return (
        <SafeContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#262626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <View style={{ width: 28 }} />
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
                        <Text style={styles.emptyStateText}>No tienes notificaciones</Text>
                    </View>
                }
            />
        </SafeContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#262626',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        alignItems: 'center',
    },
    unreadNotification: {
        backgroundColor: '#f0f8ff',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
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
        color: '#666',
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3db2d2ff',
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
});

export default UserNotificationsScreen;