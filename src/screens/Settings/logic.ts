import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

import { getProfileById, getSession } from '../../data';
import { calculateDailyCalories } from '../../utils/nutrition';

type ProfileDetails = {
  id: string;
  email: string | null;
  displayName: string | null;
  dietTags: string | null;
  heightCm: number | null;
  weightKg: number | null;
  age: number | null;
  sex: string | null;
  activityLevel: string | null;
  goal: string | null;
};

const formatList = (value: string | null) =>
  value
    ? value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .join(', ')
    : '—';

const formatValue = (value: string | number | null) =>
  value === null || value === undefined || value === '' ? '—' : String(value);

const getHydrationGoalMl = async (weightKg: number | null) => {
  const stored = await AsyncStorage.getItem('water.customGoalMl');
  if (stored) {
    const parsed = Number.parseFloat(stored);
    if (!Number.isNaN(parsed)) {
      return Math.max(2000, parsed);
    }
  }
  if (!weightKg) {
    return 2000;
  }
  return Math.max(2000, Math.round(weightKg * 35));
};

export const useSettingsLogic = () => {
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [hydrationGoal, setHydrationGoal] = useState<number | null>(null);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const session = await getSession();
      if (!session.profileId) {
        return;
      }
      const record = await getProfileById(session.profileId);
      if (!record || !isActive) {
        return;
      }
      const details: ProfileDetails = {
        id: record.id,
        email: record.email ?? null,
        displayName: record.display_name ?? null,
        dietTags: record.diet_tags ?? null,
        heightCm: record.height_cm ?? null,
        weightKg: record.weight_kg ?? null,
        age: record.age ?? null,
        sex: record.sex ?? null,
        activityLevel: record.activity_level ?? null,
        goal: record.goal ?? null,
      };
      setProfile(details);
      const calories = calculateDailyCalories({
        weightKg: details.weightKg ?? undefined,
        heightCm: details.heightCm ?? undefined,
        age: details.age ?? undefined,
        sex: (details.sex as 'male' | 'female' | 'na' | null) ?? undefined,
        activityLevel:
          (details.activityLevel as
            | 'sedentary'
            | 'light'
            | 'moderate'
            | 'active'
            | null) ?? undefined,
        goalText: details.goal ?? undefined,
      });
      setCalorieGoal(calories?.target ?? null);
      const hydration = await getHydrationGoalMl(details.weightKg);
      if (isActive) {
        setHydrationGoal(hydration);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  const initials = useMemo(() => {
    const name = profile?.displayName?.trim();
    if (!name) {
      return 'U';
    }
    const parts = name.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase() || 'U';
  }, [profile?.displayName]);

  const formattedProfile = useMemo(
    () => ({
      name: profile?.displayName ?? 'Your profile',
      email: profile?.email ?? '—',
      height: profile?.heightCm ? `${profile.heightCm} cm` : '—',
      weight: profile?.weightKg ? `${profile.weightKg} kg` : '—',
      age: profile?.age ? `${profile.age}` : '—',
      sex: formatValue(profile?.sex ?? null),
      activity: formatValue(profile?.activityLevel ?? null),
      goal: formatList(profile?.goal ?? null),
      dietTags: formatList(profile?.dietTags ?? null),
    }),
    [profile],
  );

  return {
    profile: formattedProfile,
    initials,
    calorieGoal,
    hydrationGoal,
  } as const;
};
