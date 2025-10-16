import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// ✅ Importar contexto desde la ruta correcta
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Importar pantallas desde la ruta correcta
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import PetRegisterScreen from './src/components/PetRegisterScreen';
import HomeScreen from './src/components/HomeScreen';
import VaccinationScreen from './src/components/VaccinationScreen';
import DewormingScreen from './src/components/DewormingScreen';
import AnnualExamScreen from './src/components/AnnualExamScreen';


const Stack = createNativeStackNavigator();

//PANTALLA LOGIN  REGISTER 
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Mis Mascotas',
          headerShown: true 
        }}
      />
      <Stack.Screen 
        name="PetRegister" 
        component={PetRegisterScreen} 
        options={{ 
          title: 'Registrar Mascota',
          headerShown: true 
        }}
      />
    <Stack.Screen name="Vacunación" component={VaccinationScreen} />
    <Stack.Screen name="Desparasitación" component={DewormingScreen} />
    <Stack.Screen name="Examen anual" component={AnnualExamScreen} />
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
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}