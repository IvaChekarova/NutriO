import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { useTrackLogic } from './logic';
import { createStyles } from './styles';

const TrackScreen = () => {
  useTrackLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track</Text>
      <Text style={styles.subtitle}>Calories and macro tracking.</Text>
    </View>
  );
};

export default TrackScreen;
