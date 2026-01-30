import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import GroceryScreen from '../screens/Grocery';
import PlanScreen from '../screens/Plan';
import RecipesScreen from '../screens/Recipes';
import SettingsScreen from '../screens/Settings';
import TrackScreen from '../screens/Track';
import WaterScreen from '../screens/Water';
import { routes } from './routes';

export type MainTabParamList = {
  [routes.main.plan]: undefined;
  [routes.main.track]: undefined;
  [routes.main.recipes]: undefined;
  [routes.main.grocery]: undefined;
  [routes.main.water]: undefined;
  [routes.main.settings]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={routes.main.plan} component={PlanScreen} />
      <Tab.Screen name={routes.main.track} component={TrackScreen} />
      <Tab.Screen name={routes.main.recipes} component={RecipesScreen} />
      <Tab.Screen name={routes.main.grocery} component={GroceryScreen} />
      <Tab.Screen name={routes.main.water} component={WaterScreen} />
      <Tab.Screen name={routes.main.settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
