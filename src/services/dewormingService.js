import { db } from '../config/firebase';

export const dewormingService = {
    // Guardar desparasitación
    async saveDeworming(petId, dewormingData) {
        try {
            if (!petId) throw new Error('petId es requerido');
            if (!dewormingData.product) throw new Error('Producto es requerido');

            const dewormingRef = await db
                .collection('mascotas')
                .doc(petId)
                .collection('desparasitaciones')
                .add({
                    ...dewormingData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

            console.log('✅ Desparasitación guardada:', dewormingRef.id);
            return dewormingRef.id;
        } catch (error) {
            console.error('❌ Error guardando desparasitación:', error);
            throw error;
        }
    },

    // Obtener desparasitaciones
    async getDewormings(petId) {
        try {
            const snapshot = await db
                .collection('mascotas')
                .doc(petId)
                .collection('desparasitaciones')
                .orderBy('applicationDate', 'desc')
                .get();

            const dewormings = [];
            snapshot.forEach(doc => {
                dewormings.push({ id: doc.id, ...doc.data() });
            });

            return dewormings;
        } catch (error) {
            console.error('❌ Error obteniendo desparasitaciones:', error);
            throw error;
        }
    },

    // Eliminar desparasitación
    async deleteDeworming(petId, dewormingId) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('desparasitaciones')
                .doc(dewormingId)
                .delete();
            
            console.log('✅ Desparasitación eliminada');
        } catch (error) {
            console.error('❌ Error eliminando:', error);
            throw error;
        }
    },

    // Actualizar desparasitación
    async updateDeworming(petId, dewormingId, updates) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('desparasitaciones')
                .doc(dewormingId)
                .update({
                    ...updates,
                    updatedAt: new Date()
                });
            
            console.log('✅ Desparasitación actualizada');
        } catch (error) {
            console.error('❌ Error actualizando:', error);
            throw error;
        }
    }
};