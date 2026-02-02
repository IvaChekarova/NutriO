import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { routes } from '../../navigation/routes';
import { useLoginLogic } from './logic';
import { createStyles } from './styles';

const LoginScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    email,
    setEmail,
    password,
    setPassword,
    canSubmit,
    isSubmitting,
    error,
    handleSubmit,
  } = useLoginLogic();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to keep your nutrition plan, recipes, and tracking in one
              place.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardAppearance="dark"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardAppearance="dark"
                secureTextEntry
                textContentType="oneTimeCode"
                autoComplete="off"
                importantForAutofill="no"
                passwordRules=""
                returnKeyType="done"
              />
              <Text
                style={styles.forgotLink}
                onPress={() => navigation.navigate(routes.auth.forgotPassword)}
              >
                Forgot password?
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              !canSubmit && styles.buttonDisabled,
              pressed && canSubmit && { opacity: 0.85 },
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Text>
          </Pressable>

          {error ? <Text style={styles.helper}>{error}</Text> : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New here?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate(routes.auth.register)}
              >
                Create an account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
