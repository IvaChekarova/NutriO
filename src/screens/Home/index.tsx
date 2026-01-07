import React from 'react';
import { Text, View } from 'react-native';

import { useHomeLogic } from './logic';
import { styles } from './styles';

const HomeScreen = () => {
  const { title, subtitle } = useHomeLogic();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default HomeScreen;
