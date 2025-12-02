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

    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        // Si no se encuentra la traducción, devolver la key
        if (value === undefined || value === null) return key;
        
        // Si es un array, devolverlo directamente (para monthNames, dayNames, etc.)
        if (Array.isArray(value)) return value;
        
        // Reemplazar parámetros en la traducción
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
                return params[paramKey] !== undefined ? String(params[paramKey]) : match;
            });
        }
        
        // Asegurar que siempre devolvemos un string o array
        return typeof value === 'string' ? value : String(value);
    };

    const value = {
        language,
        changeLanguage,
        t,
        isLoading
    };

    // No renderizar hijos hasta que el idioma esté cargado
    if (isLoading) {
        return null;
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};