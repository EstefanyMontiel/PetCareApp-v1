import { db, storage, auth } from '../config/firebase';

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
            const postRef = db.collection('memorialPosts').doc(postId);
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
            }

            return { success: true, liked: !hasLiked };
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
                id: Date.now().toString(),
                userId: userId,
                userName: userName,
                text: commentText,
                createdAt: new Date()
            };

            const updatedComments = [...(postData.comments || []), newComment];

            await postRef.update({
                comments: updatedComments,
                updatedAt: new Date()
            });

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
    }
};
