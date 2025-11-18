import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

//importar pantallas 
import HomeScreen from '../components/pets/HomeScreen';
import MapScreen from '../components/MapScreen';
import AgendaScreen from '../components/agenda/AgendaScreen';
import EmergencyScreen from '../components/EmergencyScreen';
import SettingScreen from '../components/SettingScreen';

const Tab = createBottomTabNavigator();

    export default function BottomTabNavigator() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'paw' : 'paw-outline';
                        } else if (route.name === 'Agenda') {
                            iconName = focused ? 'calendar' : 'calendar-outline';
                        } else if (route.name === 'Configuración') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        } else if (route.name === 'Mapa') {
                            iconName = focused ? 'location' : 'location-outline';
                        } else if (route.name === 'Emergencia') {
                            iconName = focused ? 'medkit' : 'medkit-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#4ECDC4',
                    tabBarInactiveTintColor: '#95A5A6',
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 0,
                        height: Platform.OS === 'ios' ? 85 : 65,
                        padding: 20,
                        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                        position: 'absolute',
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 16,
                            },
                            android: {
                                elevation: 12,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            },
                        }),
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                        letterSpacing: 0.3,
                        marginBottom: Platform.OS === 'ios' ? 0 : 2,
                    },
                    tabBarItemStyle: {
                        paddingVertical: Platform.OS === 'ios' ? 4 : 8,
                    },
                })}
            >
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Mascotas' }}
                />
                <Tab.Screen 
                    name="Agenda" 
                    component={AgendaScreen}
                    options={{ title: 'Agenda' }}
                />
                <Tab.Screen 
                    name="Mapa" 
                    component={MapScreen}
                    options={{ title: 'Mapa' }}
                />
                <Tab.Screen 
                    name="Emergencia" 
                    component={EmergencyScreen}
                    options={{ title: 'Emergencia' }}
                />
                <Tab.Screen 
                    name="Configuración" 
                    component={SettingScreen}
                    options={{ title: 'Ajustes' }}
                />
            </Tab.Navigator>
    );
    }