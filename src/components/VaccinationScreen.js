import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VaccinationScreen = ({ route, navigation }) => {
    const { petId } = route.params;
    const [vaccinations, setVaccinations] = useState([]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Vacunas</Text>
                <TouchableOpacity>
                    <Ionicons name="add" size={24} color="#4ECDC4" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.content}>
                {/* Aquí irá la lista de vacunas */}
                <Text>Lista de vacunas</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
});

export default VaccinationScreen;