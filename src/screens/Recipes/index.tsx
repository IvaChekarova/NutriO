import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { useRecipesLogic } from './logic';
import { createStyles } from './styles';

const RecipesScreen = () => {
  useRecipesLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>Suggestions by dietary preferences.</Text>
    </View>
  );
};

export default RecipesScreen;
