import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import BottomTabNavigator from './src/navigation/BottomTabNavigatior';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar contextos
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext'; // ✅ NUEVO

// Importar pantallas de autenticación
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import PetRegisterScreen from './src/components/PetRegisterScreen';
import HomeScreen from './src/components/HomeScreen';
import VaccinationScreen from './src/components/VaccinationScreen';
import DewormingScreen from './src/components/DewormingScreen';
import AnnualExamScreen from './src/components/AnnualExamScreen';
import HuellitasEternasScreen from './src/components/HuellitasEternasScreen';

// Importar pantallas de configuración
import EditProfileScreen from './src/components/EditProfileScreen';
import NotificationsScreen from './src/components/NotificationsScreen';
import ChangePasswordScreen from './src/components/ChangePasswordScreen';

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
      <Stack.Screen name="Desparasitación" component={DewormingScreen} />
      <Stack.Screen name="Examen anual" component={AnnualExamScreen} />
      <Stack.Screen name="HuellitasEternas" component={HuellitasEternasScreen} />
      
      {/* ✅ NUEVO: Pantallas de configuración */}
      {/* Por ahora las comentamos hasta que las creemos */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
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
      {/* ✅ NUEVO: Envolver con LanguageProvider */}
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}