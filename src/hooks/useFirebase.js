import { useState, useEffect } from 'react';
import { initializeFirebase } from '../config/firebase';

export const useFirebase = () => {
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState(null);

    useEffect(() => {
        const setupFirebase = async () => {
            try {
                // Esperar un momento para asegurar que el entorno esté listo
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Inicializar Firebase
                await initializeFirebase();
                
                setIsFirebaseReady(true);
                console.log('🚀 Firebase está listo para usar');
            } catch (error) {
                console.error('❌ Error configurando Firebase:', error);
                setFirebaseError(error);
            }
        };

        setupFirebase();
    }, []);

    return { isFirebaseReady, firebaseError };
};