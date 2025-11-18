// src/services/placesService.js

// Caché simple en memoria
const cache = {
  veterinaries: null,
  veterinariesWithDetails: null, // 🆕 Caché para veterinarias con detalles
  emergency: null,
  emergencyWithDetails: null,    // 🆕 Caché para emergencia con detalles
  timestamp: null,
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutos
};

const GOOGLE_PLACES_API_KEY = 'AIzaSyBVV7GZ1kS03wnHN5Thev1iWDgQ8YhSdB4'; // ⬅️ Tu API key

class PlacesService {
  // Verificar si el caché es válido
  isCacheValid(type) {
    if (!cache[type] || !cache.timestamp) {
      return false;
    }
    return (Date.now() - cache.timestamp) < cache.CACHE_DURATION;
  }

  async searchNearbyVeterinaries(latitude, longitude, radius = 5000) {
    // Verificar caché CON detalles primero
    if (this.isCacheValid('veterinariesWithDetails') && cache.veterinariesWithDetails) {
      console.log('✅ Usando veterinarias CON DETALLES desde caché');
      return cache.veterinariesWithDetails;
    }
    
    // Si no, verificar caché básico
    if (this.isCacheValid('veterinaries')) {
      console.log('✅ Usando veterinarias desde caché');
      return cache.veterinaries;
    }

    try {
      console.log('🔍 Buscando veterinarias en la API...');
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results) {
        cache.veterinaries = data.results;
        cache.timestamp = Date.now();
        console.log(`💾 ${data.results.length} veterinarias guardadas en caché`);
        return data.results;
      } else {
        console.error('Error en API:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error buscando veterinarias:', error);
      if (cache.veterinaries) {
        console.log('⚠️ Usando caché antiguo por error de red');
        return cache.veterinaries;
      }
      return [];
    }
  }

  async search24HourVeterinaries(latitude, longitude, radius = 10000) {
    // Verificar caché CON detalles primero
    if (this.isCacheValid('emergencyWithDetails') && cache.emergencyWithDetails) {
      console.log('✅ Usando veterinarias de emergencia CON DETALLES desde caché');
      return cache.emergencyWithDetails;
    }
    
    // Si no, verificar caché básico
    if (this.isCacheValid('emergency')) {
      console.log('✅ Usando veterinarias de emergencia desde caché');
      return cache.emergency;
    }

    try {
      console.log('🔍 Buscando veterinarias 24h en la API...');
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=veterinaria+24+horas+emergencia&type=veterinary_care&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results) {
        cache.emergency = data.results;
        cache.timestamp = Date.now();
        console.log(`💾 ${data.results.length} veterinarias de emergencia guardadas en caché`);
        return data.results;
      } else {
        console.error('Error en API:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error buscando veterinarias 24h:', error);
      if (cache.emergency) {
        console.log('⚠️ Usando caché antiguo por error de red');
        return cache.emergency;
      }
      return [];
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number,website,opening_hours&key=${GOOGLE_PLACES_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo detalles:', error);
      return null;
    }
  }

  async loadDetailsForVeterinaries(veterinaries) {
    console.log(`📞 Cargando detalles para ${veterinaries.length} veterinarias...`);
    
    const promises = veterinaries.map(async (vet) => {
      try {
        const details = await this.getPlaceDetails(vet.place_id);
        return {
          ...vet,
          formatted_phone_number: details?.formatted_phone_number || null,
          international_phone_number: details?.international_phone_number || null,
          website: details?.website || null,
          opening_hours: details?.opening_hours || vet.opening_hours,
        };
      } catch (error) {
        return vet;
      }
    });

    const results = await Promise.all(promises);
    
    console.log(`✅ Detalles cargados para ${results.length} veterinarias`);
    return results;
  }

  // 🆕🆕🆕 AQUÍ VA EL NUEVO MÉTODO 🆕🆕🆕
  // Guardar veterinarias con detalles en caché
  saveVeterinariesWithDetails(vets) {
    cache.veterinariesWithDetails = vets;
    cache.timestamp = Date.now();
    console.log('💾 Veterinarias con detalles guardadas en caché');
  }

  // 🆕 Guardar veterinarias de emergencia con detalles en caché
  saveEmergencyVetsWithDetails(vets) {
    cache.emergencyWithDetails = vets;
    cache.timestamp = Date.now();
    console.log('💾 Veterinarias de emergencia con detalles guardadas en caché');
  }
  // 🆕🆕🆕 FIN DEL NUEVO MÉTODO 🆕🆕🆕

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  clearCache() {
    cache.veterinaries = null;
    cache.veterinariesWithDetails = null;
    cache.emergency = null;
    cache.emergencyWithDetails = null;
    cache.timestamp = null;
    console.log('🗑️ Caché limpiado');
  }
}

export const placesService = new PlacesService();