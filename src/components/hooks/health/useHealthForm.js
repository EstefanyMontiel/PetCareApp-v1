// ============================================
// 📝 USE HEALTH FORM HOOK
// ============================================
// ✅ Maneja estado, validación y guardado del formulario

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * Hook para manejar formularios de registros de salud
 * @param {Object} service - Servicio con método saveRecord
 * @param {string} petId - ID de la mascota
 * @param {Function} onSuccess - Callback después de guardar
 * @param {Object} initialFormData - Datos iniciales del formulario
 * @returns {Object} Estado y funciones del formulario
 */
export const useHealthForm = (
    service, 
    petId, 
    onSuccess,
    initialFormData = {}
) => {
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    // ✅ Abrir formulario
    const openForm = useCallback(() => {
        setFormData(initialFormData);
        setShowForm(true);
    }, [initialFormData]);

    // ✅ Cerrar formulario
    const closeForm = useCallback(() => {
        setShowForm(false);
        setFormData(initialFormData);
    }, [initialFormData]);

    // ✅ Actualizar campo del formulario
    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ 
            ...prev, 
            [field]: value 
        }));
    }, []);

    // ✅ Actualizar múltiples campos
    const updateFields = useCallback((updates) => {
        setFormData(prev => ({ 
            ...prev, 
            ...updates 
        }));
    }, []);

    // ✅ Resetear formulario
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    // ✅ Guardar registro
    const saveRecord = useCallback(async (validationFn, successMessage = '✅ Éxito') => {
        // Validación opcional
        if (validationFn && !validationFn(formData)) {
            return false;
        }

        setSaving(true);
        try {
            // Verificar que el servicio tenga el método correcto
            const method = service.saveRecord || 
                          service.saveVaccination || 
                          service.saveDeworming || 
                          service.saveExam;
            
            if (!method) {
                throw new Error('Servicio no tiene método de guardado');
            }

            await method(petId, formData);
            Alert.alert(successMessage, 'Registro guardado correctamente');
            closeForm();
            
            // Llamar callback de éxito
            if (onSuccess) {
                await onSuccess();
            }
            
            return true;
        } catch (error) {
            console.error('Error guardando registro:', error);
            Alert.alert('❌ Error', 'No se pudo guardar el registro');
            return false;
        } finally {
            setSaving(false);
        }
    }, [service, petId, formData, onSuccess, closeForm]);

    return {
        formData,
        showForm,
        saving,
        openForm,
        closeForm,
        updateField,
        updateFields,
        resetForm,
        saveRecord,
    };
};