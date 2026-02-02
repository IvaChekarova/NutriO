/* eslint-disable no-void */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

import {
  addWaterLog,
  getDatabase,
  getProfileById,
  getSession,
  getWaterTotalForDate,
} from '../../data';
import {
  cancelWaterReminders,
  requestWaterPermission,
  scheduleWaterReminders,
} from '../../services/notifications/waterReminders';
import { schema } from '../../data/local/schema';

type Unit = 'ml' | 'oz';

const ML_PER_OZ = 29.5735;

const toMl = (value: number, unit: Unit) =>
  unit === 'oz' ? value * ML_PER_OZ : value;

const fromMl = (value: number, unit: Unit) =>
  unit === 'oz' ? value / ML_PER_OZ : value;

const getDefaultGoalMl = (weightKg?: number, activityLevel?: string) => {
  if (!weightKg || !Number.isFinite(weightKg)) {
    return 2000;
  }
  const baseMap: Record<string, number> = {
    sedentary: 30,
    light: 35,
    moderate: 40,
    active: 45,
  };
  const multiplier = baseMap[activityLevel ?? 'sedentary'] ?? 35;
  return Math.round(weightKg * multiplier);
};

export const useWaterLogic = () => {
  const [totalMl, setTotalMl] = useState(0);
  const [unit, setUnit] = useState<Unit>('ml');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderStartHour, setReminderStartHour] = useState('08');
  const [reminderEndHour, setReminderEndHour] = useState('20');
  const [customGoalMl, setCustomGoalMl] = useState<number | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileMeta, setProfileMeta] = useState<{
    weightKg?: number;
    activityLevel?: string;
  }>({});
  const [pulseKey, setPulseKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateLabel = useMemo(() => {
    return selectedDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const session = await getSession();
      const scopedKey = (key: string) =>
        session.profileId ? `${key}.${session.profileId}` : key;
      const storedUnit = await AsyncStorage.getItem(scopedKey('water.unit'));
      const storedReminders = await AsyncStorage.getItem(
        scopedKey('water.remindersEnabled'),
      );
      const storedStart = await AsyncStorage.getItem(
        scopedKey('water.reminderStart'),
      );
      const storedEnd = await AsyncStorage.getItem(
        scopedKey('water.reminderEnd'),
      );
      const storedCustomGoal = await AsyncStorage.getItem(
        scopedKey('water.customGoalMl'),
      );
      setProfileId(session.profileId ?? null);
      if (session.profileId) {
        const profile = await getProfileById(session.profileId);
        if (profile && isActive) {
          setProfileMeta({
            weightKg: profile.weight_kg ?? undefined,
            activityLevel: profile.activity_level ?? undefined,
          });
        }
      }

      if (!isActive) {
        return;
      }
      if (storedUnit === 'oz') {
        setUnit('oz');
      }
      if (storedReminders) {
        setRemindersEnabled(storedReminders === 'true');
      }
      if (storedStart) {
        setReminderStartHour(storedStart);
      }
      if (storedEnd) {
        setReminderEndHour(storedEnd);
      }
      if (storedCustomGoal) {
        const parsed = Number.parseFloat(storedCustomGoal);
        if (!Number.isNaN(parsed)) {
          setCustomGoalMl(parsed);
        }
      }
      const total = await getWaterTotalForDate(selectedDate);
      if (isActive) {
        setTotalMl(total);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  useEffect(() => {
    const checkRollover = () => {
      const now = new Date();
      const sameDay =
        now.getFullYear() === selectedDate.getFullYear() &&
        now.getMonth() === selectedDate.getMonth() &&
        now.getDate() === selectedDate.getDate();
      if (!sameDay) {
        setSelectedDate(now);
      }
    };

    const interval = setInterval(checkRollover, 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const goalMl = useMemo(() => {
    if (customGoalMl && Number.isFinite(customGoalMl)) {
      return Math.max(2000, customGoalMl);
    }
    return getDefaultGoalMl(profileMeta.weightKg, profileMeta.activityLevel);
  }, [customGoalMl, profileMeta.activityLevel, profileMeta.weightKg]);

  const reminderIntervalMinutes = useMemo(() => {
    if (!remindersEnabled || goalMl <= 0) {
      return null;
    }
    const remaining = Math.max(goalMl - totalMl, 0);
    const remainingRatio = remaining / goalMl;
    if (remaining === 0) {
      return null;
    }
    if (remainingRatio > 0.75) {
      return 60;
    }
    if (remainingRatio > 0.5) {
      return 90;
    }
    if (remainingRatio > 0.25) {
      return 120;
    }
    return 180;
  }, [goalMl, remindersEnabled, totalMl]);

  const addWater = async (amount: number) => {
    const amountMl = toMl(amount, unit);
    if (!Number.isFinite(amountMl) || amountMl <= 0) {
      return;
    }
    await addWaterLog(selectedDate, amountMl, 'quick');
    const nextTotal = await getWaterTotalForDate(selectedDate);
    setTotalMl(nextTotal);
    setPulseKey(key => key + 1);
  };

  const resetWater = async () => {
    if (!profileId) {
      return;
    }
    const db = await getDatabase();
    await db.executeSql(
      `DELETE FROM ${schema.tables.water_logs} WHERE date = ? AND profile_id = ?;`,
      [selectedDate.toISOString().slice(0, 10), profileId],
    );
    setTotalMl(0);
  };

  const updateUnit = async (nextUnit: Unit) => {
    setUnit(nextUnit);
    const key = profileId ? `water.unit.${profileId}` : 'water.unit';
    await AsyncStorage.setItem(key, nextUnit);
  };

  const updateRemindersEnabled = async (next: boolean) => {
    if (next) {
      const granted = await requestWaterPermission();
      if (!granted) {
        setRemindersEnabled(false);
        await AsyncStorage.setItem('water.remindersEnabled', 'false');
        return false;
      }
    }

    setRemindersEnabled(next);
    const key = profileId
      ? `water.remindersEnabled.${profileId}`
      : 'water.remindersEnabled';
    await AsyncStorage.setItem(key, next ? 'true' : 'false');
    if (!next) {
      await cancelWaterReminders();
    }
    return true;
  };

  const updateReminderHours = async (startHour: string, endHour: string) => {
    setReminderStartHour(startHour);
    setReminderEndHour(endHour);
    const startKey = profileId
      ? `water.reminderStart.${profileId}`
      : 'water.reminderStart';
    const endKey = profileId
      ? `water.reminderEnd.${profileId}`
      : 'water.reminderEnd';
    await AsyncStorage.setItem(startKey, startHour);
    await AsyncStorage.setItem(endKey, endHour);
  };

  const updateCustomGoal = async (valueMl: number) => {
    const normalized = Math.max(2000, valueMl);
    setCustomGoalMl(normalized);
    const key = profileId
      ? `water.customGoalMl.${profileId}`
      : 'water.customGoalMl';
    await AsyncStorage.setItem(key, String(normalized));
  };

  useEffect(() => {
    if (!remindersEnabled) {
      void cancelWaterReminders();
      return;
    }

    void scheduleWaterReminders({
      totalMl,
      goalMl,
      intervalMinutes: reminderIntervalMinutes,
      startHour: reminderStartHour,
      endHour: reminderEndHour,
    });
  }, [
    remindersEnabled,
    totalMl,
    goalMl,
    reminderIntervalMinutes,
    reminderStartHour,
    reminderEndHour,
  ]);

  return {
    selectedDate,
    dateLabel,
    totalMl,
    goalMl,
    unit,
    addWater,
    resetWater,
    updateUnit,
    remindersEnabled,
    reminderStartHour,
    reminderEndHour,
    reminderIntervalMinutes,
    shiftDate: (direction: 'prev' | 'next') => {
      setSelectedDate(current => {
        const next = new Date(current);
        next.setDate(current.getDate() + (direction === 'prev' ? -1 : 1));
        return next;
      });
    },
    updateRemindersEnabled,
    updateReminderHours,
    updateCustomGoal,
    pulseKey,
    profileMeta,
    toDisplay: (value: number) => fromMl(value, unit),
  } as const;
};
