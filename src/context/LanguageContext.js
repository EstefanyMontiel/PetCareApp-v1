import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from '../locales/es.json';
import en from '../locales/en.json';

const LanguageContext = createContext({});

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    es,
    en
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('es');
    const [isLoading, setIsLoading] = useState(true);

    // Cargar idioma guardado al iniciar
    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('userLanguage');
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
                setLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeLanguage = async (newLanguage) => {
        try {
            await AsyncStorage.setItem('userLanguage', newLanguage);
            setLanguage(newLanguage);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    };

    const value = {
        language,
        changeLanguage,
        t,
        isLoading
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};