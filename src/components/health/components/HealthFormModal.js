// ============================================
// 📋 HEALTH FORM MODAL (CON SOLUCIÓN DE TECLADO)
// ============================================

import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import KeyboardAwareForm from '../../common/KeyboardAwareForm';
import styles from '../../../styles/HealthFormStyles';

const HealthFormModal = ({
    visible,
    onClose,
    onSave,
    formData,
    updateField,
    fields,
    saving,
}) => {
    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
            backdropOpacity={0.7}
            coverScreen={true}
            avoidKeyboard={true} // ✅ Modal respeta teclado
            useNativeDriver={true}
            propagateSwipe={true}
        >
            <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Nuevo Registro</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#7F8C8D" />
                    </TouchableOpacity>
                </View>

                {/* ✅ KeyboardAwareForm evita que el teclado tape campos */}
                <KeyboardAwareForm style={{ flex: 1 }}>
                    {fields.map((field) => (
                        <field.component
                            key={field.name}
                            {...field.props}
                            value={formData[field.name]}
                            onChange={(value) => updateField(field.name, value)}
                        />
                    ))}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={saving}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.buttonDisabled]}
                            onPress={onSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    <Text style={styles.saveButtonText}>Guardar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareForm>
            </View>
        </Modal>
    );
};

export default React.memo(HealthFormModal);