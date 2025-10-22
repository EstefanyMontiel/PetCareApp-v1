    import { db, storage } from '../config/firebase';
    import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where,
    orderBy,
    serverTimestamp 
    } from 'firebase/firestore';
    import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
    } from 'firebase/storage';

    class FirebaseService {
    
    // ============ OPERACIONES CON MASCOTAS ACTIVAS ============
    
    // Crear una nueva mascota
    async createPet(userId, petData, imageUri) {
        try {
        // 1. Subir imagen a Storage
        let imageUrl = null;
        if (imageUri) {
            imageUrl = await this.uploadPetImage(userId, imageUri);
        }
        
        // 2. Guardar datos en Firestore
        const petRef = await addDoc(collection(db, 'pets'), {
            ...petData,
            imageUrl: imageUrl,
            ownerId: userId,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        return { id: petRef.id, success: true };
        } catch (error) {
        console.error('Error al crear mascota:', error);
        throw error;
        }
    }
    
    // Obtener todas las mascotas activas de un usuario
    async getUserActivePets(userId) {
        try {
        const q = query(
            collection(db, 'pets'),
            where('ownerId', '==', userId),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const pets = [];
        
        querySnapshot.forEach((doc) => {
            pets.push({
            id: doc.id,
            ...doc.data()
            });
        });
        
        return pets;
        } catch (error) {
        console.error('Error al obtener mascotas activas:', error);
        throw error;
        }
    }
    
    // Actualizar información de mascota
    async updatePet(petId, updates, newImageUri = null) {
        try {
        const petRef = doc(db, 'pets', petId);
        
        // Si hay nueva imagen, subirla primero
        if (newImageUri) {
            const petDoc = await getDoc(petRef);
            const userId = petDoc.data().ownerId;
            
            // Borrar imagen anterior si existe
            if (petDoc.data().imageUrl) {
            await this.deletePetImage(petDoc.data().imageUrl);
            }
            
            // Subir nueva imagen
            const newImageUrl = await this.uploadPetImage(userId, newImageUri);
            updates.imageUrl = newImageUrl;
        }
        
        // Actualizar documento
        await updateDoc(petRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
        } catch (error) {
        console.error('Error al actualizar mascota:', error);
        throw error;
        }
    }
    
    // Archivar mascota (moverla a inactivas)
    async archivePet(petId, reason, message) {
        try {
        const petRef = doc(db, 'pets', petId);
        const petDoc = await getDoc(petRef);
        const petData = petDoc.data();
        
        // 1. Crear registro en inactivePets
        await addDoc(collection(db, 'inactivePets'), {
            ...petData,
            reason: reason, // 'fallecido', 'perdido', 'adoptado'
            farewellMessage: message,
            archivedAt: serverTimestamp(),
            originalPetId: petId
        });
        
        // 2. Actualizar estado en pets
        await updateDoc(petRef, {
            isActive: false,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
        } catch (error) {
        console.error('Error al archivar mascota:', error);
        throw error;
        }
    }
    
    // ============ OPERACIONES CON MASCOTAS INACTIVAS ============
    
    // Obtener mascotas inactivas de un usuario
    async getUserInactivePets(userId) {
        try {
        const q = query(
            collection(db, 'inactivePets'),
            where('ownerId', '==', userId),
            orderBy('archivedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const pets = [];
        
        querySnapshot.forEach((doc) => {
            pets.push({
            id: doc.id,
            ...doc.data()
            });
        });
        
        return pets;
        } catch (error) {
        console.error('Error al obtener mascotas inactivas:', error);
        throw error;
        }
    }
    
    // ============ GALERÍA COMUNITARIA ============
    
    // Compartir recuerdo en la galería comunitaria
    async shareMemory(userId, userName, petData, message, imageUri) {
        try {
        // 1. Subir imagen a Storage
        const imageUrl = await this.uploadCommunityImage(userId, imageUri);
        
        // 2. Crear post en la galería
        const postRef = await addDoc(collection(db, 'communityGallery'), {
            userId: userId,
            userName: userName,
            petName: petData.name,
            message: message,
            imageUrl: imageUrl,
            likes: 0,
            likedBy: [],
            comments: [],
            createdAt: serverTimestamp()
        });
        
        return { id: postRef.id, success: true };
        } catch (error) {
        console.error('Error al compartir recuerdo:', error);
        throw error;
        }
    }
    
    // Obtener posts de la galería comunitaria
    async getCommunityPosts(limit = 20) {
        try {
        const q = query(
            collection(db, 'communityGallery'),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const posts = [];
        
        querySnapshot.forEach((doc) => {
            posts.push({
            id: doc.id,
            ...doc.data()
            });
        });
        
        return posts;
        } catch (error) {
        console.error('Error al obtener posts comunitarios:', error);
        throw error;
        }
    }
    
    // Dar like a un post
    async likePost(postId, userId) {
        try {
        const postRef = doc(db, 'communityGallery', postId);
        const postDoc = await getDoc(postRef);
        const postData = postDoc.data();
        
        const likedBy = postData.likedBy || [];
        const likes = postData.likes || 0;
        
        if (likedBy.includes(userId)) {
            // Quitar like
            await updateDoc(postRef, {
            likes: likes - 1,
            likedBy: likedBy.filter(id => id !== userId)
            });
        } else {
            // Dar like
            await updateDoc(postRef, {
            likes: likes + 1,
            likedBy: [...likedBy, userId]
            });
        }
        
        return { success: true };
        } catch (error) {
        console.error('Error al dar like:', error);
        throw error;
        }
    }
    
    // ============ MANEJO DE IMÁGENES ============
    
    // Subir imagen de mascota a Storage
    async uploadPetImage(userId, imageUri) {
        try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        const timestamp = Date.now();
        const filename = `pet_${timestamp}.jpg`;
        const storageRef = ref(storage, `pets/${userId}/${filename}`);
        
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        
        return downloadUrl;
        } catch (error) {
        console.error('Error al subir imagen de mascota:', error);
        throw error;
        }
    }
    
    // Subir imagen a galería comunitaria
    async uploadCommunityImage(userId, imageUri) {
        try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        const timestamp = Date.now();
        const filename = `community_${timestamp}.jpg`;
        const storageRef = ref(storage, `communityGallery/${userId}/${filename}`);
        
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        
        return downloadUrl;
        } catch (error) {
        console.error('Error al subir imagen comunitaria:', error);
        throw error;
        }
    }
    
    // Eliminar imagen de Storage
    async deletePetImage(imageUrl) {
        try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        return { success: true };
        } catch (error) {
        console.error('Error al eliminar imagen:', error);
        // No lanzar error si la imagen no existe
        return { success: false };
        }
    }
    }

    export default new FirebaseService();