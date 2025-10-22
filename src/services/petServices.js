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
                
                // Verificar configuración de Storage
                console.log('🗄️ Storage Bucket:', storage.app.options.storageBucket);
                
                const response = await fetch(imageUri);
                if (!response.ok) {
                    throw new Error(`Error al obtener imagen: ${response.status}`);
                }
                
                const blob = await response.blob();
                console.log('📦 Blob creado, tamaño:', blob.size, 'bytes');
                console.log('📦 Tipo de blob:', blob.type);
                
                const timestamp = Date.now();
                const imagePath = `pets/${petId}/profile_${timestamp}.jpg`;
                const imageRef = storage.ref(imagePath);
                
                console.log('📤 Iniciando upload a:', imagePath);
                console.log('📤 Storage URL:', imageRef.toString());
                
                // Subir con metadata
                const metadata = {
                    contentType: 'image/jpeg',
                    customMetadata: {
                        uploadedBy: currentUser.uid,
                        uploadedAt: new Date().toISOString()
                    }
                };
                
                const snapshot = await imageRef.put(blob, metadata);
                console.log('📊 Upload completo:', snapshot.state);
                
                const downloadURL = await snapshot.ref.getDownloadURL();
                console.log('✅ Imagen subida correctamente:', downloadURL);
                return downloadURL;
            } catch (error) {
                console.error('❌ Error uploading pet image:', error);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error message:', error.message);
                
                // Errores específicos
                if (error.code === 'storage/unauthorized') {
                    throw new Error('No tienes permisos para subir imágenes. Verifica las reglas de Storage.');
                } else if (error.code === 'storage/unknown') {
                    throw new Error('Error de conexión con Firebase Storage. Verifica tu configuración.');
                }
                
                throw error;
            }
        },

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

    // Obtener mascotas activas de un usuario
    getActivePets: async (userId) => {
        try {
            const snapshot = await db.collection('mascotas')
                .where('userId', '==', userId)
                .where('isActive', '==', true)  // Solo activas
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('❌ Error obteniendo mascotas activas:', error);
            throw error;
        }
    },

    // Obtener mascotas archivadas de un usuario
    getArchivedPets: async (userId) => {
        try {
            // Consulta simplificada sin orderBy para evitar el índice
            const snapshot = await db.collection('mascotas')
                .where('userId', '==', userId)
                .where('isActive', '==', false)  // Solo archivadas
                .get();
            
            const pets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
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

    // Restaurar una mascota archivada (opcional)
    restorePet: async (petId) => {
        try {
            console.log('🔄 Restaurando mascota:', petId);
            
            await db.collection('mascotas').doc(petId).update({
                isActive: true,
                archivedDate: null,
                updatedAt: new Date()
            });
            
            console.log('✅ Mascota restaurada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error restaurando mascota:', error);
            throw error;
        }
    }
};