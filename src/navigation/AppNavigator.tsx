import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingBottom: 8, height: 60 },
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          tabBarLabel: '급여계산',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💰" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
