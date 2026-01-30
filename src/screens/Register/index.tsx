import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { routes } from '../../navigation/routes';
import { useRegisterLogic } from './logic';
import { createStyles } from './styles';

const RegisterScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    canSubmit,
    passwordMismatch,
    passwordStrength,
    strengthProgress,
    isPasswordFocused,
    setIsPasswordFocused,
    passwordTooWeak,
    emailError,
    isCheckingEmail,
    isSubmitting,
    submitError,
    submitSuccess,
    createdProfileId,
    handleSubmit,
  } = useRegisterLogic();

  const [trackWidth, setTrackWidth] = useState(0);
  const strengthWidth = useMemo(
    () => Animated.multiply(strengthProgress, trackWidth),
    [strengthProgress, trackWidth],
  );

  useEffect(() => {
    if (createdProfileId) {
      navigation.navigate(routes.auth.profileOnboarding, {
        profileId: createdProfileId,
      });
    }
  }, [createdProfileId, navigation]);

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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Start building a healthier routine with personal meal planning and
              mindful tracking.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Jane Doe"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardAppearance="dark"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

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
              {isCheckingEmail ? (
                <Text style={styles.helperMuted}>Checking email...</Text>
              ) : null}
              {emailError ? (
                <Text style={styles.helper}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 8 characters"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardAppearance="dark"
                secureTextEntry
                textContentType="oneTimeCode"
                autoComplete="off"
                importantForAutofill="no"
                passwordRules=""
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                returnKeyType="next"
              />
              {isPasswordFocused ? (
                <>
                  <View style={styles.strengthRow}>
                    <View
                      style={styles.strengthTrack}
                      onLayout={event =>
                        setTrackWidth(event.nativeEvent.layout.width)
                      }
                    >
                      <Animated.View
                        style={[
                          styles.strengthFill,
                          {
                            width: strengthWidth,
                            backgroundColor: passwordStrength.label === 'Strong'
                              ? theme.colors.primary
                              : passwordStrength.label === 'Moderate'
                                ? theme.colors.accent
                                : theme.colors.textSecondary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.strengthLabel}>
                      {passwordStrength.label}
                    </Text>
                  </View>
                  {password.length > 0 && passwordStrength.label !== 'Strong' ? (
                    <View style={styles.tips}>
                      {passwordStrength.tips.slice(0, 3).map(tip => (
                        <Text key={tip} style={styles.tipText}>
                          {tip}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </>
              ) : null}
              {passwordTooWeak ? (
                <Text style={styles.helper}>
                  Use a moderate or strong password to continue.
                </Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat password"
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
              {passwordMismatch ? (
                <Text style={styles.helper}>Passwords do not match.</Text>
              ) : null}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              !canSubmit && styles.buttonDisabled,
              pressed && canSubmit && { opacity: 0.85 },
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting || submitSuccess}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </Text>
          </Pressable>

          {submitSuccess ? (
            <Text style={styles.successText}>
              Account created locally. We will set up onboarding next.
            </Text>
          ) : null}
          {submitError ? (
            <Text style={styles.helper}>{submitError}</Text>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate(routes.auth.login)}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
