    import { db, storage, auth } from '../config/firebase';
    
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
    // Subir imagen de mascota
    uploadPetImage: async (petId, imageUri) => {
        try {
        console.log('📸 Subiendo imagen para mascota:', petId);
        console.log('📸 URI de imagen:', imageUri);
        
        // Verificar que el usuario esté autenticado
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }
        console.log('👤 Usuario autenticado:', currentUser.email);
        
        const response = await fetch(imageUri);
        if (!response.ok) {
            throw new Error(`Error al obtener imagen: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log('📦 Blob creado, tamaño:', blob.size);
        
        const timestamp = Date.now();
        const imageRef = storage.ref(`pets/${petId}/profile_${timestamp}.jpg`);
        
        console.log('📤 Iniciando upload a:', `pets/${petId}/profile_${timestamp}.jpg`);
        const snapshot = await imageRef.put(blob);
        
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('✅ Imagen subida correctamente:', downloadURL);
        return downloadURL;
        } catch (error) {
        console.error('❌ Error uploading pet image:', error);
        console.error('❌ Error details:', error.message);
        throw error;
        }
    },

    // Actualizar imagen de mascota en Firestore
    updatePetImage: async (petId, imageUrl) => {
        try {
        console.log('📝 Actualizando URL de imagen en Firestore para:', petId);
        
        await db.collection('mascotas').doc(petId).update({
            imageUrl,
            updatedAt: new Date()
        });
        
        console.log('✅ URL de imagen actualizada en Firestore');
        } catch (error) {
        console.error('❌ Error updating pet image:', error);
        throw error;
        }
    },

    // Eliminar imagen anterior
    deletePetImage: async (petId) => {
        try {
        const imageRef = storage.ref(`pets/${petId}/profile.jpg`);
        await imageRef.delete();
        console.log('🗑️ Imagen anterior eliminada');
        } catch (error) {
        console.log('ℹ️ No hay imagen anterior para eliminar');
        }
    }
    };