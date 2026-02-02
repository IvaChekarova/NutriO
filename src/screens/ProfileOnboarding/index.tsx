import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useTheme } from '../../theme';
import { useProfileOnboardingLogic } from './logic';
import { createStyles } from './styles';

const ProfileOnboardingScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<AuthStackParamList, 'ProfileOnboarding'>>();
  const {
    steps,
    stepIndex,
    isLast,
    birthDay,
    setBirthDay,
    birthMonth,
    setBirthMonth,
    birthYear,
    setBirthYear,
    birthdayError,
    birthdayLabel,
    sex,
    setSex,
    heightCm,
    setHeightCm,
    heightError,
    weightKg,
    setWeightKg,
    weightError,
    sexOptions,
    activityLevel,
    setActivityLevel,
    activityOptions,
    goalOptions,
    selectedGoals,
    setSelectedGoals,
    customGoal,
    setCustomGoal,
    dietOptions,
    selectedDietTags,
    setSelectedDietTags,
    timezone,
    setTimezone,
    isSubmitting,
    error,
    handleNext,
    handleBack,
    handleComplete,
    normalizeMetricInput,
  } = useProfileOnboardingLogic(route.params?.profileId ?? '');

  const step = steps[stepIndex];
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const renderFields = () => {
    switch (step.id) {
      case 'basics':
        return (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Birthday</Text>
              <Pressable
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.inputText}>{birthdayLabel}</Text>
              </Pressable>
              {birthdayError ? (
                <Text style={styles.helper}>{birthdayError}</Text>
              ) : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Sex</Text>
              <View style={styles.tileRow}>
                {sexOptions
                  .filter(option => option.id !== 'na')
                  .map(option => (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.tile,
                        sex === option.id && styles.tileActive,
                      ]}
                      onPress={() => setSex(option.id)}
                    >
                      <Text
                        style={[
                          styles.tileText,
                          sex === option.id && styles.tileTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
              </View>
              <View style={styles.tileRowCentered}>
                {sexOptions
                  .filter(option => option.id === 'na')
                  .map(option => (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.tile,
                        sex === option.id && styles.tileActive,
                      ]}
                      onPress={() => setSex(option.id)}
                    >
                      <Text
                        style={[
                          styles.tileText,
                          sex === option.id && styles.tileTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </View>
          </View>
        );
      case 'body':
        return (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                value={heightCm}
                onChangeText={setHeightCm}
                onEndEditing={() => setHeightCm(normalizeMetricInput(heightCm))}
                placeholder="e.g. 170"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardType="decimal-pad"
                keyboardAppearance="dark"
              />
              {heightError ? (
                <Text style={styles.helper}>{heightError}</Text>
              ) : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                value={weightKg}
                onChangeText={setWeightKg}
                onEndEditing={() => setWeightKg(normalizeMetricInput(weightKg))}
                placeholder="e.g. 65"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardType="decimal-pad"
                keyboardAppearance="dark"
              />
              {weightError ? (
                <Text style={styles.helper}>{weightError}</Text>
              ) : null}
            </View>
          </View>
        );
      case 'goals':
        return (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Activity level</Text>
              <View style={styles.tileStack}>
                {activityOptions.map(option => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.tileWide,
                      option.id === 'sedentary' && styles.activityNotActive,
                      option.id === 'light' && styles.activityLight,
                      option.id === 'moderate' && styles.activityModerate,
                      option.id === 'active' && styles.activityActive,
                      activityLevel === option.id && styles.tileActive,
                    ]}
                    onPress={() => setActivityLevel(option.id)}
                  >
                    <Text
                      style={[
                        styles.tileText,
                        activityLevel === option.id && styles.tileTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text style={styles.tileSubtext}>
                        {option.description}
                      </Text>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Goal (up to 3)</Text>
              <View style={styles.tileGrid}>
                {goalOptions.map(option => {
                  const selected = selectedGoals.includes(option.id);
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.tile, selected && styles.tileActive]}
                      onPress={() =>
                        setSelectedGoals(current =>
                          current.includes(option.id)
                            ? current.filter(item => item !== option.id)
                            : current.length >= 3
                              ? current
                              : [...current, option.id],
                        )
                      }
                    >
                      <View style={styles.tileIconWrap}>
                        <Image source={option.icon} style={styles.tileIcon} />
                      </View>
                      <Text
                        style={[
                          styles.tileText,
                          selected && styles.tileTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {selectedGoals.includes('custom') ? (
                <TextInput
                  value={customGoal}
                  onChangeText={setCustomGoal}
                  placeholder="Describe your goal"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardAppearance="dark"
                />
              ) : null}
            </View>
          </View>
        );
      case 'diet':
        return (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Diet tags (up to 3)</Text>
              <View style={styles.tileGrid}>
                {dietOptions.map(option => {
                  const selected = selectedDietTags.includes(option.id);
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.tile, selected && styles.tileActive]}
                      onPress={() =>
                        setSelectedDietTags(current =>
                          current.includes(option.id)
                            ? current.filter(item => item !== option.id)
                            : current.length >= 3
                              ? current
                              : [...current, option.id],
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.tileText,
                          selected && styles.tileTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Timezone</Text>
              <TextInput
                value={timezone}
                onChangeText={setTimezone}
                placeholder="e.g. Europe/Skopje"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                keyboardAppearance="dark"
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
            <View style={styles.progress}>
              {steps.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.progressDot,
                    index === stepIndex && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {renderFields()}

          <View style={styles.footer}>
            <View style={styles.navRow}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonSecondary,
                  styles.navButton,
                ]}
                onPress={handleBack}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Back
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.navButton]}
                onPress={isLast ? handleComplete : handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isLast ? 'Complete profile' : 'Next'}
                </Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.helper}>{error}</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showDatePicker} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDatePicker(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select your birthday</Text>
          <DateTimePicker
            value={
              birthDay && birthMonth && birthYear
                ? new Date(
                    Number.parseInt(birthYear, 10),
                    Number.parseInt(birthMonth, 10) - 1,
                    Number.parseInt(birthDay, 10),
                  )
                : new Date(2000, 0, 1)
            }
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') {
                setShowDatePicker(false);
              }
              if (date) {
                setBirthDay(String(date.getDate()).padStart(2, '0'));
                setBirthMonth(String(date.getMonth() + 1).padStart(2, '0'));
                setBirthYear(String(date.getFullYear()));
              }
            }}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileOnboardingScreen;
