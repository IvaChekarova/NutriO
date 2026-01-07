import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import { useAppLogic } from './logic';
import { styles } from './styles';

const App = () => {
  const { statusBarStyle } = useAppLogic();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={statusBarStyle} />
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
