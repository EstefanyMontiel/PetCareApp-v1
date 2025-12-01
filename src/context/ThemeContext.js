import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de ThemeProvider');
    }
    return context;
};

// Colores del tema
export const lightTheme = {
    background: '#F5F7FA',
    cardBackground: '#FFFFFF',
    primary: '#4ECDC4',
    secondary: '#44A08D',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E8EBED',
    error: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
    shadow: '#000000',
    placeholder: '#BDC3C7',
    inputBackground: '#F8F9FA',
};

export const darkTheme = {
    background: '#1A1A2E',
    cardBackground: '#16213E',
    primary: '#4ECDC4',
    secondary: '#44A08D',
    text: '#EAEAEA',
    textSecondary: '#A0A0A0',
    border: '#2D3748',
    error: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
    shadow: '#000000',
    placeholder: '#718096',
    inputBackground: '#0F3460',
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(lightTheme);

    // Cargar preferencia guardada
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                const isDark = savedTheme === 'dark';
                setIsDarkMode(isDark);
                setTheme(isDark ? darkTheme : lightTheme);
            }
        } catch (error) {
            console.error('Error cargando tema:', error);
        }
    };

    const toggleTheme = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            setTheme(newMode ? darkTheme : lightTheme);
            await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Error guardando tema:', error);
        }
    };

    const value = {
        isDarkMode,
        theme,
        toggleTheme,
        colors: theme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};