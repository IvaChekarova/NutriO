import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { useGroceryLogic } from './logic';
import { createStyles } from './styles';

const GroceryScreen = () => {
  useGroceryLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery</Text>
      <Text style={styles.subtitle}>Generate lists from meal plans.</Text>
    </View>
  );
};

export default GroceryScreen;
