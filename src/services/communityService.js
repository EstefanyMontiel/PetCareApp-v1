import { db, storage, auth } from '../config/firebase';
import { notificationService } from './notificationService';

export const communityService = {
    // Compartir foto de mascota en la comunidad
    shareMemorial: async (petData, message, isPublic = true) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('Usuario no autenticado');
            }

            const memorialPost = {
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Usuario',
                petId: petData.id,
                petName: petData.nombre,
                petSpecies: petData.especie,
                petBreed: petData.raza,
                imageUrl: petData.imageUrl,
                message: message,
                isPublic: isPublic,
                likes: 0,
                likedBy: [],
                comments: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await db.collection('memorialPosts').add(memorialPost);
                        
                    // ✅ CÓDIGO CORREGIDO:
            await notificationService.createNotificationRecord(
                currentUser.uid,
                'new_post',
                '¡Post compartido!',
                `Tu recuerdo de ${petData.petName} ha sido compartido en Huellitas Eternas`, // ✅ Usar 'petData'
                { postId: docRef.id, petName: petData.nombre } // ✅ Usar 'petData'
            );
            console.log('✅ Memorial compartido exitosamente con ID:', docRef.id);

            return { id: docRef.id, success: true };
        } catch (error) {
            console.error('Error compartiendo memorial:', error);
            throw error;
        }
    },

    // Obtener posts públicos de la comunidad
    getCommunityPosts: async (limit = 20) => {
        try {
            const querySnapshot = await db.collection('memorialPosts')
                .where('isPublic', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error obteniendo posts:', error);
            throw error;
        }
    },

    // Dar like a un post
    likePost: async (postId, userId) => {
    try {
        const postRef = db. collection('memorialPosts'). doc(postId);
        const postDoc = await postRef.get();
        const postData = postDoc.data();

        const likedBy = postData.likedBy || [];
        const hasLiked = likedBy.includes(userId);

        if (hasLiked) {
            // Quitar like
            await postRef.update({
                likes: postData.likes - 1,
                likedBy: likedBy.filter(id => id !== userId),
                updatedAt: new Date()
            });
        } else {
            // Agregar like
            await postRef.update({
                likes: postData.likes + 1,
                likedBy: [...likedBy, userId],
                updatedAt: new Date()
            });

            // ✅ Enviar notificación sin verificar duplicados
            if (postData.userId !== userId) {
                const userDoc = await db.collection('users').doc(userId).get();
                const userName = userDoc. data()?.nombre || 'Alguien';

                // Crear registro de notificación
                await notificationService.createNotificationRecord(
                    postData.userId,
                    'like',
                    '❤️ Nuevo like',
                    `A ${userName} le gustó tu publicación de ${postData.petName}`,
                    { postId: postId, likedBy: userId, petName: postData.petName }
                );

            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error dando like:', error);
        throw error;
    }
},

    // Agregar comentario
    addComment: async (postId, userId, userName, commentText) => {
    try {
        const postRef = db.collection('memorialPosts').doc(postId);
        const postDoc = await postRef.get();
        const postData = postDoc.data();

        const newComment = {
            id: Date.now(). toString(),
            userId: userId,
            userName: userName,
            text: commentText,
            likes: 0,
            likedBy: [],
            replies: [],
            createdAt: new Date()
        };

        const updatedComments = [...(postData.comments || []), newComment];

        await postRef.update({
            comments: updatedComments,
            updatedAt: new Date()
        });

        // ✅ Enviar notificación sin verificar duplicados
        if (postData.userId !== userId) {
            // Crear registro de notificación
            await notificationService.createNotificationRecord(
                postData. userId,
                'comment',
                '💬 Nuevo comentario',
                `${userName} comentó en tu publicación de ${postData.petName}`,
                { postId: postId, commentId: newComment.id, commenterId: userId, petName: postData.petName }
            );

            // Enviar push notification
            await notificationService.sendPushNotificationToUser(
                postData. userId,
                '💬 Nuevo comentario',
                `${userName}: ${commentText.substring(0, 50)}${commentText.length > 50 ?  '...' : ''}`,
                { postId: postId, type: 'comment' }
            );
        }

        return { success: true, comment: newComment };
    } catch (error) {
        console.error('Error agregando comentario:', error);
        throw error;
    }
},


    // Obtener posts de un usuario específico
    getUserPosts: async (userId) => {
        try {
            const querySnapshot = await db.collection('memorialPosts')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error obteniendo posts del usuario:', error);
            throw error;
        }
    },

    // En src/services/communityService.js

// Agregar esta función nueva
// // ✅ FUNCIÓN CORREGIDA en communityService.js
shareMemorialDirect: async (petData, message, imageUri) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }

        console.log('📤 Compartiendo recuerdo directo...');
        console.log('🐾 petData recibido:', petData);
        console.log('💬 message:', message);
        console.log('📸 imageUri:', imageUri);

        // ✅ VALIDACIÓN: Verificar que petData tenga la estructura correcta
        if (!petData || !petData.nombre) {
            console.error('❌ petData inválido:', petData);
            throw new Error('Los datos de la mascota son inválidos. Falta el nombre.');
        }

        if (!imageUri) {
            throw new Error('No se proporcionó una imagen');
        }

        // Subir imagen a Cloudinary
        const { imageUploadService } = require('./imageUploadService');
        console.log('📤 Subiendo imagen a Cloudinary...');
        
        const uploadResult = await imageUploadService.uploadImage(
            imageUri,
            'community_memories'
        );

        if (!uploadResult.success) {
            throw new Error('No se pudo subir la imagen');
        }

        console.log('✅ Imagen subida:', uploadResult.url);

        // Obtener datos del usuario
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        // ✅ CORRECCIÓN: Construir el objeto con validaciones
        const memorialPost = {
            userId: currentUser.uid,
            userName: userData?.nombre || currentUser.displayName || 'Usuario',
            userPhotoURL: userData?.photoURL || null,
            petName: petData.nombre || '', // ✅ Asegurar que no sea undefined
            petSpecies: petData.especie || 'Mascota',
            petBreed: petData.raza || '',
            imageUrl: uploadResult.url,
            imagePublicId: uploadResult.publicId || '',
            message: message || '',
            isPublic: true,
            likes: 0,
            likedBy: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isDirectMemorial: true
        };

        console.log('💾 Datos a guardar en Firestore:', memorialPost);

        // Validar que no haya campos undefined
        Object.keys(memorialPost).forEach(key => {
            if (memorialPost[key] === undefined) {
                console.error(`⚠️ Campo ${key} es undefined`);
                memorialPost[key] = ''; // Reemplazar undefined por string vacío
            }
        });

        const docRef = await db.collection('memorialPosts').add(memorialPost);
        console.log('✅ Recuerdo compartido con ID:', docRef.id);

        return { success: true, postId: docRef.id };
    } catch (error) {
        console.error('❌ Error compartiendo recuerdo directo:', error);
        console.error('Detalles del error:', error.message);
        throw error;
    }
},
    // ✅ NUEVO: Dar like a un comentario
    likeComment: async (postId, commentId, userId) => {
        try {
            const postRef = db.collection('memorialPosts').doc(postId);
            const postDoc = await postRef.get();
            const postData = postDoc.data();

            const comments = postData.comments || [];
            const updatedComments = comments.map(comment => {
                if (comment.id === commentId) {
                    const likedBy = comment.likedBy || [];
                    const hasLiked = likedBy.includes(userId);

                    if (hasLiked) {
                        // Quitar like
                        return {
                            ...comment,
                            likes: (comment.likes || 1) - 1,
                            likedBy: likedBy.filter(id => id !== userId)
                        };
                    } else {
                        // ✅ NUEVO: Notificar al dueño del comentario
                        if (comment.userId !== userId) {
                            const userDoc = db.collection('users').doc(userId).get();
                            userDoc.then(doc => {
                                const userName = doc.data()?.nombre || 'Alguien';
                                
                                notificationService.createNotificationRecord(
                                    comment.userId,
                                    'comment_like',
                                    '❤️ Like en tu comentario',
                                    `A ${userName} le gustó tu comentario en ${postData.petName}`,
                                    { postId: postId, commentId: commentId }
                                );

                                notificationService.sendPushNotificationToUser(
                                    comment.userId,
                                    '❤️ Like en tu comentario',
                                    `A ${userName} le gustó tu comentario`,
                                    { postId: postId, type: 'comment_like' }
                                );
                            });
                        }

                        return {
                            ...comment,
                            likes: (comment.likes || 0) + 1,
                            likedBy: [...likedBy, userId]
                        };
                    }
                }
                return comment;
            });

            await postRef.update({
                comments: updatedComments,
                updatedAt: new Date()
            });

            return { success: true };
        } catch (error) {
            console.error('Error dando like a comentario:', error);
            throw error;
        }
    },

    // ✅ NUEVO: Responder a un comentario
   // ✅ CORREGIDO: Responder a un comentario
replyToComment: async (postId, parentCommentId, userId, userName, replyText) => {
    try {
        console.log('📝 Respondiendo comentario:', { postId, parentCommentId, userId, userName });
        
        const postRef = db.collection('memorialPosts').doc(postId);
        const postDoc = await postRef. get();
        
        if (!postDoc.exists) {
            throw new Error('El post no existe');
        }
        
        const postData = postDoc.data();

        const newReply = {
            id: Date.now().toString(),
            parentCommentId: parentCommentId,
            userId: userId,
            userName: userName,
            text: replyText,
            likes: 0,
            likedBy: [],
            createdAt: new Date()
        };

        const comments = postData.comments || [];
        
        // ✅ CRÍTICO: Usar parentCommentId (no commentId)
        const updatedComments = comments.map(comment => {
            if (comment.id === parentCommentId) {  // ✅ CORREGIDO AQUÍ
                console.log('✅ Comentario padre encontrado, agregando respuesta');
                
                // Notificar al dueño del comentario (opcional, no debe romper la funcionalidad)
                if (comment.userId !== userId) {
                    // Crear notificación en Firestore
                    notificationService. createNotificationRecord(
                        comment.userId,
                        'reply',
                        '↩️ Nueva respuesta',
                        `${userName} respondió a tu comentario`,
                        { postId: postId, commentId: parentCommentId, replyId: newReply.id }
                    ).catch(err => console.log('⚠️ Error en notificación (no crítico):', err. message));
                }

                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        });

        await postRef.update({
            comments: updatedComments,
            updatedAt: new Date()
        });

        console.log('✅ Respuesta agregada exitosamente');
        return { success: true, reply: newReply };
    } catch (error) {
        console.error('❌ Error respondiendo comentario:', error);
        throw error;
    }
},

    
    // Eliminar post
    deletePost: async (postId, userId) => {
        try {
            const postRef = db.collection('memorialPosts').doc(postId);
            const postDoc = await postRef.get();

            if (!postDoc.exists) {
                throw new Error('El post no existe');
            }

            const postData = postDoc.data();

            // Verificar que el usuario sea el dueño
            if (postData.userId !== userId) {
                throw new Error('No tienes permiso para eliminar este post');
            }

            // Eliminar el post
            await postRef.delete();
            
            console.log('✅ Post eliminado exitosamente');
            return { success: true };
        } catch (error) {
            console.error('❌ Error eliminando post:', error);
            throw error;
        }
    },

};

