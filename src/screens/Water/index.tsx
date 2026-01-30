import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { useWaterLogic } from './logic';
import { createStyles } from './styles';

const WaterScreen = () => {
  useWaterLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water</Text>
      <Text style={styles.subtitle}>Hydration reminders and intake log.</Text>
    </View>
  );
};

export default WaterScreen;
