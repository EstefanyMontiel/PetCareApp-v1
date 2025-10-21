import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//importar pantallas 
import HomeScreen from '../components/HomeScreen';
import MapScreen from '../components/MapScreen';
import AgendaScreen from '../components/AgendaScreen';
import EmergencyScreen from '../components/EmergencyScreen';
import SettingScreen from '../components/SettingScreen';

const Tab = createBottomTabNavigator();

    export default function BottomTabNavigator() {
        return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mascotas') {
                iconName = focused ? 'paw' : 'paw-outline';
            } else if (route.name === 'Configuración') {
                iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Mapa') {
                iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Agenda') {
                iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Emergencia') {
                iconName = focused ? 'alert-circle' : 'alert-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6B9B8E', // Color verde de tu app
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}
        >
        <Tab.Screen name="Mascotas" component={HomeScreen} />
        <Tab.Screen name="Mapa" component={MapScreen} />
        <Tab.Screen name="Agenda" component={AgendaScreen} />
        <Tab.Screen name="Emergencia" component={EmergencyScreen} />
        <Tab.Screen name="Configuración" component={SettingScreen} />
        </Tab.Navigator>
    );
    }