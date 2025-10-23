import { db } from '../config/firebase';

export const agendaService = {
    // Crear evento/recordatorio
    async createEvent(userId, eventData) {
        try {
            const eventRef = await db.collection('eventos').add({
                userId: userId,
                ...eventData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log('✅ Evento creado:', eventRef.id);
            return eventRef.id;
        } catch (error) {
            console.error('❌ Error creando evento:', error);
            throw error;
        }
    },

    // Obtener eventos de un usuario
    async getUserEvents(userId) {
        try {
            const snapshot = await db
                .collection('eventos')
                .where('userId', '==', userId)
                .orderBy('date', 'asc')
                .get();

            const events = [];
            snapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return events;
        } catch (error) {
            console.error('❌ Error obteniendo eventos:', error);
            throw error;
        }
    },

    // Obtener eventos de un día específico
    async getEventsByDate(userId, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const snapshot = await db
                .collection('eventos')
                .where('userId', '==', userId)
                .where('date', '>=', startOfDay)
                .where('date', '<=', endOfDay)
                .orderBy('date', 'asc')
                .get();

            const events = [];
            snapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return events;
        } catch (error) {
            console.error('❌ Error obteniendo eventos por fecha:', error);
            throw error;
        }
    },

    // Actualizar evento
    async updateEvent(eventId, updates) {
        try {
            await db.collection('eventos').doc(eventId).update({
                ...updates,
                updatedAt: new Date(),
            });

            console.log('✅ Evento actualizado');
        } catch (error) {
            console.error('❌ Error actualizando evento:', error);
            throw error;
        }
    },

    // Eliminar evento
    async deleteEvent(eventId) {
        try {
            await db.collection('eventos').doc(eventId).delete();
            console.log('✅ Evento eliminado');
        } catch (error) {
            console.error('❌ Error eliminando evento:', error);
            throw error;
        }
    },

    // Marcar evento como completado
    async markEventAsCompleted(eventId, completed = true) {
        try {
            await db.collection('eventos').doc(eventId).update({
                completed: completed,
                completedAt: completed ? new Date() : null,
                updatedAt: new Date(),
            });

            console.log('✅ Evento marcado como completado');
        } catch (error) {
            console.error('❌ Error marcando evento:', error);
            throw error;
        }
    },
};