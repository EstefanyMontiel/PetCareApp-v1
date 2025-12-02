// src/components/EmergencyScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { placesService } from '../services/placesService';
import VeterinaryCard from './VeterinaryCard';
import { emergencyStyles } from '../styles/emergencyStyles';
import { colors } from '../styles/colors';

export default function EmergencyScreen() {
  const { t } = useLanguage();
  const [veterinaries, setVeterinaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false); // 🆕 Loading para detalles
  const [showList, setShowList] = useState(false);

  // Verificación de seguridad
  if (!t) return null;

  const handleLocateEmergencyVets = async () => {
    try {
      setLoading(true);
      setShowList(true);

      // Solicitar permisos
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('emergency.locationPermissionError'));
        setLoading(false);
        return;
      }

      // Obtener ubicación
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Buscar veterinarias
      const results = await placesService.search24HourVeterinaries(latitude, longitude);

      if (results.length === 0) {
        Alert.alert(
          t('emergency.noResults'),
          t('emergency.noResultsMessage')
        );
        setVeterinaries([]);
        setLoading(false);
        return;
      }

      // Calcular distancias
      const vetsWithDistance = results.map((vet) => ({
        ...vet,
        distance: placesService.calculateDistance(
          latitude,
          longitude,
          vet.geometry.location.lat,
          vet.geometry.location.lng
        ),
      }));

      // Ordenar por distancia
      vetsWithDistance.sort((a, b) => a.distance - b.distance);
      
      // 🆕 Mostrar resultados inmediatamente (sin teléfonos aún)
      setVeterinaries(vetsWithDistance);
      setLoading(false);

      // 🆕 Cargar detalles (teléfonos) en segundo plano
      setLoadingDetails(true);
      try {
        const vetsWithDetails = await placesService.loadDetailsForVeterinaries(
          vetsWithDistance.slice(0, 10) // Solo los primeros 10
        );
        
        // Combinar veterinarias con detalles y sin detalles
        const allVets = [
          ...vetsWithDetails,
          ...vetsWithDistance.slice(10) // El resto sin detalles
        ];
        
        setVeterinaries(allVets);

        placesService.saveEmergencyVetsWithDetails(allVets); // Guardar en caché CON detalles

        console.log('✅ Detalles cargados correctamente');
      } catch (detailError) {
      } finally {
        setLoadingDetails(false);
      }
      
    } catch (error) {
      Alert.alert(t('common.error'), `${t('emergency.loadError')}: ${error.message}`);
      setVeterinaries([]);
      setLoading(false);
    }
  };

  const renderVeterinaryItem = ({ item }) => (
    <VeterinaryCard veterinary={item} />
  );

  return (
    <View style={emergencyStyles.container}>
      {!showList ? (
        <View style={emergencyStyles.emergencyContainer}>
          <View style={emergencyStyles.iconContainer}>
            <View style={emergencyStyles.emergencyIconCircle}>
              <Ionicons name="medical" size={60} color={colors.secondary} />
            </View>
          </View>

          <Text style={emergencyStyles.title}>{t('emergency.title')}</Text>

          <Text style={emergencyStyles.description}>
            {t('emergency.description')}
          </Text>

          <TouchableOpacity
            style={emergencyStyles.locateButton}
            onPress={handleLocateEmergencyVets}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <>
                <Ionicons name="location" size={24} color={colors.surface} />
                <Text style={emergencyStyles.locateButtonText}>
                  {t('emergency.locateButton')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={emergencyStyles.listContainer}>
          <View style={emergencyStyles.listHeader}>
            <View style={emergencyStyles.listHeaderTop}>
              <Text style={emergencyStyles.listTitle}>
                Veterinarias Cercanas
              </Text>
              {/* 🆕 Indicador de carga de detalles */}
              {loadingDetails && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              <TouchableOpacity
                style={emergencyStyles.backButton}
                onPress={() => {
                  setShowList(false);
                  setVeterinaries([]);
                }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={emergencyStyles.resultCount}>
              {veterinaries.length} {veterinaries.length === 1 ? 'resultado' : 'resultados'}
              {loadingDetails && ' • Cargando teléfonos...'}
            </Text>
          </View>

          {loading ? (
            <View style={emergencyStyles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={emergencyStyles.loadingText}>
                Buscando veterinarias cercanas...
              </Text>
            </View>
          ) : veterinaries.length > 0 ? (
            <FlatList
              data={veterinaries}
              keyExtractor={(item) => item.place_id}
              renderItem={renderVeterinaryItem}
              contentContainerStyle={emergencyStyles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={emergencyStyles.emptyContainer}>
              <View style={emergencyStyles.emptyIconContainer}>
                <Ionicons name="search" size={50} color={colors.textTertiary} />
              </View>
              <Text style={emergencyStyles.emptyTitle}>
                No hay veterinarias cercanas
              </Text>
              <Text style={emergencyStyles.emptyText}>
                No encontramos clínicas veterinarias en tu área.
              </Text>
              <TouchableOpacity
                style={emergencyStyles.retryButton}
                onPress={handleLocateEmergencyVets}
              >
                <Ionicons name="refresh" size={20} color={colors.surface} />
                <Text style={emergencyStyles.retryButtonText}>
                  Buscar de nuevo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}