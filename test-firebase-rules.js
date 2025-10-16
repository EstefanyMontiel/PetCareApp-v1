// Script para probar las reglas de Firebase
import { db, auth } from './src/config/firebase.js';

const testFirebaseRules = async () => {
    try {
        console.log('🧪 Iniciando prueba de reglas de Firebase...');
        
        // Verificar usuario autenticado
        const user = auth.currentUser;
        console.log('👤 Usuario actual:', user?.email, user?.uid);
        
        if (!user) {
            console.log('❌ No hay usuario autenticado');
            return;
        }
        
        // Intentar leer colección mascotas
        console.log('📖 Intentando leer colección mascotas...');
        const snapshot = await db.collection('mascotas').limit(1).get();
        console.log('✅ Lectura exitosa, documentos:', snapshot.size);
        
        // Intentar escribir en colección mascotas
        console.log('📝 Intentando escribir en colección mascotas...');
        const testDoc = {
            nombre: 'Test Pet',
            userId: user.uid,
            createdAt: new Date()
        };
        
        const docRef = await db.collection('mascotas').add(testDoc);
        console.log('✅ Escritura exitosa, ID:', docRef.id);
        
        // Limpiar documento de prueba
        await docRef.delete();
        console.log('🧹 Documento de prueba eliminado');
        
    } catch (error) {
        console.error('❌ Error en prueba:', error.code, error.message);
    }
};

export default testFirebaseRules;