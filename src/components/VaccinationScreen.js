import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeContainer from './SafeContainer';
import { scale, verticalScale, SHADOW_STYLE } from './responsive';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

export default function VaccinationScreen({ navigation }) {
  const { userPets } = useAuth();
  const [selectedPet, setSelectedPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);

  // Datos de ejemplo de vacunas comunes
  const commonVaccines = {
    Perro: [
      { name: 'Sextuple', description: 'Protege contra 6 enfermedades principales' },
      { name: 'Rabia', description: 'Vacuna antirrábica obligatoria' },
      { name: 'Bordetella', description: 'Previene la tos de las perreras' },
      { name: 'Lyme', description: 'Protege contra la enfermedad de Lyme' },
    ],
    Gato: [
      { name: 'Triple felina', description: 'Protege contra rinotraqueitis, calicivirus y panleucopenia' },
      { name: 'Rabia', description: 'Vacuna antirrábica obligatoria' },
      { name: 'Leucemia felina', description: 'Previene la leucemia felina' },
      { name: 'Clamidiosis', description: 'Protege contra infecciones oculares' },
    ],
  };

  useEffect(() => {
    if (userPets && userPets.length > 0) {
      setSelectedPet(userPets[0]);
    }
  }, [userPets]);

  const addVaccination = (vaccine) => {
    Alert.alert(
      'Registrar Vacuna',
      `¿Confirmas que ${selectedPet?.nombre} recibió la vacuna ${vaccine.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            const newVaccination = {
              id: Date.now().toString(),
              petId: selectedPet.id,
              vaccineName: vaccine.name,
              description: vaccine.description,
              date: new Date().toLocaleDateString('es-ES'),
              nextDue: getNextDueDate()
            };
            setVaccinations(prev => [...prev, newVaccination]);
            Alert.alert('¡Éxito!', 'Vacuna registrada correctamente');
          }
        },
      ]
    );
  };

  const getNextDueDate = () => {
    const nextDate = new Date();
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    return nextDate.toLocaleDateString('es-ES');
  };

  const renderPetSelector = () => (
    <View style={styles.petSelectorContainer}>
      <Text style={styles.sectionTitle}>Seleccionar Mascota</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {userPets?.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            style={[
              styles.petCard,
              selectedPet?.id === pet.id && styles.petCardSelected
            ]}
            onPress={() => setSelectedPet(pet)}
          >
            <Ionicons 
              name={pet.especie === 'Perro' ? 'paw' : 'paw'} 
              size={24} 
              color={selectedPet?.id === pet.id ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[
              styles.petName,
              selectedPet?.id === pet.id && styles.petNameSelected
            ]}>
              {pet.nombre}
            </Text>
            <Text style={styles.petSpecies}>{pet.especie}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderVaccineCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.vaccineCard}
      onPress={() => addVaccination(item)}
    >
      <View style={styles.vaccineIconContainer}>
        <Ionicons name="medical" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.vaccineInfo}>
        <Text style={styles.vaccineName}>{item.name}</Text>
        <Text style={styles.vaccineDescription}>{item.description}</Text>
      </View>
      <Ionicons name="add-circle" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const renderVaccinationHistory = () => {
    const petVaccinations = vaccinations.filter(v => v.petId === selectedPet?.id);
    
    if (petVaccinations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={64} color={COLORS.textTertiary} />
          <Text style={styles.emptyText}>No hay vacunas registradas</Text>
          <Text style={styles.emptySubtext}>Agrega las vacunas de tu mascota</Text>
        </View>
      );
    }

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Historial de Vacunas</Text>
        {petVaccinations.map((vaccination) => (
          <View key={vaccination.id} style={styles.historyCard}>
            <View style={styles.historyIconContainer}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyVaccineName}>{vaccination.vaccineName}</Text>
              <Text style={styles.historyDate}>Aplicada: {vaccination.date}</Text>
              <Text style={styles.historyNextDue}>Próxima: {vaccination.nextDue}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (!userPets || userPets.length === 0) {
    return (
      <SafeContainer style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="paw-outline" size={64} color={COLORS.textTertiary} />
          <Text style={styles.emptyText}>No hay mascotas registradas</Text>
          <Text style={styles.emptySubtext}>Registra una mascota para comenzar</Text>
          <TouchableOpacity 
            style={styles.addPetButton}
            onPress={() => navigation.navigate('PetRegister')}
          >
            <Text style={styles.addPetButtonText}>Registrar Mascota</Text>
          </TouchableOpacity>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="medical" size={48} color={COLORS.primary} />
          <Text style={styles.title}>Control de Vacunas</Text>
          <Text style={styles.subtitle}>Mantén al día las vacunas de tu mascota</Text>
        </View>

        {renderPetSelector()}

        {selectedPet && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vacunas Disponibles</Text>
              <FlatList
                data={commonVaccines[selectedPet.especie] || []}
                renderItem={renderVaccineCard}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
              />
            </View>

            {renderVaccinationHistory()}
          </>
        )}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: verticalScale(30),
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: verticalScale(16),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(16),
    color: COLORS.textSecondary,
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  petSelectorContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  petCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray300,
    minWidth: 100,
  },
  petCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  petName: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  petNameSelected: {
    color: COLORS.primary,
  },
  petSpecies: {
    fontSize: scale(12),
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  vaccineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW_STYLE,
  },
  vaccineIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  vaccineDescription: {
    fontSize: scale(14),
    color: COLORS.textSecondary,
    lineHeight: scale(18),
  },
  historyContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  historyIconContainer: {
    marginRight: SPACING.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyVaccineName: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: scale(14),
    color: COLORS.textSecondary,
  },
  historyNextDue: {
    fontSize: scale(14),
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: verticalScale(100),
  },
  emptyText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: scale(14),
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  addPetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  addPetButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: scale(16),
    fontWeight: '600',
  },
});