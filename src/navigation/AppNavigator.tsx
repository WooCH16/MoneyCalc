import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Modal, Text } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { UnemploymentScreen } from '../screens/UnemploymentScreen';
import { SeveranceScreen } from '../screens/SeveranceScreen';
import { YearEndTaxScreen } from '../screens/YearEndTaxScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

// 달력 탭: DayDetailScreen을 Modal로 표시
function ScheduleTab() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <>
      <ScheduleScreen onDayPress={(date) => setSelectedDate(date)} />
      <Modal
        visible={!!selectedDate}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDate(null)}
      >
        {selectedDate && (
          <DayDetailScreen date={selectedDate} onClose={() => setSelectedDate(null)} />
        )}
      </Modal>
    </>
  );
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
        options={{ tabBarLabel: '홈', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      >
        {(props) => <HomeScreen onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Tab.Screen>
      <Tab.Screen
        name="Schedule"
        component={ScheduleTab}
        options={{ tabBarLabel: '근무달력', tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{ tabBarLabel: '급여계산', tabBarIcon: ({ focused }) => <TabIcon emoji="💰" focused={focused} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: '설정', tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Unemployment" component={UnemploymentScreen}
          options={{ presentation: 'modal' }} />
        <Stack.Screen name="Severance" component={SeveranceScreen}
          options={{ presentation: 'modal' }} />
        <Stack.Screen name="YearEndTax" component={YearEndTaxScreen}
          options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
