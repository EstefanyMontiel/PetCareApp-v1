import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    Image, 
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { petArchiveService } from '../services/petServices';
import { communityService } from '../services/communityService';
import styles from '../styles/HuellitasScreenStyles';
import CreateMemoryModal from './CreateMemoryModal';
import { notificationService } from '../services/notificationService';

// ✅ Initial state for reducer
const initialState = {
    // Data states
    archivedPets: [],
    communityPosts: [],
    
    // Loading states
    loading: true,
    refreshing: false,
    sharing: false,
    addingComment: false,
    creatingMemory: false,
    uploadingImage: {},
    
    // UI states
    activeTab: 'personal',
    showShareModal: false,
    showCommentsModal: false,
    showCreateModal: false,
    
    // Selected items
    selectedPet: null,
    selectedPost: null,
    
    // Form data
    shareMessage: '',
    commentText: '',
    replyText: '',
    newMemoryImage: null,
    newMemoryPetName: '',
    newMemorySpecies: '',
    newMemoryMessage: '',
    
    // Other
    replyingTo: null,
    unreadCount: 0,
};

// ✅ Reducer function
function huellitasReducer(state, action) {
    switch (action.type) {
        case 'SET_ARCHIVED_PETS':
            return { ...state, archivedPets: action.payload, loading: false };
            
        case 'SET_COMMUNITY_POSTS':
            return { ...state, communityPosts: action.payload };
            
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
            
        case 'SET_REFRESHING':
            return { ...state, refreshing: action.payload };
            
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };
            
        case 'SET_SHARING':
            return { ...state, sharing: action.payload };
            
        case 'SET_ADDING_COMMENT':
            return { ...state, addingComment: action.payload };
            
        case 'SET_CREATING_MEMORY':
            return { ...state, creatingMemory: action.payload };
            
        case 'SET_UPLOADING_IMAGE':
            return { 
                ...state, 
                uploadingImage: { ...state.uploadingImage, [action.petId]: action.value } 
            };
            
        case 'OPEN_SHARE_MODAL':
            return { 
                ...state, 
                showShareModal: true, 
                selectedPet: action.payload 
            };
            
        case 'CLOSE_SHARE_MODAL':
            return { 
                ...state, 
                showShareModal: false, 
                selectedPet: null, 
                shareMessage: '' 
            };
            
        case 'OPEN_COMMENTS_MODAL':
            return { 
                ...state, 
                showCommentsModal: true, 
                selectedPost: action.payload,
                replyingTo: null,
                commentText: ''
            };
            
        case 'CLOSE_COMMENTS_MODAL':
            return { 
                ...state, 
                showCommentsModal: false, 
                selectedPost: null,
                replyingTo: null 
            };
            
        case 'OPEN_CREATE_MODAL':
            return {
                ...state,
                showCreateModal: true,
                newMemoryImage: null,
                newMemoryPetName: '',
                newMemorySpecies: '',
                newMemoryMessage: ''
            };
            
        case 'CLOSE_CREATE_MODAL':
            return {
                ...state,
                showCreateModal: false,
                newMemoryImage: null,
                newMemoryPetName: '',
                newMemorySpecies: '',
                newMemoryMessage: '',
                creatingMemory: false
            };
            
        case 'SET_SELECTED_POST':
            return { ...state, selectedPost: action.payload };
            
        case 'SET_REPLYING_TO':
            return { ...state, replyingTo: action.payload, replyText: '' };
            
        case 'CLEAR_REPLY':
            return { ...state, replyingTo: null, replyText: '' };
            
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };
            
        case 'UPDATE_POST_LIKES':
            return {
                ...state,
                communityPosts: state.communityPosts.map(post => {
                    if (post.id === action.postId) {
                        const hasLiked = post.likedBy?.includes(action.userId);
                        const newLikedBy = hasLiked 
                            ? post.likedBy.filter(id => id !== action.userId)
                            : [...(post.likedBy || []), action.userId];
                        
                        return {
                            ...post,
                            likes: hasLiked ? post.likes - 1 : post.likes + 1,
                            likedBy: newLikedBy
                        };
                    }
                    return post;
                })
            };
            
        case 'UPDATE_COMMENT_LIKES':
            return {
                ...state,
                selectedPost: {
                    ...state.selectedPost,
                    comments: state.selectedPost.comments.map(comment => {
                        if (comment.id === action.commentId) {
                            const hasLiked = comment.likedBy?.includes(action.userId);
                            const newLikedBy = hasLiked 
                                ? comment.likedBy.filter(id => id !== action.userId)
                                : [...(comment.likedBy || []), action.userId];
                            
                            return {
                                ...comment,
                                likes: hasLiked ? (comment.likes || 1) - 1 : (comment.likes || 0) + 1,
                                likedBy: newLikedBy
                            };
                        }
                        return comment;
                    })
                }
            };
            
        case 'ADD_COMMENT_TO_POST':
            return {
                ...state,
                communityPosts: state.communityPosts.map(post => {
                    if (post.id === state.selectedPost?.id) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), action.comment]
                        };
                    }
                    return post;
                }),
                selectedPost: state.selectedPost ? {
                    ...state.selectedPost,
                    comments: [...(state.selectedPost.comments || []), action.comment]
                } : null,
                commentText: ''
            };
            
        case 'REMOVE_POST':
            return {
                ...state,
                communityPosts: state.communityPosts.filter(p => p.id !== action.postId)
            };
            
        case 'SET_UNREAD_COUNT':
            return { ...state, unreadCount: action.payload };
            
        default:
            return state;
    }
}


export default function HuellitasEternasScreen({ navigation }) {
    const { user, userProfile } = useAuth();
    const [state, dispatch] = useReducer(huellitasReducer, initialState);

    // ✅ Referencias para scroll
    const scrollViewRef = useRef(null);
    const commentInputRef = useRef(null);

    // ✅ Memoized functions for data loading
    const loadArchivedPets = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const pets = await petArchiveService.getArchivedPets(user.uid);
            dispatch({ type: 'SET_ARCHIVED_PETS', payload: pets });
        } catch (error) {
            console.error('Error cargando mascotas archivadas:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [user.uid]);

    const loadCommunityPosts = useCallback(async () => {
        try {
            const posts = await communityService.getCommunityPosts(50);
            dispatch({ type: 'SET_COMMUNITY_POSTS', payload: posts });
        } catch (error) {
            console.error('Error cargando posts comunitarios:', error);
            dispatch({ type: 'SET_COMMUNITY_POSTS', payload: [] });
        }
    }, []);

    const loadUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount(user.uid);
            dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
        } catch (error) {
            console.error('Error cargando contador:', error);
        }
    }, [user.uid]);

    const loadData = useCallback(async () => {
        await loadArchivedPets();
        await loadCommunityPosts();
    }, [loadArchivedPets, loadCommunityPosts]);

    // ✅ Initial data loading with cleanup
    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            await requestPermissions();
            if (isMounted) {
                await loadData();
                await initializeNotifications();
                await loadUnreadCount();
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [loadData, loadUnreadCount]);

    // ✅ Keyboard listener with cleanup
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const requestPermissions = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        } catch (error) {
            console.error('Error solicitando permisos:', error);
        }
    };

    const initializeNotifications = async () => {
        try {
            const hasPermission = await notificationService.requestPermissions();
            if (hasPermission) {
                await notificationService.saveUserPushToken(user.uid);
            }
        } catch (error) {
            console.error('Error inicializando notificaciones:', error);
        }
    };

    // ✅ Ir a pantalla de notificaciones
    const handleOpenNotifications = useCallback(() => {
        navigation.navigate('UserNotifications');
    }, [navigation]);

    const handleCreateMemory = useCallback(() => {
        dispatch({ type: 'OPEN_CREATE_MODAL' });
    }, []);

// ✅ FUNCIÓN CORREGIDA: Tomar foto
const takePhotoForNewMemory = useCallback(async () => {
    try {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryImage', value: imageUri });
            Alert.alert('Éxito', 'Foto capturada correctamente');
            return imageUri;
        } else {
            Alert.alert('Aviso', 'No se capturó ninguna foto');
        }
        
        return null;
    } catch (error) {
        console.error('Error tomando foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
        return null;
    }
}, []);

// ✅ FUNCIÓN CORREGIDA: Seleccionar de galería
const pickImageForNewMemory = useCallback(async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryImage', value: imageUri });
            Alert.alert('Éxito', 'Imagen seleccionada correctamente');
            return imageUri;
        } else {
            Alert.alert('Aviso', 'No se seleccionó ninguna imagen');
        }
        
        return null;
    } catch (error) {
        console.error('Error seleccionando imagen:', error);
        Alert.alert('Error', 'No se pudo seleccionar la imagen: ' + error.message);
        return null;
    }
}, []);

// ✅ FUNCIÓN CORREGIDA: Abrir selector de imagen
const handleSelectImageForNewMemory = useCallback(() => {
    Alert.alert(
        'Agregar Foto',
        'Selecciona una opción',
        [
            { 
                text: 'Cámara', 
                onPress: () => takePhotoForNewMemory()
            },
            { 
                text: 'Galería', 
                onPress: () => pickImageForNewMemory()
            },
            { 
                text: 'Cancelar', 
                style: 'cancel'
            }
        ]
    );
}, [takePhotoForNewMemory, pickImageForNewMemory]);

// ✅ FUNCIÓN CORREGIDA: Publicar recuerdo
const handlePublishNewMemory = useCallback(async () => {
    try {
        // ✅ VALIDACIONES
        if (!state.newMemoryImage) {
            Alert.alert('Error', 'Debes agregar una foto');
            return;
        }
        
        if (!state.newMemoryPetName || state.newMemoryPetName.trim() === '') {
            Alert.alert('Error', 'Ingresa el nombre de tu mascota');
            return;
        }

        dispatch({ type: 'SET_CREATING_MEMORY', payload: true });

        // ✅ Construir objeto limpio
        const petData = {
            nombre: state.newMemoryPetName.trim(),
            especie: state.newMemorySpecies.trim() || 'Mascota',
            raza: ''
        };

        await communityService.shareMemorialDirect(
            petData,
            state.newMemoryMessage.trim(),
            state.newMemoryImage
        );

        // Cerrar modal y limpiar
        dispatch({ type: 'CLOSE_CREATE_MODAL' });
        
        // Recargar posts
        await loadCommunityPosts();

        Alert.alert('Publicado', 'Tu recuerdo ha sido compartido con la comunidad');
    } catch (error) {
        console.error('Error publicando recuerdo:', error);
        Alert.alert('Error', 'No se pudo publicar: ' + error.message);
    } finally {
        dispatch({ type: 'SET_CREATING_MEMORY', payload: false });
    }
}, [state.newMemoryImage, state.newMemoryPetName, state.newMemorySpecies, state.newMemoryMessage, loadCommunityPosts]);

    const uploadPetImage = useCallback(async (petId, imageUri) => {
        try {
            dispatch({ type: 'SET_UPLOADING_IMAGE', petId, value: true });
            await petArchiveService.uploadArchivedPetImage(petId, imageUri);
            Alert.alert('Éxito', 'Foto actualizada correctamente');
            await loadArchivedPets();
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto');
        } finally {
            dispatch({ type: 'SET_UPLOADING_IMAGE', petId, value: false });
        }
    }, [loadArchivedPets]);

    const takePhoto = useCallback(async (pet) => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    }, [uploadPetImage]);

    const pickImageFromGallery = useCallback(async (pet) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error eligiendo imagen:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    }, [uploadPetImage]);

    const handleAddPhoto = useCallback((pet) => {
        Alert.alert(
            'Agregar Foto',
            'Elige una opción',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tomar Foto', onPress: () => takePhoto(pet) },
                { text: 'Elegir de Galería', onPress: () => pickImageFromGallery(pet) },
            ]
        );
    }, [takePhoto, pickImageFromGallery]);

    const onRefresh = useCallback(async () => {
        dispatch({ type: 'SET_REFRESHING', payload: true });
        await loadData();
        dispatch({ type: 'SET_REFRESHING', payload: false });
    }, [loadData]);

    const handleShareToCommunity = useCallback((pet) => {
        if (!pet.imageUrl) {
            Alert.alert(
                'Foto requerida',
                'Para compartir en la comunidad, necesitas agregar una foto de tu mascota.',
                [
                    { text: 'Agregar Foto', onPress: () => handleAddPhoto(pet) },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
            return;
        }

        dispatch({ type: 'OPEN_SHARE_MODAL', payload: pet });
    }, [handleAddPhoto]);

    const confirmShare = useCallback(async () => {
        if (!state.selectedPet) return;

        try {
            dispatch({ type: 'SET_SHARING', payload: true });
            await communityService.shareMemorial(state.selectedPet, state.shareMessage, true);
            
            dispatch({ type: 'CLOSE_SHARE_MODAL' });
            
            Alert.alert(
                'Compartido', 
                'El recuerdo de tu mascota ha sido compartido',
                [
                    {
                        text: 'Ver en Comunidad',
                        onPress: async () => {
                            dispatch({ type: 'SET_ACTIVE_TAB', payload: 'community' });
                            await loadCommunityPosts();
                        }
                    },
                    { text: 'OK' }
                ]
            );
        } catch (error) {
            console.error('Error compartiendo:', error);
            Alert.alert('Error', 'No se pudo compartir el recuerdo');
        } finally {
            dispatch({ type: 'SET_SHARING', payload: false });
        }
    }, [state.selectedPet, state.shareMessage, loadCommunityPosts]);

    const handleLikePost = useCallback(async (postId) => {
        try {
            await communityService.likePost(postId, user.uid);
            dispatch({ type: 'UPDATE_POST_LIKES', postId, userId: user.uid });
        } catch (error) {
            console.error('Error dando like:', error);
        }
    }, [user.uid]);

    // ✅ Dar like a comentario
    const handleLikeComment = useCallback(async (commentId) => {
        try {
            await communityService.likeComment(state.selectedPost.id, commentId, user.uid);
            dispatch({ type: 'UPDATE_COMMENT_LIKES', commentId, userId: user.uid });
        } catch (error) {
            console.error('Error dando like a comentario:', error);
        }
    }, [state.selectedPost?.id, user.uid]);

    const handleOpenComments = useCallback((post) => {
        dispatch({ type: 'OPEN_COMMENTS_MODAL', payload: post });
    }, []);

    const handleAddComment = useCallback(async () => {
        if (!state.commentText.trim()) return;

        try {
            dispatch({ type: 'SET_ADDING_COMMENT', payload: true });
            const result = await communityService.addComment(
                state.selectedPost.id,
                user.uid,
                userProfile?.nombre || user.displayName || 'Usuario',
                state.commentText.trim()
            );

            dispatch({ type: 'ADD_COMMENT_TO_POST', comment: result.comment });
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error agregando comentario:', error);
            Alert.alert('Error', 'No se pudo agregar el comentario');
        } finally {
            dispatch({ type: 'SET_ADDING_COMMENT', payload: false });
        }
    }, [state.commentText, state.selectedPost?.id, user.uid, userProfile?.nombre, user.displayName]);

    // ✅ Responder a comentario
    const handleReplyToComment = useCallback((comment) => {
        dispatch({ type: 'SET_REPLYING_TO', payload: comment });
        commentInputRef.current?.focus();
    }, []);

    // ✅ Enviar respuesta
    const handleSendReply = useCallback(async () => {
        if (!state.replyText.trim() || !state.replyingTo) return;

        try {
            dispatch({ type: 'SET_ADDING_COMMENT', payload: true });
            await communityService.replyToComment(
                state.selectedPost.id,
                state.replyingTo.id,
                user.uid,
                userProfile?.nombre || user.displayName || 'Usuario',
                state.replyText.trim()
            );

            // Recargar post
            const posts = await communityService.getCommunityPosts(50);
            const updatedPost = posts.find(p => p.id === state.selectedPost.id);
            dispatch({ type: 'SET_SELECTED_POST', payload: updatedPost });
            dispatch({ type: 'SET_COMMUNITY_POSTS', payload: posts });

            dispatch({ type: 'CLEAR_REPLY' });
            Keyboard.dismiss();
        } catch (error) {
            console.error('Error respondiendo comentario:', error);
            Alert.alert('Error', 'No se pudo responder');
        } finally {
            dispatch({ type: 'SET_ADDING_COMMENT', payload: false });
        }
    }, [state.replyText, state.replyingTo, state.selectedPost?.id, user.uid, userProfile?.nombre, user.displayName]);

    const handlePostOptions = useCallback((post) => {
        const isOwnPost = post.userId === user.uid;

        const buttons = isOwnPost
            ? [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => handleDeletePost(post)
                }
            ]
            : [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Reportar', 
                    onPress: () => Alert.alert('Reportar', 'Función en desarrollo')
                }
            ];

        Alert.alert('Opciones', 'Selecciona una opción', buttons);
    }, [user.uid]);

    const handleDeletePost = useCallback((post) => {
        Alert.alert(
            'Eliminar Post',
            `¿Eliminar el recuerdo de ${post.petName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await communityService.deletePost(post.id, user.uid);
                            dispatch({ type: 'REMOVE_POST', postId: post.id });
                            Alert.alert('Eliminado', 'El post ha sido eliminado');
                        } catch (error) {
                            console.error('Error eliminando:', error);
                            Alert.alert('Error', 'No se pudo eliminar el post');
                        }
                    }
                }
            ]
        );
    }, [user.uid]);

    const handleRestorePet = useCallback((pet) => {
        Alert.alert(
            'Restaurar Mascota',
            `¿Restaurar a ${pet.nombre}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        try {
                            await petArchiveService.restorePet(pet.id);
                            await loadArchivedPets();
                            Alert.alert('Éxito', `${pet.nombre} ha sido restaurada`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo restaurar');
                        }
                    },
                },
            ]
        );
    }, [loadArchivedPets]);

    const formatDate = (date) => {
        if (!date) return 'Fecha desconocida';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatRelativeTime = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return formatDate(date);
    };

    const ArchivedPetCard = ({ pet }) => {
        const isUploading = state.uploadingImage[pet.id];

        return (
            <View style={styles.instagramCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.petAvatarContainer}>
                        {pet.imageUrl ? (
                            <Image source={{ uri: pet.imageUrl }} style={styles.petAvatar} />
                        ) : (
                            <View style={styles.petAvatarPlaceholder}>
                                <Ionicons name="paw" size={20} color="#fff" />
                            </View>
                        )}
                    </View>
                    <View style={styles.petHeaderInfo}>
                        <Text style={styles.petCardName}>{pet.nombre}</Text>
                        <Text style={styles.petCardDetails}>{pet.especie} • {pet.raza}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleAddPhoto(pet)}>
                        <Ionicons name="camera-outline" size={24} color="#262626" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.cardImageContainer}
                    onPress={() => handleAddPhoto(pet)}
                    activeOpacity={0.95}
                >
                    {pet.imageUrl ? (
                        <Image 
                            source={{ uri: pet.imageUrl }} 
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.cardImagePlaceholder}>
                            <Ionicons name="camera" size={60} color="#c7c7cc" />
                            <Text style={styles.placeholderText}>Agregar Foto</Text>
                        </View>
                    )}
                    {isUploading && (
                        <View style={styles.uploadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleShareToCommunity(pet)}
                        disabled={!pet.imageUrl}
                    >
                        <Ionicons 
                            name="share-social-outline" 
                            size={26} 
                            color={pet.imageUrl ? "#262626" : "#c7c7cc"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleRestorePet(pet)}
                    >
                        <Ionicons name="arrow-undo-outline" size={26} color="#262626" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.memorialDate}>
                        {formatDate(pet.archivedDate)}
                    </Text>
                    {pet.farewellMessage && (
                        <Text style={styles.farewellMessage} numberOfLines={2}>
                            {pet.farewellMessage}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const CommunityPostCard = ({ post }) => {
        const hasLiked = post.likedBy?.includes(user.uid);
        
        return (
            <View style={styles.instagramPost}>
                <View style={styles.postHeader}>
                    <View style={styles.postUserInfo}>
                        <View style={styles.postAvatar}>
                            <Ionicons name="person" size={20} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.postUserName}>{post.userName}</Text>
                            <Text style={styles.postLocation}>Huellitas Eternas</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handlePostOptions(post)}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#262626" />
                    </TouchableOpacity>
                </View>

                {post.imageUrl && (
                    <Image 
                        source={{ uri: post.imageUrl }} 
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.postActionsRow}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleLikePost(post.id)}
                        >
                            <Ionicons 
                                name={hasLiked ? "heart" : "heart-outline"} 
                                size={28} 
                                color={hasLiked ? "#ed4956" : "#262626"} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleOpenComments(post)}
                        >
                            <Ionicons name="chatbubble-outline" size={26} color="#262626" />
                        </TouchableOpacity>
                    </View>
                </View>

                {post.likes > 0 && (
                    <Text style={styles.likesText}>
                        {post.likes} {post.likes === 1 ? 'me gusta' : 'me gusta'}
                    </Text>
                )}

                <View style={styles.captionContainer}>
                    <Text style={styles.captionText}>
                        <Text style={styles.captionUserName}>{post.userName} </Text>
                        En memoria de <Text style={styles.petNameBold}>{post.petName}</Text>
                        {post.petSpecies && <Text style={styles.petBreed}> • {post.petSpecies}</Text>}
                        {post.message && `\n${post.message}`}
                    </Text>
                </View>

                {post.comments && post.comments.length > 0 && (
                    <TouchableOpacity 
                        style={styles.viewCommentsButton}
                        onPress={() => handleOpenComments(post)}
                    >
                        <Text style={styles.viewCommentsText}>
                            Ver {post.comments.length === 1 ? 'el comentario' : `los ${post.comments.length} comentarios`}
                        </Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.postTime}>{formatRelativeTime(post.createdAt)}</Text>
            </View>
        );
    };

    if (state.loading && state.archivedPets.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.instagramHeader}>
                <Text style={styles.instagramHeaderTitle}>Huellitas Eternas</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity 
                        style={styles.headerIconButton}
                        onPress={handleOpenNotifications}
                    >
                        <Ionicons name="notifications-outline" size={26} color="#262626" />
                        {state.unreadCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>
                                    {state.unreadCount > 9 ? '9+' : state.unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={[styles.tabButton, state.activeTab === 'personal' && styles.activeTabButton]}
                    onPress={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'personal' })}
                >
                    <Ionicons 
                        name="heart" 
                        size={22} 
                        color={state.activeTab === 'personal' ? '#262626' : '#8e8e8e'} 
                    />
                    <Text style={[styles.tabButtonText, state.activeTab === 'personal' && styles.activeTabButtonText]}>
                        Mis Recuerdos
                    </Text>
                    {state.activeTab === 'personal' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tabButton, state.activeTab === 'community' && styles.activeTabButton]}
                    onPress={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'community' })}
                >
                    <Ionicons 
                        name="people" 
                        size={22} 
                        color={state.activeTab === 'community' ? '#262626' : '#8e8e8e'} 
                    />
                    <Text style={[styles.tabButtonText, state.activeTab === 'community' && styles.activeTabButtonText]}>
                        Comunidad
                    </Text>
                    {state.activeTab === 'community' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />
                }
            >
                {state.activeTab === 'personal' ? (
                    <>
                        {state.archivedPets.length > 0 ? (
                            state.archivedPets.map(pet => (
                                <ArchivedPetCard key={pet.id} pet={pet} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="heart-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.emptyStateTitle}>
                                    Aún no hay recuerdos
                                </Text>
                                <Text style={styles.emptyStateText}>
            Los recuerdos de tus mascotas aparecerán aquí
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                    {state.communityPosts.length > 0 ? (
                            state.communityPosts.map(post => (
                                <CommunityPostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.emptyStateTitle}>
                                    Sin publicaciones
                                </Text>
                                <Text style={styles.emptyStateText}>
                                    {/* ✅ CAMBIO: Texto actualizado */}
                                    Comparte tu primer recuerdo presionando el botón +
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

{/* boton flotante  para crear recuerdo */}
            {state.activeTab === 'community' && (
                <TouchableOpacity 
                    style={styles.fab}
                    onPress={handleCreateMemory}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            )}

            {/* ✅ MEJORADO: Modal crear recuerdo con KeyboardAvoidingView */}
            <Modal
                visible={state.showCreateModal}
                onClose={() => {
                    dispatch({ type: 'CLOSE_CREATE_MODAL' });
                }}
                onSelectImage={handleSelectImageForNewMemory}
                onPublish={handlePublishNewMemory}
                loading={state.creatingMemory}
                selectedImage={state.newMemoryImage} 
                petName={state.newMemoryPetName}
                setPetName={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryPetName', value })}
                species={state.newMemorySpecies}
                setSpecies={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemorySpecies', value })}
                message={state.newMemoryMessage}
                setMessage={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryMessage', value })}
                // ← NUEVO: Pasar la imagen
                            //animationType="slide"
                            //presentationStyle="pageSheet"
            >
                <KeyboardAvoidingView 
                    style={styles.createModalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
            <View style={styles.createModalHeader}>
                <TouchableOpacity onPress={() => dispatch({ type: 'CLOSE_CREATE_MODAL' })}>
                    <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
                {/* ✅ CAMBIO: Texto más claro */}
                <Text style={styles.createModalTitle}>Compartir en Comunidad</Text>
                <TouchableOpacity 
                    onPress={handlePublishNewMemory}
                    disabled={state.creatingMemory || !state.newMemoryImage || !state.newMemoryPetName}
                >
                    {state.creatingMemory ? (
                        <ActivityIndicator size="small" color="#0095f6" />
                    ) : (
                        <Text style={[
                            styles.publishButton,
                            (!state.newMemoryImage || !state.newMemoryPetName) && styles.publishButtonDisabled
                        ]}>
                            Compartir
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
                    <ScrollView 
                        style={styles.createModalContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableOpacity 
                            style={styles.imageSelector}
                            onPress={handleSelectImageForNewMemory}
                        >
                            {state.newMemoryImage ? (
                                <Image 
                                    source={{ uri: state.newMemoryImage }} 
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.imageSelectorPlaceholder}>
                                    <Ionicons name="camera" size={60} color="#c7c7cc" />
                                    <Text style={styles.imageSelectorText}>Agregar Foto</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Nombre de tu mascota *"
                                value={state.newMemoryPetName}
                                onChangeText={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryPetName', value })}
                                placeholderTextColor="#8e8e8e"
                            />

                            <TextInput
                                style={styles.inputField}
                                placeholder="Especie (ej: Perro, Gato)"
                                value={state.newMemorySpecies}
                                onChangeText={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemorySpecies', value })}
                                placeholderTextColor="#8e8e8e"
                            />

                            <TextInput
                                style={[styles.inputField, styles.messageInput]}
                                placeholder="Comparte un recuerdo especial..."
                                value={state.newMemoryMessage}
                                onChangeText={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'newMemoryMessage', value })}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                placeholderTextColor="#8e8e8e"
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/* ✅ MEJORADO: Modal comentarios con likes y respuestas */}
            <Modal
                visible={state.showCommentsModal}
                animationType="slide"
                transparent={false}
            >
                <KeyboardAvoidingView 
                    style={styles.commentsModalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <View style={styles.commentsHeader}>
                        <TouchableOpacity onPress={() => {
                            dispatch({ type: 'CLOSE_COMMENTS_MODAL' });
                        }}>
                            <Ionicons name="arrow-back" size={28} color="#262626" />
                        </TouchableOpacity>
                        <Text style={styles.commentsHeaderTitle}>Comentarios</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <ScrollView 
                        ref={scrollViewRef}
                        style={styles.commentsList}
                        keyboardShouldPersistTaps="handled"
                    >
                        {state.selectedPost?.comments?.length > 0 ? (
                            state.selectedPost.comments.map((comment) => (
                                <View key={comment.id}>
                                    <View style={styles.commentItem}>
                                        <View style={styles.commentAvatar}>
                                            <Ionicons name="person" size={16} color="#fff" />
                                        </View>
                                        <View style={styles.commentContent}>
                                            <Text style={styles.commentUserName}>{comment.userName}</Text>
                                            <Text style={styles.commentText}>{comment.text}</Text>
                                            
                                            {/* ✅ NUEVO: Acciones de comentario */}
                                            <View style={styles.commentActions}>
                                                <TouchableOpacity 
                                                    style={styles.commentAction}
                                                    onPress={() => handleLikeComment(comment.id)}
                                                >
                                                    <Ionicons 
                                                        name={comment.likedBy?.includes(user.uid) ? "heart" : "heart-outline"} 
                                                        size={14} 
                                                        color={comment.likedBy?.includes(user.uid) ? "#ed4956" : "#8e8e8e"} 
                                                    />
                                                    {comment.likes > 0 && (
                                                        <Text style={styles.commentLikesCount}>{comment.likes}</Text>
                                                    )}
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity 
                                                    style={styles.commentAction}
                                                    onPress={() => handleReplyToComment(comment)}
                                                >
                                                    <Text style={styles.replyButton}>Responder</Text>
                                                </TouchableOpacity>
                                                
                                                <Text style={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</Text>
                                            </View>

                                            {/* ✅ NUEVO: Respuestas */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <View style={styles.repliesContainer}>
                                                    {comment.replies.map((reply) => (
                                                        <View key={reply.id} style={styles.replyItem}>
                                                            <View style={styles.replyAvatar}>
                                                                <Ionicons name="person" size={12} color="#fff" />
                                                            </View>
                                                            <View style={styles.replyContent}>
                                                                <Text style={styles.replyUserName}>{reply.userName}</Text>
                                                                <Text style={styles.replyText}>{reply.text}</Text>
                                                                <Text style={styles.replyTime}>{formatRelativeTime(reply.createdAt)}</Text>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noComments}>
                                <Ionicons name="chatbubbles-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.noCommentsText}>Sin comentarios</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* ✅ MEJORADO: Input de comentario con indicador de respuesta */}
                    <View style={styles.commentInputArea}>
                        {state.replyingTo && (
                            <View style={styles.replyingToBar}>
                                <Text style={styles.replyingToText}>
                                    Respondiendo a {state.replyingTo.userName}
                                </Text>
                                <TouchableOpacity onPress={() => dispatch({ type: 'CLEAR_REPLY' })}>
                                    <Ionicons name="close" size={20} color="#262626" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.commentInputRow}>
                            <View style={styles.commentAvatar}>
                                <Ionicons name="person" size={16} color="#fff" />
                            </View>
                            <TextInput
                                ref={commentInputRef}
                                style={styles.commentInputField}
                                placeholder={state.replyingTo ? "Escribe tu respuesta..." : "Agrega un comentario..."}
                                value={state.replyingTo ? state.replyText : state.commentText}
                                onChangeText={(value) => dispatch({ 
                                    type: 'UPDATE_FIELD', 
                                    field: state.replyingTo ? 'replyText' : 'commentText', 
                                    value 
                                })}
                                placeholderTextColor="#8e8e8e"                                multiline
                            />
                            <TouchableOpacity 
                                onPress={state.replyingTo ? handleSendReply : handleAddComment}
                                disabled={state.addingComment || (state.replyingTo ? !state.replyText.trim() : !state.commentText.trim())}
                            >
                                <Text style={[
                                    styles.sendCommentButton,
                                    (state.addingComment || (state.replyingTo ? !state.replyText.trim() : !state.commentText.trim())) && styles.sendCommentButtonDisabled
                                ]}>
                                    {state.addingComment ? '...' : 'Publicar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ✅ MEJORADO: Modal compartir con KeyboardAvoidingView */}
            <Modal
                visible={state.showShareModal}
                animationType="slide"
                transparent={true}
            >
                <KeyboardAvoidingView 
                    style={styles.shareModalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.shareModalContent}>
                        <View style={styles.shareModalHeader}>
                            <Text style={styles.shareModalTitle}>Compartir Recuerdo</Text>
                            <TouchableOpacity onPress={() => dispatch({ type: 'CLOSE_SHARE_MODAL' })}>
                                <Ionicons name="close" size={28} color="#262626" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView keyboardShouldPersistTaps="handled">
                            {state.selectedPet && state.selectedPet.imageUrl && (
                                <Image 
                                    source={{ uri: state.selectedPet.imageUrl }} 
                                    style={styles.sharePreviewImage}
                                />
                            )}

                            <TextInput
                                style={styles.shareMessageInput}
                                placeholder="Escribe un mensaje..."
                                value={state.shareMessage}
                                onChangeText={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'shareMessage', value })}
                                multiline
                                placeholderTextColor="#8e8e8e"
                            />
                        </ScrollView>

                        <TouchableOpacity 
                            style={styles.shareConfirmButton}
                            onPress={confirmShare}
                            disabled={state.sharing}
                        >
                            {state.sharing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.shareConfirmButtonText}>Compartir</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}   