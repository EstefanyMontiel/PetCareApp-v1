import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import BottomTabNavigator from './src/navigation/BottomTabNavigatior';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Importar contexto desde la ruta correcta
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';

// Importar pantallas desde la ruta correcta
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import PetRegisterScreen from './src/components/PetRegisterScreen';
import HomeScreen from './src/components/HomeScreen';
import VaccinationScreen from './src/components/VaccinationScreen';
import DewormingScreen from './src/components/DewormingScreen';
import AnnualExamScreen from './src/components/AnnualExamScreen';
import HuellitasEternasScreen from './src/components/HuellitasEternasScreen';
import EditProfileScreen from './src/components/EditProfileScreen';
import NotificationsScreen from './src/components/NotificationsScreen';
import ChangePasswordScreen from './src/components/ChangePasswordScreen';

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
        component={BottomTabNavigator} 
        options={{ 
          headerShown: false 
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
        <Stack.Screen 
          name="HuellitasEternas" 
          component={HuellitasEternasScreen} 
          options={{ 
            title: 'Huellitas Eternas',
            headerShown: true 
          }}
        />
    <Stack.Screen name="Vacunación" component={VaccinationScreen} />
    <Stack.Screen name="Desparasitación" component={DewormingScreen} />
    <Stack.Screen name="Examen anual" component={AnnualExamScreen} />
    
    {/* Settings Screens */}
    <Stack.Screen 
      name="EditProfile" 
      component={EditProfileScreen} 
      options={{ 
        title: 'Editar Perfil',
        headerShown: true 
      }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={NotificationsScreen} 
      options={{ 
        title: 'Notificaciones',
        headerShown: true 
      }}
    />
    <Stack.Screen 
      name="ChangePassword" 
      component={ChangePasswordScreen} 
      options={{ 
        title: 'Cambiar Contraseña',
        headerShown: true 
      }}
    />
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
      <AuthProvider>
        <LanguageProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}