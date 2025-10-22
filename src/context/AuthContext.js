    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { auth, db } from '../config/firebase';

    const AuthContext = createContext({});

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('🔥 Configurando listener de autenticación...');
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('👤 Estado de usuario cambió:', user ? user.email : 'No hay usuario');
            setUser(user);
            
            if (user) {
                await loadUserProfile(user.uid);
                await loadUserPets(user.uid);
            } else {
                setUserProfile(null);
                setUserPets([]);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    // Cargar perfil del usuario
    const loadUserProfile = async (uid) => {
        try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            setUserProfile(userDoc.data());
        }
        } catch (error) {
        console.error('Error loading user profile:', error);
        }
    };


    // Cargar mascotas del usuario (solo activas)
    const loadUserPets = async (uid) => {
        try {
            // Filtrar solo mascotas activas o sin el campo isActive (para compatibilidad)
            const petsSnapshot = await db.collection('mascotas')
                .where('userId', '==', uid)
                .get();
            
            const pets = petsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            // Filtrar en cliente para compatibilidad con mascotas antiguas
            .filter(pet => pet.isActive !== false);
            
            setUserPets(pets);
            console.log('🐾 Mascotas cargadas:', pets.length);
        } catch (error) {
            console.error('Error loading user pets:', error);
        }
    };

    // Función de registro
    const register = async (email, password, displayName) => {
        try {
        console.log('🔐 Intentando registrar usuario...');
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await user.updateProfile({ displayName: displayName });

        // Crear documento del usuario en Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            nombre: displayName,
            correo: email,
            fechaRegistro: new Date(),
            activo: true
        });

        console.log('✅ Usuario registrado exitosamente:', user.email);
        return { user, isNewUser: true };
        } catch (error) {
        console.error('❌ Error en registro:', error);
        throw error;
        }
    };

    // Función de login
    const login = async (email, password) => {
        try {
        console.log('🔐 Intentando login...');
        
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Login exitoso:', result.user.email);
        return { user: result.user, isNewUser: false };
        } catch (error) {
        console.error('❌ Error en login:', error);
        throw error;
        }
    };

    // Función para agregar mascota
    const addPet = async (petData) => {
        try {
        console.log('🐾 Iniciando registro de mascota...');
        console.log('👤 Usuario actual:', user?.email, user?.uid);
        
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }
        
        // Verificar que el usuario está autenticado en Firebase
        const currentUser = auth.currentUser;
        console.log('🔐 Usuario en Firebase Auth:', currentUser?.email, currentUser?.uid);
        
        if (!currentUser) {
            throw new Error('Usuario no autenticado en Firebase');
        }
        
        const petDoc = {
            ...petData,
            userId: user.uid,
            isActive: true, //siempre activa al crear
            fechaRegistro: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log('📝 Datos de mascota a guardar:', petDoc);
        console.log('💾 Guardando en colección: mascotas');
        
        const docRef = await db.collection('mascotas').add(petDoc);
        
        console.log('✅ Mascota registrada con ID:', docRef.id);
        
        // Recargar las mascotas del usuario
        await loadUserPets(user.uid);
        
        return docRef;
        } catch (error) {
        console.error('❌ Error adding pet:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        throw error;
        }
    };

    const logout = async () => {
        try {
        await auth.signOut();
        setUserProfile(null);
        setUserPets([]);
        console.log('Logout exitoso');
        } catch (error) {
        console.error('Error en logout:', error);
        throw error;
        }
    };

    const value = {
        user,
        userProfile,
        userPets,
        register,
        login,
        logout,
        addPet,
        loadUserPets,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };