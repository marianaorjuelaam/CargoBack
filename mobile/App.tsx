import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ActiveTripScreen from './screens/ActiveTripScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useAuthStore } from './store/authStore';

const Tab = createBottomTabNavigator();

export default function App() {
  const { driver } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ color: 'white', marginTop: 10 }}>CargoBack</Text>
      </View>
    );
  }

  if (!driver) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>🚛 CargoBack</Text>
        <Text style={{ color: '#64748b' }}>Por favor, inicia sesión primero en la app web</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: {
            backgroundColor: '#0F172A',
            borderTopColor: '#1e293b',
            borderTopWidth: 1,
            paddingBottom: 8,
            height: 60,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') iconName = 'map';
            else if (route.name === 'Trip') iconName = 'navigate';
            else if (route.name === 'Profile') iconName = 'person';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Buscar', tabBarActiveTintColor: '#10b981' }}
        />
        <Tab.Screen
          name="Trip"
          component={ActiveTripScreen}
          options={{ tabBarLabel: 'Viaje' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: 'Perfil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
