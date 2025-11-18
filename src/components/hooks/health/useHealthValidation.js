// ============================================
// ✅ USE HEALTH VALIDATION HOOK
// ============================================
// ✅ Validaciones reutilizables

import { Alert } from 'react-native';

/**
 * Validaciones comunes para registros de salud
 */
export const useHealthValidation = () => {
    
    // ✅ Validar fecha requerida
    const validateDateRequired = (date, fieldName = 'fecha') => {
        if (!date) {
            Alert.alert('Error', `Por favor selecciona la ${fieldName}`);
            return false;
        }
        return true;
    };

    // ✅ Validar fecha no futura
    const validateDateNotFuture = (date, fieldName = 'fecha') => {
        if (date > new Date()) {
            Alert.alert('Error', `La ${fieldName} no puede ser futura`);
            return false;
        }
        return true;
    };

    // ✅ Validar campo requerido
    const validateRequired = (value, fieldName) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            Alert.alert('Error', `Por favor completa el campo "${fieldName}"`);
            return false;
        }
        return true;
    };

    // ✅ Validar número positivo
    const validatePositiveNumber = (value, fieldName) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            Alert.alert('Error', `${fieldName} debe ser un número positivo`);
            return false;
        }
        return true;
    };

    // ✅ Validación completa de vacunación
    const validateVaccination = (formData) => {
        if (!validateRequired(formData.selectedVaccine, 'tipo de vacuna')) return false;
        if (!validateDateRequired(formData.applicationDate, 'fecha de aplicación')) return false;
        if (!validateDateNotFuture(formData.applicationDate, 'fecha de aplicación')) return false;
        return true;
    };

    // ✅ Validación completa de desparasitación
    const validateDeworming = (formData) => {
        if (!validateRequired(formData.productType, 'tipo de desparasitación')) return false;
        if (!validateRequired(formData.selectedProduct, 'producto')) return false;
        if (!validateDateRequired(formData.applicationDate, 'fecha de aplicación')) return false;
        if (!validateDateNotFuture(formData.applicationDate, 'fecha de aplicación')) return false;
        return true;
    };

    // ✅ Validación completa de examen anual
    const validateAnnualExam = (formData) => {
        if (!validateDateRequired(formData.examDate, 'fecha del examen')) return false;
        if (!validateDateNotFuture(formData.examDate, 'fecha del examen')) return false;
        return true;
    };

    return {
        validateDateRequired,
        validateDateNotFuture,
        validateRequired,
        validatePositiveNumber,
        validateVaccination,
        validateDeworming,
        validateAnnualExam,
    };
};