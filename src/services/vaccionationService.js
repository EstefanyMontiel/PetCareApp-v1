import { db } from '../config/firebase';

export const vaccinationService = {
    // Guardar vacunación
    async saveVaccination(petId, vaccinationData) {
        try {
            // Validación de datos
            if (!petId) throw new Error('petId es requerido');
            if (!vaccinationData.vaccine) throw new Error('vaccine es requerido');

            const vaccinationRef = await db
                .collection('mascotas')
                .doc(petId)
                .collection('vacunaciones')
                .add({
                    ...vaccinationData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

            console.log('✅ Vacunación guardada:', vaccinationRef.id);
            return vaccinationRef.id;
        } catch (error) {
            console.error('❌ Error guardando vacunación:', error);
            throw error;
        }
    },

    // Obtener vacunaciones con listener en tiempo real
    listenToVaccinations(petId, callback) {
        return db
            .collection('mascotas')
            .doc(petId)
            .collection('vacunaciones')
            .orderBy('applicationDate', 'desc')
            .onSnapshot(
                (snapshot) => {
                    const vaccinations = [];
                    snapshot.forEach(doc => {
                        vaccinations.push({ id: doc.id, ...doc.data() });
                    });
                    callback(vaccinations);
                },
                (error) => {
                    console.error('Error en listener:', error);
                }
            );
    },

    // Obtener vacunaciones (una vez)
    async getVaccinations(petId) {
        try {
            const snapshot = await db
                .collection('mascotas')
                .doc(petId)
                .collection('vacunaciones')
                .orderBy('applicationDate', 'desc')
                .get();

            const vaccinations = [];
            snapshot.forEach(doc => {
                vaccinations.push({ id: doc.id, ...doc.data() });
            });

            return vaccinations;
        } catch (error) {
            console.error('❌ Error obteniendo vacunaciones:', error);
            throw error;
        }
    },

    // Eliminar vacunación
    async deleteVaccination(petId, vaccinationId) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('vacunaciones')
                .doc(vaccinationId)
                .delete();
            
            console.log('✅ Vacunación eliminada');
        } catch (error) {
            console.error('❌ Error eliminando:', error);
            throw error;
        }
    },

    // Actualizar vacunación
    async updateVaccination(petId, vaccinationId, updates) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('vacunaciones')
                .doc(vaccinationId)
                .update({
                    ...updates,
                    updatedAt: new Date()
                });
            
            console.log('✅ Vacunación actualizada');
        } catch (error) {
            console.error('❌ Error actualizando:', error);
            throw error;
        }
    },

    // Obtener estadísticas de vacunación
    async getVaccinationStats(petId) {
        try {
            const snapshot = await db
                .collection('mascotas')
                .doc(petId)
                .collection('vacunaciones')
                .get();

            return {
                total: snapshot.size,
                lastVaccination: snapshot.docs[0]?.data(),
            };
        } catch (error) {
            console.error('❌ Error obteniendo stats:', error);
            throw error;
        }
    }
};