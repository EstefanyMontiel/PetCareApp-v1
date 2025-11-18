// ============================================
// 📋 USE HEALTH RECORDS HOOK
// ============================================
// ✅ Centraliza carga, eliminación y actualización
// ✅ Reutilizable en Vacunación, Desparasitación y Examen Anual

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * Hook para manejar registros de salud (vacunas, desparasitaciones, exámenes)
 * @param {Object} service - Servicio con métodos getRecords, deleteRecord
 * @param {string} petId - ID de la mascota
 * @returns {Object} { records, loading, refreshRecords, deleteRecord }
 */
export const useHealthRecords = (service, petId) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Cargar registros (memoizado)
    const loadRecords = useCallback(async () => {
        if (!petId) {
            console.warn('petId no proporcionado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Verificar que el servicio tenga el método correcto
            const method = service.getRecords || 
                          service.getVaccinations || 
                          service.getDewormings || 
                          service.getExams;
            
            if (!method) {
                throw new Error('Servicio no tiene método de carga');
            }

            const data = await method(petId);
            setRecords(data || []);
        } catch (error) {
            console.error('Error cargando registros:', error);
            Alert.alert('Error', 'No se pudieron cargar los registros');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, [service, petId]);

    // ✅ Cargar al montar
    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    // ✅ Eliminar registro (memoizado)
    const deleteRecord = useCallback((recordId, customTitle = 'Eliminar') => {
        Alert.alert(
            customTitle,
            '¿Estás seguro de que deseas eliminar este registro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Verificar que el servicio tenga el método correcto
                            const method = service.deleteRecord || 
                                          service.deleteVaccination || 
                                          service.deleteDeworming || 
                                          service.deleteExam;
                            
                            if (!method) {
                                throw new Error('Servicio no tiene método de eliminación');
                            }

                            await method(petId, recordId);
                            await loadRecords();
                            Alert.alert('✅ Éxito', 'Registro eliminado correctamente');
                        } catch (error) {
                            console.error('Error eliminando registro:', error);
                            Alert.alert('Error', 'No se pudo eliminar el registro');
                        }
                    }
                }
            ]
        );
    }, [service, petId, loadRecords]);

    return {
        records,
        loading,
        refreshRecords: loadRecords,
        deleteRecord,
    };
};
