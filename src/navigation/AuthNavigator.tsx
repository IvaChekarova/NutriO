import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import OnboardingScreen from '../screens/Onboarding';
import ProfileOnboardingScreen from '../screens/ProfileOnboarding';
import RegisterScreen from '../screens/Register';
import { routes } from './routes';

export type AuthStackParamList = {
  [routes.auth.onboarding]: undefined;
  [routes.auth.register]: undefined;
  [routes.auth.login]: undefined;
  [routes.auth.forgotPassword]: undefined;
  [routes.auth.profileOnboarding]: { profileId: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.auth.onboarding}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={routes.auth.onboarding} component={OnboardingScreen} />
      <Stack.Screen name={routes.auth.register} component={RegisterScreen} />
      <Stack.Screen name={routes.auth.login} component={LoginScreen} />
      <Stack.Screen
        name={routes.auth.profileOnboarding}
        component={ProfileOnboardingScreen}
      />
      <Stack.Screen
        name={routes.auth.forgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
