import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import es from '../locales/es.json';
import en from '../locales/en.json';

const LanguageContext = createContext({});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); // Default to Spanish
  const [translations, setTranslations] = useState(es);

  // Load user's language preference from Firestore
  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.language) {
              changeLanguage(userData.language);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserLanguage();
      }
    });

    return unsubscribe;
  }, []);

  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      setTranslations(newLanguage === 'es' ? es : en);

      // Save preference to Firestore if user is logged in
      const user = auth.currentUser;
      if (user) {
        await db.collection('users').doc(user.uid).update({
          language: newLanguage,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
