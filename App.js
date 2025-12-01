import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import BottomTabNavigator from './src/navigation/BottomTabNavigatior';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar contextos
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext'; 
import { ThemeProvider } from './src/context/ThemeContext';

// Importar pantallas de autenticación
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import PetRegisterScreen from './src/components/PetRegisterScreen';

// Importar pantallas de mascotas
import HomeScreen from './src/components/pets/HomeScreen';
import VaccinationScreen from './src/components/pets/VaccinationScreen';
import DewormingScreen from './src/components/pets/DewormingScreen';
import AnnualExamScreen from './src/components/pets/AnnualExamScreen';
import AddVaccinationScreen from './src/components/pets/AddVaccinationScreen';
import AddDewormingScreen from './src/components/pets/AddDewormingScreen';
import AddAnnualExamScreen from './src/components/pets/AddAnnualExamScreen';
import HuellitasEternasScreen from './src/components/HuellitasEternasScreen';
import EditPetScreen from './src/components/EditPetScreen'; 
import UserNotificationsScreen from './src/components/UserNotificationsScreen';

// Importar pantallas de configuración
import EditProfileScreen from './src/components/EditProfileScreen';
import NotificationsScreen from './src/components/NotificationsScreen';

const Stack = createNativeStackNavigator();

//PANTALLA LOGIN Y REGISTER 
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

//PANTALLA HOME CON TABS
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="PetRegister" component={PetRegisterScreen} />

      <Stack.Screen name="Vacunación" component={VaccinationScreen} />
        <Stack.Screen name="AddVaccination" component={AddVaccinationScreen}
            options={{
            headerShown: false,
            presentation: 'modal', // ✅ Se abre como modal
            animation: 'slide_from_bottom' // ✅ Animación profesional
        }} />

      <Stack.Screen name="Desparasitación" component={DewormingScreen} />
        <Stack.Screen 
            name="AddDeworming" 
            component={AddDewormingScreen}
            options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom'
            }}
        />

      <Stack.Screen name="Examen anual" component={AnnualExamScreen} />
          <Stack.Screen 
              name="AddAnnualExam" 
              component={AddAnnualExamScreen}
              options={{
                  headerShown: false,
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
              }}
          />

      <Stack.Screen name="HuellitasEternas" component={HuellitasEternasScreen} />
      <Stack.Screen name="EditPet" component={EditPetScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="UserNotifications" component={UserNotificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, userPets, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  return <AppStack />;
}

export default function App() {
  return (
    <SafeAreaProvider>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}