import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecipesScreen from '../screens/Recipes';
import RecipeDetailScreen from '../screens/RecipeDetail';
import { useTheme } from '../theme';

export type RecipesStackParamList = {
  RecipesList: undefined;
  RecipeDetail: { id: string };
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

const RecipesNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerBackTitle: ' ',
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { color: theme.colors.textPrimary },
      }}
    >
      <Stack.Screen
        name="RecipesList"
        component={RecipesScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerBackTitle: ' ',
        }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          headerShown: true,
          title: 'Recipe',
          headerBackTitleVisible: false,
          headerBackTitle: ' ',
        }}
      />
    </Stack.Navigator>
  );
};

export default RecipesNavigator;
