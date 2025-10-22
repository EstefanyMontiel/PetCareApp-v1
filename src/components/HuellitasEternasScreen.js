import React, { useState, useEffect } from 'react';
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
    KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { petArchiveService } from '../services/petServices';
import { communityService } from '../services/communityService';
import styles from '../styles/HuellitasScreenStyles';

export default function HuellitasEternasScreen({ navigation }) {
    const { user, userProfile } = useAuth();
    const [archivedPets, setArchivedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [communityPosts, setCommunityPosts] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [shareMessage, setShareMessage] = useState('');
    const [sharing, setSharing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({}); // ✅ Estado para loading de imágenes
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [addingComment, setAddingComment] = useState(false);

    useEffect(() => {
        requestPermissions(); // Solicitar permisos al cargar
        loadData();
    }, []);

    // Solicitar permisos de cámara y galería
    const requestPermissions = async () => {
        try {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (cameraPermission.status !== 'granted' || galleryPermission.status !== 'granted') {
                console.log('⚠️ Permisos de cámara/galería no concedidos');
            }
        } catch (error) {
            console.error('Error solicitando permisos:', error);
        }
    };

    // Abrir selector de imagen (simplificado para evitar problemas con Platform)
    const handleAddPhoto = async (pet) => {
        Alert.alert(
            'Agregar Foto',
            'Elige una opción',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tomar Foto', onPress: () => takePhoto(pet) },
                { text: 'Elegir de Galería', onPress: () => pickImageFromGallery(pet) },
            ]
        );
    };

    // Tomar foto con cámara
    const takePhoto = async (pet) => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    // Elegir imagen de galería
    const pickImageFromGallery = async (pet) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                await uploadPetImage(pet.id, result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error eligiendo imagen:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    // Subir imagen al servidor
    const uploadPetImage = async (petId, imageUri) => {
        try {
            setUploadingImage(prev => ({ ...prev, [petId]: true }));
            console.log(' Subiendo imagen para:', petId);

            const imageUrl = await petArchiveService.uploadArchivedPetImage(petId, imageUri);
            
            console.log(' Imagen subida exitosamente');
            Alert.alert('✓ Éxito', 'Foto actualizada correctamente');
            
            // Recargar mascotas archivadas
            await loadArchivedPets();
        } catch (error) {
            console.error('❌ Error subiendo imagen:', error);
            Alert.alert('Error', 'No se pudo actualizar la foto. Intenta nuevamente.');
        } finally {
            setUploadingImage(prev => ({ ...prev, [petId]: false }));
        }
    };

    const loadData = async () => {
        await loadArchivedPets();
        await loadCommunityPosts();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const loadArchivedPets = async () => {
        try {
            setLoading(true);
            console.log(' Iniciando carga de mascotas archivadas para usuario:', user.uid);
            
            const pets = await petArchiveService.getArchivedPets(user.uid);
            console.log(' Mascotas archivadas encontradas:', pets.length);
            console.log(' Datos de mascotas:', pets);
            
            setArchivedPets(pets);
        } catch (error) {
            console.error('❌ Error cargando mascotas archivadas:', error);
            if (archivedPets.length > 0) {
                Alert.alert('Error', 'No se pudieron cargar las mascotas archivadas');
            } else {
                // Si no hay mascotas previamente cargadas, mostrar mensaje más específico
                console.error('No hay mascotas archivadas previas y falló la carga');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadCommunityPosts = async () => {
        try {
            console.log('Cargando posts comunitarios...');
            const posts = await communityService.getCommunityPosts(50);
            console.log('Posts cargados:', posts.length);
            setCommunityPosts(posts);
        } catch (error) {
            console.error('❌ Error cargando posts comunitarios:', error);
            
            if (error.message?.includes('index') || error.code === 'failed-precondition') {
                console.log('⚠️ Índice de Firebase no disponible');
            }
            
            setCommunityPosts([]);
        }
    };

    const handleShareToCommunity = (pet) => {
        // Validar que la mascota tenga imagen
        if (!pet.imageUrl) {
            Alert.alert(
                '📸 Foto requerida',
                'Para compartir en la comunidad, necesitas agregar una foto de tu mascota.',
                [
                    {
                        text: 'Agregar Foto',
                        onPress: () => handleAddPhoto(pet)
                    },
                    { text: 'Cancelar', style: 'cancel' }
                ]
            );
            return;
        }

        setSelectedPet(pet);
        setShowShareModal(true);
    };

    const confirmShare = async () => {
        if (!selectedPet) return;

        try {
            setSharing(true);
            console.log('Compartiendo mascota:', selectedPet);
            
            await communityService.shareMemorial(selectedPet, shareMessage, true);
            
            setShowShareModal(false);
            setShareMessage('');
            setSelectedPet(null);
            
            Alert.alert(
                '✨ Compartido', 
                'El recuerdo de tu mascota ha sido compartido con la comunidad',
                [
                    {
                        text: 'Ver en Comunidad',
                        onPress: async () => {
                            setActiveTab('community');
                            await loadCommunityPosts();
                        }
                    },
                    { text: 'OK' }
                ]
            );
        } catch (error) {
            console.error('❌ Error compartiendo:', error);
            Alert.alert(
                'Error', 
                `No se pudo compartir el recuerdo.\n\n${error.message || 'Intenta nuevamente.'}`
            );
        } finally {
            setSharing(false);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            await communityService.likePost(postId, user.uid);
            
            setCommunityPosts(prevPosts => 
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const hasLiked = post.likedBy?.includes(user.uid);
                        const newLikedBy = hasLiked 
                            ? post.likedBy.filter(id => id !== user.uid)
                            : [...(post.likedBy || []), user.uid];
                        
                        return {
                            ...post,
                            likes: hasLiked ? post.likes - 1 : post.likes + 1,
                            likedBy: newLikedBy
                        };
                    }
                    return post;
                })
            );
        } catch (error) {
            console.error('Error dando like:', error);
            Alert.alert('Error', 'No se pudo dar like. Intenta nuevamente.');
        }
    };

    // Abrir modal de comentarios
    const handleOpenComments = (post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };

    // Agregar comentario
    const handleAddComment = async () => {
        if (!commentText.trim()) {
            Alert.alert('Error', 'Escribe un comentario antes de enviar');
            return;
        }

        try {
            setAddingComment(true);
            console.log('💬 Agregando comentario al post:', selectedPost.id);

            const result = await communityService.addComment(
                selectedPost.id,
                user.uid,
                userProfile?.nombre || user.displayName || 'Usuario',
                commentText.trim()
            );

            // Actualizar estado local
            setCommunityPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === selectedPost.id) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), result.comment]
                        };
                    }
                    return post;
                })
            );

            // Actualizar selectedPost para el modal
            setSelectedPost(prev => ({
                ...prev,
                comments: [...(prev.comments || []), result.comment]
            }));

            // Limpiar input
            setCommentText('');
            
            console.log('Comentario agregado');
        } catch (error) {
            console.error('Error agregando comentario:', error);
            Alert.alert('Error', 'No se pudo agregar el comentario');
        } finally {
            setAddingComment(false);
        }
    };

    ///////////////////////

    const handlePostOptions = (post) => {
        const isOwnPost = post.userId === user.uid;

        // Usar Alert para ambas plataformas (simplificado)
        const buttons = isOwnPost
            ? [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => handleDeletePost(post)
                },
                { 
                    text: 'Reportar', 
                    onPress: () => handleReportPost(post)
                }
            ]
            : [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Reportar', 
                    onPress: () => handleReportPost(post)
                }
            ];

        Alert.alert('Opciones del post', 'Selecciona una opción', buttons);
    };

    // ✅ NUEVO: Eliminar post
    const handleDeletePost = (post) => {
        Alert.alert(
            '🗑️ Eliminar Post',
            `¿Estás seguro de que deseas eliminar este recuerdo de ${post.petName}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🗑️ Eliminando post:', post.id);
                            
                            await communityService.deletePost(post.id, user.uid);
                            
                            // Actualizar estado local
                            setCommunityPosts(prevPosts => 
                                prevPosts.filter(p => p.id !== post.id)
                            );
                            
                            Alert.alert('✓ Eliminado', 'El post ha sido eliminado');
                        } catch (error) {
                            console.error('❌ Error eliminando:', error);
                            Alert.alert('Error', error.message || 'No se pudo eliminar el post');
                        }
                    }
                }
            ]
        );
    };


    ///////////////////////



    const handleRestorePet = (pet) => {
        Alert.alert(
            '🔄 Restaurar Mascota',
            `¿Deseas restaurar a ${pet.nombre} a tu lista de mascotas activas?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restaurar',
                    onPress: async () => {
                        try {
                            await petArchiveService.restorePet(pet.id);
                            await loadArchivedPets();
                            Alert.alert('✓', `${pet.nombre} ha sido restaurada`);
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo restaurar la mascota');
                        }
                    },
                },
            ]
        );
    };

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
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return formatDate(date);
    };

    // ✅ ACTUALIZADO: Tarjeta con botón de foto
    const ArchivedPetCard = ({ pet }) => {
        const isUploading = uploadingImage[pet.id];

        return (
            <View style={styles.petCard}>
                <TouchableOpacity 
                    style={styles.petImageContainer}
                    onPress={() => handleAddPhoto(pet)}
                    activeOpacity={0.8}
                >
                    {pet.imageUrl ? (
                        <Image 
                            source={{ uri: pet.imageUrl }} 
                            style={styles.petImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.petImage, styles.placeholderImage]}>
                            <Ionicons name="camera" size={40} color="#fff" />
                            <Text style={styles.addPhotoText}>Agregar Foto</Text>
                        </View>
                    )}
                    <View style={styles.imageOverlay} />
                    
                    {/* Botón de cámara flotante */}
                    <TouchableOpacity 
                        style={styles.cameraButton}
                        onPress={() => handleAddPhoto(pet)}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="camera" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.nombre}</Text>
                    <Text style={styles.petDetails}>
                        {pet.especie} • {pet.raza}
                    </Text>
                    <Text style={styles.archivedDate}>
                        💫 {formatDate(pet.archivedDate)}
                    </Text>
                    
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={[styles.shareButton, !pet.imageUrl && styles.buttonDisabled]}
                            onPress={() => handleShareToCommunity(pet)}
                            disabled={!pet.imageUrl}
                        >
                            <Ionicons name="share-social" size={16} color={pet.imageUrl ? "#4ECDC4" : "#ccc"} />
                            <Text style={[styles.shareButtonText, !pet.imageUrl && styles.disabledText]}>
                                Compartir
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.restoreButton}
                            onPress={() => handleRestorePet(pet)}
                        >
                            <Ionicons name="arrow-undo" size={16} color="#4CAF50" />
                            <Text style={styles.restoreText}>Restaurar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const CommunityPostCard = ({ post }) => {
        const hasLiked = post.likedBy?.includes(user.uid);
        const isOwnPost = post.userId === user.uid;
        return (
            <View style={styles.communityCard}>
                <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
                        <View style={styles.userAvatar}>
                            <Ionicons name="person" size={20} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.userName}>{post.userName}</Text>
                            <Text style={styles.postTime}>{formatRelativeTime(post.createdAt)}</Text>
                        </View>
                    </View>

                     {/* ✅ Botón de opciones (3 puntos) */}
                    <TouchableOpacity 
                        onPress={() => handlePostOptions(post)}
                        style={styles.optionsButton}
                    >
                        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {post.imageUrl && (
                    <Image 
                        source={{ uri: post.imageUrl }} 
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.postActions}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleLikePost(post.id)}
                    >
                        <Ionicons 
                            name={hasLiked ? "heart" : "heart-outline"} 
                            size={26} 
                            color={hasLiked ? "#FF6B6B" : "#333"} 
                        />
                    </TouchableOpacity>

                    {/* ✅ Botón de comentarios */}
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleOpenComments(post)}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {post.likes > 0 && (
                    <Text style={styles.likesCount}>
                        {post.likes} {post.likes === 1 ? 'me gusta' : 'me gusta'}
                    </Text>
                )}

                <View style={styles.postContent}>
                    <Text style={styles.petNameBold}>
                        {post.petName} 
                        <Text style={styles.petBreed}> • {post.petSpecies}</Text>
                    </Text>
                    {post.message && (
                        <Text style={styles.postMessage}>
                            <Text style={styles.userName}>{post.userName}</Text> {post.message}
                        </Text>
                    )}
                </View>

                {post.comments && post.comments.length > 0 && (
                    <TouchableOpacity 
                        style={styles.commentsSection}
                        onPress={() => handleOpenComments(post)}
                    >
                        <Text style={styles.viewComments}>
                            Ver {post.comments.length === 1 ? 'el comentario' : `los ${post.comments.length} comentarios`}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading && archivedPets.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="heart" size={32} color="#FF6B6B" />
                <Text style={styles.headerTitle}>Huellitas Eternas</Text>
                <Text style={styles.headerSubtitle}>
                    Compartiendo recuerdos 🐾
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
                    onPress={() => setActiveTab('personal')}
                >
                    <Ionicons 
                        name="folder" 
                        size={20} 
                        color={activeTab === 'personal' ? '#4ECDC4' : '#999'} 
                    />
                    <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                        Mis Recuerdos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'community' && styles.activeTab]}
                    onPress={() => setActiveTab('community')}
                >
                    <Ionicons 
                        name="people" 
                        size={20} 
                        color={activeTab === 'community' ? '#4ECDC4' : '#999'} 
                    />
                    <Text style={[styles.tabText, activeTab === 'community' && styles.activeTabText]}>
                        Comunidad
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {activeTab === 'personal' ? (
                    <>
                        {archivedPets.length > 0 ? (
                            archivedPets.map(pet => (
                                <ArchivedPetCard key={pet.id} pet={pet} />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="heart-outline" size={80} color="#ccc" />
                                <Text style={styles.emptyText}>
                                    No hay mascotas en Huellitas Eternas
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    Este espacio guardará los recuerdos de tus compañeros
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {communityPosts.length > 0 ? (
                            communityPosts.map(post => (
                                <CommunityPostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={80} color="#ccc" />
                                <Text style={styles.emptyText}>
                                    Aún no hay publicaciones en la comunidad
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    Sé el primero en compartir un recuerdo
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
 {/* ✅ NUEVO: Modal de Comentarios con KeyboardAvoidingView */}
            <Modal
                visible={showCommentsModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => {
                    setShowCommentsModal(false);
                    setCommentText('');
                }}
            >
                <KeyboardAvoidingView 
                    style={styles.commentsModalContainer}
                    behavior="padding"
                    keyboardVerticalOffset={10}
                >
                    {/* Header del modal */}
                    <View style={styles.commentsHeader}>
                        <TouchableOpacity 
                            style={styles.backButtonFloating}
                            onPress={() => {
                                setShowCommentsModal(false);
                                setCommentText('');
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#262626" />
                        </TouchableOpacity>
                        <Text style={styles.commentsHeaderTitle}>Comentarios</Text>
                        <View style={{ width: 32 }} />
                    </View>

                    {/* Lista de comentarios */}
                    <ScrollView 
                        style={styles.commentsList}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {selectedPost && selectedPost.comments && selectedPost.comments.length > 0 ? (
                            selectedPost.comments.map((comment) => (
                                <View key={comment.id} style={styles.commentItem}>
                                    <View style={styles.commentAvatar}>
                                        <Ionicons name="person" size={16} color="#fff" />
                                    </View>
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <Text style={styles.commentUserName}>
                                                {comment.userName}
                                            </Text>
                                            <Text style={styles.commentText}>
                                                {comment.text}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noCommentsContainer}>
                                <Ionicons name="chatbubbles-outline" size={80} color="#c7c7cc" />
                                <Text style={styles.noCommentsText}>
                                    Sin comentarios
                                </Text>
                                <Text style={styles.noCommentsSubtext}>
                                    Empieza la conversación.
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input de comentario (siempre visible) */}
                    <View style={styles.commentInputContainer}>
                        <View style={styles.commentInputWrapper}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Agrega un comentario..."
                                placeholderTextColor="#8e8e8e"
                                value={commentText}
                                onChangeText={setCommentText}
                                multiline
                                maxLength={500}
                                returnKeyType="send"
                                onSubmitEditing={handleAddComment}
                                blurOnSubmit={false}
                            />
                        </View>
                        <TouchableOpacity 
                            style={[
                                styles.sendButton,
                                (!commentText.trim() || addingComment) && styles.sendButtonDisabled
                            ]}
                            onPress={handleAddComment}
                            disabled={!commentText.trim() || addingComment}
                        >
                            {addingComment ? (
                                <ActivityIndicator size="small" color="#0095f6" />
                            ) : (
                                <Text style={[
                                    styles.sendButtonText,
                                    (!commentText.trim() || addingComment) && styles.sendButtonDisabled
                                ]}>
                                    Publicar
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
                {/* Modal para compartir en comunidad */}
            <Modal
                visible={showShareModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowShareModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Compartir Recuerdo</Text>
                            <TouchableOpacity onPress={() => setShowShareModal(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedPet && (
                            <View style={styles.previewSection}>
                                {selectedPet.imageUrl && (
                                    <Image 
                                        source={{ uri: selectedPet.imageUrl }} 
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                )}
                                <Text style={styles.previewPetName}>{selectedPet.nombre}</Text>
                            </View>
                        )}

                        <TextInput
                            style={styles.messageInput}
                            placeholder="Escribe un mensaje para honrar su memoria..."
                            value={shareMessage}
                            onChangeText={setShareMessage}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity 
                            style={[styles.confirmShareButton, sharing && styles.buttonDisabled]}
                            onPress={confirmShare}
                            disabled={sharing}
                        >
                            {sharing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="share-social" size={20} color="#fff" />
                                    <Text style={styles.confirmShareText}>Compartir con la Comunidad</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
