import { useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType } from 'react-native';

import { images } from '../../assets/images';

export const useSplashLogic = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  const logo: ImageSourcePropType = images.logo;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [logoOpacity, logoScale]);

  return { logo, logoOpacity, logoScale };
};
