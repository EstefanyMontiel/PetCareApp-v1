    import { db, storage, auth } from '../config/firebase';
    import { imageUploadService } from './imageUploadService';
    // Servicios para Vacunación
    export const vaccinationService = {
    // Agregar nueva vacuna
    addVaccination: async (petId, vaccinationData) => {
        try {
        const docRef = await db.collection('vaccinations').add({
            petId,
            ...vaccinationData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding vaccination:', error);
        throw error;
        }
    },

    // Obtener vacunas de una mascota
    getVaccinations: async (petId) => {
        try {
        const querySnapshot = await db.collection('vaccinations')
            .where('petId', '==', petId)
            .orderBy('date', 'desc')
            .get();
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error getting vaccinations:', error);
        throw error;
        }
    },

    // Actualizar vacuna
    updateVaccination: async (vaccinationId, updateData) => {
        try {
        const vaccinationRef = doc(db, 'vaccinations', vaccinationId);
        await updateDoc(vaccinationRef, {
            ...updateData,
            updatedAt: new Date()
        });
        } catch (error) {
        console.error('Error updating vaccination:', error);
        throw error;
        }
    },

    // Eliminar vacuna
    deleteVaccination: async (vaccinationId) => {
        try {
        await deleteDoc(doc(db, 'vaccinations', vaccinationId));
        } catch (error) {
        console.error('Error deleting vaccination:', error);
        throw error;
        }
    }
    };

    // Servicios para Desparasitación
    export const dewormingService = {
    addDeworming: async (petId, dewormingData) => {
        try {
        const docRef = await addDoc(collection(db, 'dewormings'), {
            petId,
            ...dewormingData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding deworming:', error);
        throw error;
        }
    },

    getDewormings: async (petId) => {
        try {
        const q = query(
            collection(db, 'dewormings'),
            where('petId', '==', petId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error getting dewormings:', error);
        throw error;
        }
    },

    updateDeworming: async (dewormingId, updateData) => {
        try {
        const dewormingRef = doc(db, 'dewormings', dewormingId);
        await updateDoc(dewormingRef, {
            ...updateData,
            updatedAt: new Date()
        });
        } catch (error) {
        console.error('Error updating deworming:', error);
        throw error;
        }
    },

    deleteDeworming: async (dewormingId) => {
        try {
        await deleteDoc(doc(db, 'dewormings', dewormingId));
        } catch (error) {
        console.error('Error deleting deworming:', error);
        throw error;
        }
    }
    };

    // Servicios para Examen Anual
    export const annualExamService = {
    addExam: async (petId, examData) => {
        try {
        const docRef = await addDoc(collection(db, 'annualExams'), {
            petId,
            ...examData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
        } catch (error) {
        console.error('Error adding exam:', error);
        throw error;
        }
    },

    getExams: async (petId) => {
        try {
        const q = query(
            collection(db, 'annualExams'),
            where('petId', '==', petId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        } catch (error) {
        console.error('Error getting exams:', error);
        throw error;
        }
    },

    updateExam: async (examId, updateData) => {
        try {
        const examRef = doc(db, 'annualExams', examId);
        await updateDoc(examRef, {
            ...updateData,
            updatedAt: new Date()
        });
        } catch (error) {
        console.error('Error updating exam:', error);
        throw error;
        }
    },

    deleteExam: async (examId) => {
        try {
        await deleteDoc(doc(db, 'annualExams', examId));
        } catch (error) {
        console.error('Error deleting exam:', error);
        throw error;
        }
    }
    };

        // Servicios para imágenes de mascotas
    export const petImageService = {
        uploadPetImage: async (petId, imageUri) => {
            try {
            console.log('📸 Subiendo imagen para mascota activa:', petId);

            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('Usuario no autenticado');
            }

            // Subir a Cloudinary
            const result = await imageUploadService.uploadImage(imageUri, 'active_pets');

            console.log('✅ Imagen subida:', result.url);

            // Actualizar Firestore
            await db.collection('mascotas').doc(petId).update({
                imageUrl: result.url,
                imagePublicId: result.publicId,
                updatedAt: new Date()
            });

            return result.url;
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            throw error;
        }
    },

    // Actualizar URL de imagen
    updatePetImage: async (petId, imageUrl) => {
        try {
            await db.collection('mascotas').doc(petId).update({
                imageUrl: imageUrl,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error actualizando imagen:', error);
            throw error;
        }
    }, 

        deletePetImage: async (petId) => {
            try {
                const imageRef = storage.ref(`pets/${petId}/profile.jpg`);
                await imageRef.delete();
                console.log('🗑️ Imagen anterior eliminada');
            } catch (error) {
                console.log('ℹ️ No hay imagen anterior para eliminar');
            }
        }, 
    };

        export const petArchiveService = {
    // Archivar una mascota (moverla a "Huellitas Eternas")
    archivePet: async (petId) => {
        try {
            console.log('📦 Archivando mascota:', petId);
            
            await db.collection('mascotas').doc(petId).update({
                isActive: false,
                archived: true,  // ✅ Agregar campo archived también
                archivedDate: new Date(),
                updatedAt: new Date()
            });
            
            console.log('✅ Mascota archivada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error archivando mascota:', error);
            throw error;
        }
    },


    // Obtener mascotas archivadas de un usuario
    getArchivedPets: async (userId) => {
        try {
            console.log('🔍 Buscando mascotas archivadas para usuario:', userId);
            
            // Consulta simplificada sin orderBy para evitar el índice
            const snapshot = await db.collection('mascotas')
                .where('userId', '==', userId)
                .where('isActive', '==', false)  // Solo archivadas
                .get();
            
            const pets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('📦 Mascotas archivadas encontradas:', pets.length);
            
            // Ordenar en cliente por archivedDate
            return pets.sort((a, b) => {
                const dateA = a.archivedDate ? (a.archivedDate.seconds || 0) : 0;
                const dateB = b.archivedDate ? (b.archivedDate.seconds || 0) : 0;
                return dateB - dateA; // Descendente (más reciente primero)
            });
        } catch (error) {
            console.error('❌ Error obteniendo mascotas archivadas:', error);
            throw error;
        }
    },

    // Restaurar una mascota archivada
    restorePet: async (petId) => {
        try {
            console.log('🔄 Restaurando mascota:', petId);
            
            await db.collection('mascotas').doc(petId).update({
                isActive: true,
                archived: false,  // ✅ Actualizar ambos campos
                archivedDate: null,
                updatedAt: new Date()
            });
            
            console.log('✅ Mascota restaurada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error restaurando mascota:', error);
            throw error;
        }
    }, 

    // ✅ Subir imagen usando Cloudinary (SIN Firebase Storage)
    uploadArchivedPetImage: async (petId, imageUri) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('Usuario no autenticado');
            }

            console.log('📸 Subiendo imagen para mascota:', petId);
            console.log('👤 Usuario:', currentUser.uid);

            // Subir a Cloudinary
            const uploadResult = await imageUploadService.uploadImage(
                imageUri,
                'archived_pets' // Carpeta en Cloudinary
            );

            if (!uploadResult.success) {
                throw new Error('No se pudo subir la imagen');
            }

            const imageUrl = uploadResult.url;
            console.log('✅ Imagen subida a Cloudinary:', imageUrl);

            // Guardar URL en Firestore
            await db.collection('mascotas').doc(petId).update({
                imageUrl: imageUrl,
                imagePublicId: uploadResult.publicId,
                imageWidth: uploadResult.width,
                imageHeight: uploadResult.height,
                updatedAt: new Date()
            });

            console.log('✅ Firestore actualizado');

            return imageUrl;
        } catch (error) {
            console.error('❌ Error en uploadArchivedPetImage:', error);
            throw error;
        }
    },

    // Actualizar imagen de mascota archivada
    updateArchivedPetImage: async (petId, imageUrl) => {
        try {
            await db.collection('mascotas').doc(petId).update({
                imageUrl: imageUrl,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error actualizando imagen:', error);
            throw error;
        }
    }
};

export { communityService } from './communityService';
