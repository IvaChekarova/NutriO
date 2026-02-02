/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-void */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Alert,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { useWaterLogic } from './logic';
import { createStyles } from './styles';

const ML_PER_OZ = 29.5735;

const WaterScreen = () => {
  const water = useWaterLogic() ?? {};
  const totalMl = typeof water.totalMl === 'number' ? water.totalMl : 0;
  const goalMl = typeof water.goalMl === 'number' ? water.goalMl : 0;
  const dateLabel = typeof water.dateLabel === 'string' ? water.dateLabel : '';
  const shiftDate =
    typeof water.shiftDate === 'function' ? water.shiftDate : () => undefined;
  const unit = water.unit === 'oz' ? 'oz' : 'ml';
  const addWater = water.addWater ?? (async () => undefined);
  const resetWater = water.resetWater ?? (async () => undefined);
  const updateUnit = water.updateUnit ?? (async () => undefined);
  const remindersEnabled = Boolean(water.remindersEnabled);
  const reminderStartHourValue =
    typeof water.reminderStartHour === 'string'
      ? water.reminderStartHour
      : '08';
  const reminderEndHourValue =
    typeof water.reminderEndHour === 'string' ? water.reminderEndHour : '20';
  const reminderIntervalMinutes =
    typeof water.reminderIntervalMinutes === 'number'
      ? water.reminderIntervalMinutes
      : null;
  const updateRemindersEnabled =
    typeof water.updateRemindersEnabled === 'function'
      ? water.updateRemindersEnabled
      : async () => true;
  const updateReminderHours =
    water.updateReminderHours ?? (async () => undefined);
  const updateCustomGoal = water.updateCustomGoal ?? (async () => undefined);
  const pulseKey = typeof water.pulseKey === 'number' ? water.pulseKey : 0;
  const toDisplay =
    typeof water.toDisplay === 'function'
      ? water.toDisplay
      : (value: number) => value;
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [startHourInput, setStartHourInput] = useState(reminderStartHourValue);
  const [endHourInput, setEndHourInput] = useState(reminderEndHourValue);
  const [goalInput, setGoalInput] = useState('');
  const waterAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const effectiveGoalMl = goalMl < 250 ? goalMl * 1000 : goalMl;
  const displayTotal = toDisplay(totalMl);
  const displayGoal = toDisplay(effectiveGoalMl);
  const displayUnit = unit === 'oz' ? 'oz' : 'ml';
  const displayTotalLabel =
    unit === 'oz'
      ? `${Math.round(displayTotal)} ${displayUnit}`
      : `${(displayTotal / 1000).toFixed(1)} L`;
  const displayGoalLabel =
    unit === 'oz'
      ? `${Math.round(displayGoal)} ${displayUnit}`
      : `${(displayGoal / 1000).toFixed(1)} L`;

  useEffect(() => {
    Animated.timing(waterAnim, {
      toValue: totalMl,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [totalMl, waterAnim]);

  useEffect(() => {
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [pulseKey, rippleAnim]);

  const glassHeight = 220;
  const fillHeight = waterAnim.interpolate({
    inputRange: [0, Math.max(effectiveGoalMl, 1)],
    outputRange: [0, glassHeight],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    setStartHourInput(reminderStartHourValue);
    setEndHourInput(reminderEndHourValue);
  }, [reminderEndHourValue, reminderStartHourValue]);

  const sanitizeNumberInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length <= 1) {
      return cleaned;
    }
    return `${parts[0]}.${parts.slice(1).join('')}`;
  };

  useEffect(() => {
    if (goalMl > 0) {
      if (unit === 'oz') {
        setGoalInput(String(Math.round(toDisplay(goalMl))));
      } else {
        setGoalInput((goalMl / 1000).toFixed(1));
      }
    }
  }, [goalMl, toDisplay, unit]);

  const quickAddOptions = [100, 250, 500];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Water intake</Text>
            <Text style={styles.subtitle}>
              {dateLabel || 'Stay on track with your hydration.'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.dateNav}>
              <Pressable
                style={styles.navButton}
                onPress={() => shiftDate('prev')}
              >
                <Text style={styles.navButtonText}>{'<'}</Text>
              </Pressable>
              <Pressable
                style={styles.navButton}
                onPress={() => shiftDate('next')}
              >
                <Text style={styles.navButtonText}>{'>'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.glassWrap}>
            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [
                    {
                      scale: rippleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.06],
                      }),
                    },
                  ],
                  opacity: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0],
                  }),
                },
              ]}
            />
            <View style={styles.glass}>
              <Animated.View
                style={[
                  styles.glassFill,
                  {
                    height: fillHeight,
                  },
                ]}
              />
              <View style={styles.glassShine} />
            </View>
            <View style={styles.progressCenter}>
              <Text style={styles.progressValue}>{displayTotalLabel}</Text>
              <Text style={styles.progressGoal}>/ {displayGoalLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickAddRow}>
          {quickAddOptions.map(amount => {
            const unitValue = unit === 'oz' ? toDisplay(amount) : amount;
            const labelValue = unit === 'oz' ? Math.round(unitValue) : amount;
            return (
              <Pressable
                key={amount}
                style={styles.quickAddButton}
                onPress={() => addWater(unitValue)}
              >
                <Text style={styles.quickAddText}>
                  +{labelValue} {displayUnit}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            style={[styles.quickAddButton, styles.quickAddCustom]}
            onPress={() => setShowCustom(true)}
          >
            <Text style={[styles.quickAddText, styles.quickAddTextLight]}>
              Custom +
            </Text>
          </Pressable>
          <Pressable
            style={[styles.quickAddButton, styles.quickAddReset]}
            onPress={resetWater}
          >
            <Text style={styles.quickAddText}>Reset</Text>
          </Pressable>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Write your own goal</Text>
          <Text style={styles.goalSubtitle}>Minimum 2.0 L per day.</Text>
          <View style={styles.goalInputRow}>
            <TextInput
              style={styles.goalInput}
              keyboardType="decimal-pad"
              value={goalInput}
              onChangeText={value => setGoalInput(sanitizeNumberInput(value))}
              onEndEditing={() => {
                const value = Number.parseFloat(goalInput);
                if (!Number.isNaN(value)) {
                  const nextValue =
                    unit === 'oz' ? value * ML_PER_OZ : value * 1000;
                  updateCustomGoal(nextValue);
                }
              }}
            />
            <Text style={styles.goalUnitLabel}>
              {unit === 'oz' ? 'oz' : 'L'}
            </Text>
          </View>
          <View style={styles.unitToggle}>
            <Pressable
              style={[styles.unitChip, unit === 'ml' && styles.unitChipActive]}
              onPress={() => updateUnit('ml')}
            >
              <Text
                style={[
                  styles.unitChipText,
                  unit === 'ml' && styles.unitChipTextActive,
                ]}
              >
                ml
              </Text>
            </Pressable>
            <Pressable
              style={[styles.unitChip, unit === 'oz' && styles.unitChipActive]}
              onPress={() => updateUnit('oz')}
            >
              <Text
                style={[
                  styles.unitChipText,
                  unit === 'oz' && styles.unitChipTextActive,
                ]}
              >
                oz
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <View>
              <Text style={styles.reminderTitle}>Water reminders</Text>
              <Text style={styles.reminderSubtitle}>
                Choose when to receive reminders.
              </Text>
            </View>
            <Pressable
              style={[
                styles.reminderToggle,
                remindersEnabled && styles.reminderToggleActive,
              ]}
              onPress={async () => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                const next = !remindersEnabled;
                const allowed = await updateRemindersEnabled(next);
                if (next && !allowed) {
                  Alert.alert(
                    'Reminders disabled',
                    'Please allow notifications to receive water reminders.',
                  );
                }
              }}
            >
              <View
                style={[
                  styles.reminderKnob,
                  remindersEnabled && styles.reminderKnobActive,
                ]}
              />
            </Pressable>
          </View>

          {remindersEnabled ? (
            <>
              <View style={styles.reminderHours}>
                <View style={styles.reminderInputGroup}>
                  <Text style={styles.reminderLabel}>From</Text>
                  <TextInput
                    style={styles.reminderInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={startHourInput}
                    onChangeText={setStartHourInput}
                    onEndEditing={() =>
                      updateReminderHours(
                        startHourInput.padStart(2, '0'),
                        endHourInput.padStart(2, '0'),
                      )
                    }
                  />
                </View>
                <View style={styles.reminderInputGroup}>
                  <Text style={styles.reminderLabel}>To</Text>
                  <TextInput
                    style={styles.reminderInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={endHourInput}
                    onChangeText={setEndHourInput}
                    onEndEditing={() =>
                      updateReminderHours(
                        startHourInput.padStart(2, '0'),
                        endHourInput.padStart(2, '0'),
                      )
                    }
                  />
                </View>
              </View>
              {void reminderIntervalMinutes}
            </>
          ) : null}
        </View>
      </ScrollView>

      <Modal visible={showCustom} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowCustom(false)} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add custom amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={unit === 'oz' ? 'Amount in oz' : 'Amount in ml'}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="decimal-pad"
              value={customValue}
              onChangeText={setCustomValue}
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                const value = Number.parseFloat(customValue);
                if (!Number.isNaN(value)) {
                  addWater(value);
                }
                setCustomValue('');
                setShowCustom(false);
              }}
            >
              <Text style={styles.modalButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WaterScreen;
