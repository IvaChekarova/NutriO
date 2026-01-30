import React from 'react';
import { Animated, Image, View } from 'react-native';

import { useTheme } from '../../theme';
import { useSplashLogic } from './logic';
import { createStyles } from './styles';

const SplashScreen = () => {
  const { theme } = useTheme();
  const { logo, logoOpacity, logoScale } = useSplashLogic();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image source={logo} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
