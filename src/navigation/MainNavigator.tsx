import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeNavigator } from './HomeNavigator';
import  {SearchScreen}  from '../screens/search/SearchScreen';
import  {ProfileScreen}  from '../screens/profile/ProfileScreen';
import { MainTabParamList } from '../types';
import { colors, fontSize } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.bgCard,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: { fontSize: fontSize.xs },
      tabBarIcon: ({ color, size, focused }) => {
        const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
          Home: { active: 'home', inactive: 'home-outline' },
          Search: { active: 'search', inactive: 'search-outline' },
          Profile: { active: 'person', inactive: 'person-outline' },
        };
        const icon = icons[route.name];
        return (
          <Ionicons
            name={focused ? icon.active : icon.inactive}
            size={size}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeNavigator} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);