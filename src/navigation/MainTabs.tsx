import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import GroceryScreen from '../screens/Grocery';
import PlanScreen from '../screens/Plan';
import RecipesNavigator from './RecipesNavigator';
import SettingsScreen from '../screens/Settings';
import WaterScreen from '../screens/Water';
import { useTheme } from '../theme';
import { routes } from './routes';

export type MainTabParamList = {
  [routes.main.plan]: undefined;
  [routes.main.recipes]: undefined;
  [routes.main.grocery]: undefined;
  [routes.main.water]: undefined;
  [routes.main.settings]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
        },
        tabBarIcon: ({ color }) => {
          const iconMap: Record<string, string> = {
            [routes.main.plan]: '🍽️',
            [routes.main.recipes]: '📖',
            [routes.main.grocery]: '🛒',
            [routes.main.water]: '💧',
            [routes.main.settings]: '⚙️',
          };
          const icon = iconMap[route.name] ?? '•';
          return <Text style={{ fontSize: 18, color }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name={routes.main.plan} component={PlanScreen} />
      <Tab.Screen name={routes.main.recipes} component={RecipesNavigator} />
      <Tab.Screen name={routes.main.grocery} component={GroceryScreen} />
      <Tab.Screen name={routes.main.water} component={WaterScreen} />
      <Tab.Screen name={routes.main.settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
