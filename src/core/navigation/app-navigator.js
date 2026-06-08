import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from '../theme/colors';
import { useEuLevo } from '../store/eulevo-store';
import { LoginScreen } from '../../features/auth/presentation/LoginScreen';
import { EventsListScreen } from '../../features/events/presentation/EventsListScreen';
import { CreateEventScreen } from '../../features/events/presentation/CreateEventScreen';
import { EventDetailScreen } from '../../features/events/presentation/EventDetailScreen';
import { NotificationsScreen } from '../../shared/screens/NotificationsScreen';
import { ProfileScreen } from '../../features/auth/presentation/ProfileScreen';
import { ParticipantsScreen } from '../../features/participants/presentation/ParticipantsScreen';
import { ChatScreen } from '../../features/chat/presentation/ChatScreen';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: '#fff',
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontWeight: '800' },
      }}
    >
      <HomeStack.Screen
        name="HomeList"
        component={EventsListScreen}
        options={{ title: '' }}
      />

      <HomeStack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Criar evento' }}
      />

      <HomeStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: '' }}
      />

      <HomeStack.Screen
        name="Participants"
        component={ParticipantsScreen}
        options={{ title: 'Participantes' }}
      />

      <HomeStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: '' }}
      />
    </HomeStack.Navigator>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Inicio"
        component={HomeStackScreen}
      />

      <Tabs.Screen
        name="Avisos"
        component={NotificationsScreen}
      />

      <Tabs.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { currentUser } = useEuLevo();

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          <RootStack.Screen name="AppTabs" component={TabsScreen} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}