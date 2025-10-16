// Firebase v8 (legacy) - Más compatible con Expo
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDdjHlMlS6g7j9WvotQsT2DDIYSWFTj56U",
    authDomain: "petcareapp-89013.firebaseapp.com",
    projectId: "petcareapp-89013",
    storageBucket: "petcareapp-89013.firebasestorage.app",
    messagingSenderId: "1030468166517",
    appId: "1:1030468166517:web:82baeebef1ff57e3ab293c",
    measurementId: "G-6H0MB6FBDZ"
};

// Initialize Firebase solo si no está ya inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('🔥 Firebase v8 inicializado correctamente');
} else {
    console.log('🔥 Firebase v8 ya estaba inicializado');
}

// Export Firebase services
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// Para debugging
console.log('✅ Firebase Auth:', auth);
console.log('✅ Firebase Firestore:', db);
console.log('✅ Firebase Storage:', storage);

export default firebase;