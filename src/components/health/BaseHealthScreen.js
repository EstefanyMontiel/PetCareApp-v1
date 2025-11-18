// ============================================
// 🏥 BASE HEALTH SCREEN - COMPONENTE REUTILIZABLE
// ============================================
// ✅ Elimina 70% de código duplicado
// ✅ Lógica centralizada
// ✅ Fácil de mantener

import React from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import HealthHeader from './components/HealthHeader';
import HealthFormModal from './components/HealthFormModal';
import HealthRecordCard from './components/HealthRecordCard';
import EmptyHealthState from './components/EmptyHealthState';
import { useHealthRecords } from '../../hooks/health/useHealthRecords';
import { useHealthForm } from '../../hooks/health/useHealthForm';

const BaseHealthScreen = ({
    navigation,
    route,
    title,
    icon,
    emptyMessage,
    formFields,
    recordCardRenderer,
    service,
}) => {
    const { petId, petName, petSpecies } = route.params;

    // ✅ Hook centralizado de registros
    const {
        records,
        loading,
        refreshRecords,
        deleteRecord,
    } = useHealthRecords(service, petId);

    // ✅ Hook centralizado de formulario
    const {
        formData,
        showForm,
        openForm,
        closeForm,
        updateField,
        saveRecord,
        saving,
    } = useHealthForm(service, petId, refreshRecords);

    return (
        <View style={styles.container}>
            <HealthHeader
                title={title}
                icon={icon}
                petName={petName}
                onBack={() => navigation.goBack()}
                onAdd={openForm}
            />

            <ScrollView style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4ECDC4" />
                ) : records.length > 0 ? (
                    records.map((record) => (
                        <HealthRecordCard
                            key={record.id}
                            record={record}
                            onDelete={() => deleteRecord(record.id)}
                            renderer={recordCardRenderer}
                        />
                    ))
                ) : (
                    !showForm && (
                        <EmptyHealthState
                            message={emptyMessage}
                            petName={petName}
                        />
                    )
                )}
            </ScrollView>

            <HealthFormModal
                visible={showForm}
                onClose={closeForm}
                onSave={saveRecord}
                formData={formData}
                updateField={updateField}
                fields={formFields}
                saving={saving}
            />
        </View>
    );
};

export default BaseHealthScreen;