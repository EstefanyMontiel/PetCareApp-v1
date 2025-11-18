import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { placesService } from '../services/placesService';
import { mapStyles } from '../styles/mapStyles';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [veterinaries, setVeterinaries] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVet, setSelectedVet] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const mapRef = useRef(null);
  const cardAnimation = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterVeterinaries();
  }, [searchQuery, activeFilter, veterinaries]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const userLoc = { latitude, longitude };

      setUserLocation(userLoc);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      searchVeterinaries(latitude, longitude);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
      setLoading(false);
    }
  };

  const searchVeterinaries = async (latitude, longitude) => {
  try {
    setLoading(true);
    const results = await placesService.searchNearbyVeterinaries(latitude, longitude);

    const veterinariesWithDistance = results.map((vet) => ({
      ...vet,
      distance: placesService.calculateDistance(
        latitude,
        longitude,
        vet.geometry.location.lat,
        vet.geometry.location.lng
      ),
    }));

    veterinariesWithDistance.sort((a, b) => a.distance - b.distance);
    setVeterinaries(veterinariesWithDistance);
    setFilteredVets(veterinariesWithDistance);
    
    // 🆕 Guardar también en AsyncStorage para acceso global
    await AsyncStorage.setItem(
      'lastVeterinaries',
      JSON.stringify({
        data: veterinariesWithDistance,
        location: { latitude, longitude },
        timestamp: Date.now(),
      })
    );
    
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar las veterinarias');
  } finally {
    setLoading(false);
  }
};

  const filterVeterinaries = () => {
    let filtered = [...veterinaries];


    // Filtrar por tipo
  if (activeFilter === 'emergency') {
    // ✅ MEJORADO: Filtra veterinarias de emergencia
    filtered = filtered.filter((vet) => {
      // Verificar si está abierta ahora
      const isOpenNow = vet.opening_hours?.open_now === true;
      
      // Verificar si es 24/7 (tiene solo 1 período que significa 24 horas)
      const is24Hours = vet.opening_hours?.periods?.length === 1;
      
      // Verificar si tiene "24" o "emergency" en el nombre
      const hasEmergencyInName = 
        vet.name.toLowerCase().includes('24') ||
        vet.name.toLowerCase().includes('emergency') ||
        vet.name.toLowerCase().includes('emergencia') ||
        vet.name.toLowerCase().includes('urgencias');
      
      // Incluir si cumple cualquiera de estas condiciones
      return isOpenNow || is24Hours || hasEmergencyInName;
    });
  } else if (activeFilter === 'near') {
    filtered = filtered.filter((vet) => vet.distance <= 2);
  }

  setFilteredVets(filtered);
}

  // ✅ MODIFICADO: Ya NO mueve el mapa
  const handleMarkerPress = async (vet) => {
  // Mostrar la tarjeta inmediatamente con la info básica
  setSelectedVet(vet);
  
  // Animar aparición de la card
  Animated.spring(cardAnimation, {
    toValue: 0,
    useNativeDriver: true,
    tension: 50,
    friction: 7,
  }).start();

  // 🆕 Cargar detalles (teléfono, etc.) en segundo plano
  try {
    const details = await placesService.getPlaceDetails(vet.place_id);
    if (details) {
      // Actualizar con los detalles completos
      setSelectedVet({
        ...vet,
        formatted_phone_number: details.formatted_phone_number,
        international_phone_number: details.international_phone_number,
        website: details.website,
        opening_hours: details.opening_hours || vet.opening_hours,
      });
    }
  } catch (error) {
    console.log('⚠️ No se pudieron cargar detalles adicionales');
  }
};
  const handleCloseCard = () => {
    Animated.timing(cardAnimation, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedVet(null));
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Información', 'No hay número disponible');
    }
  };

  const handleNavigate = (lat, lng) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    });
    Linking.openURL(url);
  };

  const centerToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  if (loading || !region) {
    return (
      <View style={mapStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={mapStyles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  
  return (
    <View style={mapStyles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={mapStyles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        loadingEnabled
        loadingIndicatorColor={colors.primary}

        // 🆕 OPTIMIZACIONES DE RENDIMIENTO
  cacheEnabled={true}              // ⬅️ Habilita caché del mapa
  loadingBackgroundColor="#F5F5F5" // ⬅️ Color de fondo mientras carga
  maxZoomLevel={18}                //  Limita zoom para mejor rendimiento
  minZoomLevel={10}                // ⬅ Limita zoom mínimo
  moveOnMarkerPress={false}        //  No mueve el mapa al tocar marcador
  pitchEnabled={false}             //  Deshabilita inclinación 3D
  rotateEnabled={false}            // Deshabilita rotación
  scrollEnabled={true}
  zoomEnabled={true}

      >
    {filteredVets.map((vet) => {
  // Determinar si es veterinaria de emergencia
  const isEmergency = 
    vet.opening_hours?.open_now === true ||
    vet.opening_hours?.periods?.length === 1 ||
    vet.name.toLowerCase().includes('24') ||
    vet.name.toLowerCase().includes('emergency') ||
    vet.name.toLowerCase().includes('emergencia') ||
    vet.name.toLowerCase().includes('urgencias');

  return (
    <Marker
      key={vet.place_id}
      coordinate={{
        latitude: vet.geometry.location.lat,
        longitude: vet.geometry.location.lng,
      }}
      onPress={() => handleMarkerPress(vet)}
      tracksViewChanges={false}
    >
      <View style={mapStyles.markerContainer}>
        <View style={[
          mapStyles.markerIcon,
          isEmergency && mapStyles.markerIconEmergency
        ]}>
          <Ionicons 
            name={isEmergency ? "medical" : "paw"} 
            size={16} 
            color={colors.surface} 
          />
        </View>
        {vet.distance <= 1 && (
          <View style={mapStyles.markerLabel}>
            <Text style={mapStyles.markerLabelText}>
              {vet.distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
})}
      </MapView>

      {/* Botón de ubicación SEPARADO */}
      <View style={mapStyles.locationButtonContainer}>
        <TouchableOpacity 
          style={mapStyles.locationButton}
          onPress={centerToUserLocation}
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={mapStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={mapStyles.filterScroll}
        >
          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'all' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Ionicons 
              name="grid" 
              size={16} 
              color={activeFilter === 'all' ? colors.surface : colors.textPrimary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'all' && mapStyles.filterTextActive
            ]}>
              Todas ({veterinaries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'emergency' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('emergency')}
          >
            <Ionicons 
              name="alert-circle" 
              size={16} 
              color={activeFilter === 'emergency' ? colors.surface : colors.secondary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'emergency' && mapStyles.filterTextActive
            ]}>
              Emergencia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              mapStyles.filterChip,
              activeFilter === 'near' && mapStyles.filterChipActive
            ]}
            onPress={() => setActiveFilter('near')}
          >
            <Ionicons 
              name="location" 
              size={16} 
              color={activeFilter === 'near' ? colors.surface : colors.primary}
            />
            <Text style={[
              mapStyles.filterText,
              activeFilter === 'near' && mapStyles.filterTextActive
            ]}>
              Cercanas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

   {/* Card de información */}
{selectedVet && (
  <Animated.View 
    style={[
      mapStyles.infoCard,
      { transform: [{ translateY: cardAnimation }] }
    ]}
  >
    <View style={mapStyles.infoHeader}>
      <Text style={mapStyles.infoTitle} numberOfLines={2}>
        {selectedVet.name}
      </Text>
      {selectedVet.opening_hours?.open_now && (
        <View style={mapStyles.infoBadge}>
          <Text style={mapStyles.infoBadgeText}>ABIERTO</Text>
        </View>
      )}
      <TouchableOpacity onPress={handleCloseCard}>
        <Ionicons name="close" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>

    <Text style={mapStyles.infoAddress} numberOfLines={2}>
      {selectedVet.vicinity}
    </Text>

    {/* 🆕 AGREGAR: Mostrar teléfono si está disponible */}
    {selectedVet.formatted_phone_number && (
      <View style={mapStyles.phoneContainer}>
        <Ionicons name="call-outline" size={16} color={colors.primary} />
        <Text style={mapStyles.phoneText}>
          {selectedVet.formatted_phone_number}
        </Text>
      </View>
    )}

    <View style={mapStyles.infoDetails}>
      <View style={mapStyles.infoDetail}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text style={mapStyles.infoDetailText}>
          {selectedVet.distance.toFixed(2)} km
        </Text>
      </View>
      {selectedVet.rating && (
        <View style={mapStyles.infoDetail}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={mapStyles.infoDetailText}>
            {selectedVet.rating}
          </Text>
        </View>
      )}
    </View>

    <View style={mapStyles.infoActions}>
      {/* 🆕 MODIFICAR: Botón de llamar con estado */}
      <TouchableOpacity
        style={[
          mapStyles.infoButton, 
          mapStyles.infoButtonPrimary,
          !selectedVet.formatted_phone_number && mapStyles.infoButtonDisabled
        ]}
        onPress={() => handleCall(selectedVet.formatted_phone_number)}
        disabled={!selectedVet.formatted_phone_number}
      >
        <Ionicons name="call" size={18} color={colors.surface} />
        <Text style={mapStyles.infoButtonText}>
          {selectedVet.formatted_phone_number ? 'Llamar' : 'Cargando...'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[mapStyles.infoButton, mapStyles.infoButtonSecondary]}
        onPress={() => handleNavigate(
          selectedVet.geometry.location.lat,
          selectedVet.geometry.location.lng
        )}
      >
        <Ionicons name="navigate" size={18} color={colors.surface} />
        <Text style={mapStyles.infoButtonText}>Ir</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
      )}
    </View>
  );
}