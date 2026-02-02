import React from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from '../navigation/RootNavigator';
import SplashScreen from '../components/SplashScreen';
import { ThemeProvider, useTheme } from '../theme';
import { useAppLogic } from './logic';
import { styles } from './styles';

const App = () => {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { statusBarStyle, isReady } = useAppLogic();
  const { theme } = useTheme();

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <RootNavigator />
      </View>
    </>
  );
};

export default App;
