// src/components/VeterinaryCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Alert, Share} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emergencyStyles } from '../styles/emergencyStyles';
import { colors } from '../styles/colors';

export default function VeterinaryCard({ veterinary, showActions = true }) {
  const handleCall = () => {
    if (veterinary.formatted_phone_number) {
      Linking.openURL(`tel:${veterinary.formatted_phone_number}`);
    } else {
      Alert.alert('Información', 'No hay número de teléfono disponible');
    }
  };

  const handleNavigate = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${veterinary.geometry.location.lat},${veterinary.geometry.location.lng}`,
      android: `geo:0,0?q=${veterinary.geometry.location.lat},${veterinary.geometry.location.lng}`,
    });
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      const message = `🐾 ${veterinary.name}\n\n` +
        `📍 ${veterinary.formatted_address || veterinary.vicinity}\n` +
        `📞 ${veterinary.formatted_phone_number || 'Sin teléfono'}\n` +
        `⭐ ${veterinary.rating ? `Calificación: ${veterinary.rating}` : 'Sin calificación'}\n\n` +
        `📱 Ver en Maps: https://www.google.com/maps/search/?api=1&query=${veterinary.geometry.location.lat},${veterinary.geometry.location.lng}`;

      await Share.share({
        message: message,
        title: `Compartir ${veterinary.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la información');
    }
  };

  return (
    <View style={emergencyStyles.vetCard}>
      {/* Header */}
      <View style={emergencyStyles.vetHeader}>
        <View style={emergencyStyles.vetTitleContainer}>
          <Text style={emergencyStyles.vetName} numberOfLines={2}>
            {veterinary.name}
          </Text>
          <Text style={emergencyStyles.vetCategory}>
            Clínica Veterinaria
          </Text>
        </View>
        
        <View style={emergencyStyles.badgeContainer}>
          {veterinary.opening_hours?.open_now && (
            <View style={[emergencyStyles.badge, emergencyStyles.badgeOpen]}>
              <Ionicons name="time" size={10} color={colors.success} />
              <Text style={[emergencyStyles.badgeText, emergencyStyles.badgeTextOpen]}>
                Abierto
              </Text>
            </View>
          )}
          {veterinary.distance <= 2 && (
            <View style={[emergencyStyles.badge, emergencyStyles.badgeEmergency]}>
              <Ionicons name="flash" size={10} color={colors.secondary} />
              <Text style={[emergencyStyles.badgeText, emergencyStyles.badgeTextEmergency]}>
                Cerca
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Información */}
      <View style={emergencyStyles.vetInfo}>
        <View style={emergencyStyles.infoRow}>
          <View style={emergencyStyles.iconCircle}>
            <Ionicons name="location" size={16} color={colors.primary} />
          </View>
          <Text style={emergencyStyles.infoText} numberOfLines={2}>
            {veterinary.formatted_address || veterinary.vicinity}
          </Text>
        </View>

        {veterinary.formatted_phone_number && (
          <View style={emergencyStyles.infoRow}>
            <View style={emergencyStyles.iconCircle}>
              <Ionicons name="call" size={16} color={colors.primary} />
            </View>
            <Text style={emergencyStyles.infoText}>
              {veterinary.formatted_phone_number}
            </Text>
          </View>
        )}
      </View>

      {/* Métricas */}
      <View style={emergencyStyles.metricsContainer}>
        <View style={emergencyStyles.metric}>
          <Text style={emergencyStyles.metricValue}>
            {veterinary.distance.toFixed(1)}
          </Text>
          <Text style={emergencyStyles.metricLabel}>km</Text>
        </View>
        {veterinary.rating && (
          <View style={emergencyStyles.metric}>
            <Text style={emergencyStyles.metricValue}>
              ⭐ {veterinary.rating}
            </Text>
            <Text style={emergencyStyles.metricLabel}>Calificación</Text>
          </View>
        )}
        <View style={emergencyStyles.metric}>
          <Text style={emergencyStyles.metricValue}>
            {Math.ceil(veterinary.distance * 3)}
          </Text>
          <Text style={emergencyStyles.metricLabel}>min</Text>
        </View>
      </View>

      {/* Botones de acción */}
      {showActions && (
        <View style={emergencyStyles.actionButtons}>
          <TouchableOpacity
            style={[emergencyStyles.actionButton, emergencyStyles.actionButtonPrimary]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={18} color={colors.surface} />
            <Text style={emergencyStyles.actionButtonText}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[emergencyStyles.actionButton, emergencyStyles.actionButtonSecondary]}
            onPress={handleNavigate}
          >
            <Ionicons name="navigate" size={18} color={colors.surface} />
            <Text style={emergencyStyles.actionButtonText}>Ir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[emergencyStyles.actionButton, emergencyStyles.actionButtonOutline]}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}