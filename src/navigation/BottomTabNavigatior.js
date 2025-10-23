import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

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
                        borderTopWidth: 1,
                        borderTopColor: '#F0F0F0',
                        height: Platform.OS === 'ios' ? 88 : 68,
                        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
                        paddingTop: 12,
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                            },
                            android: {
                                elevation: 8,
                            },
                        }),
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        letterSpacing: 0.2,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 4,
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