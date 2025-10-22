import { db } from '../config/firebase';

export const annualExamService = {
    // Guardar examen anual
    async saveExam(petId, examData) {
        try {
            if (!petId) throw new Error('petId es requerido');
            if (!examData.examDate) throw new Error('Fecha del examen es requerida');

            const examRef = await db
                .collection('mascotas')
                .doc(petId)
                .collection('examenesAnuales')
                .add({
                    ...examData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

            console.log('✅ Examen anual guardado:', examRef.id);
            return examRef.id;
        } catch (error) {
            console.error('❌ Error guardando examen:', error);
            throw error;
        }
    },

    // Obtener exámenes anuales
    async getExams(petId) {
        try {
            const snapshot = await db
                .collection('mascotas')
                .doc(petId)
                .collection('examenesAnuales')
                .orderBy('examDate', 'desc')
                .get();

            const exams = [];
            snapshot.forEach(doc => {
                exams.push({ id: doc.id, ...doc.data() });
            });

            return exams;
        } catch (error) {
            console.error('❌ Error obteniendo exámenes:', error);
            throw error;
        }
    },

    // Eliminar examen
    async deleteExam(petId, examId) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('examenesAnuales')
                .doc(examId)
                .delete();
            
            console.log('✅ Examen eliminado');
        } catch (error) {
            console.error('❌ Error eliminando:', error);
            throw error;
        }
    },

    // Actualizar examen
    async updateExam(petId, examId, updates) {
        try {
            await db
                .collection('mascotas')
                .doc(petId)
                .collection('examenesAnuales')
                .doc(examId)
                .update({
                    ...updates,
                    updatedAt: new Date()
                });
            
            console.log('✅ Examen actualizado');
        } catch (error) {
            console.error('❌ Error actualizando:', error);
            throw error;
        }
    }
};