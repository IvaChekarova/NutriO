import { useMemo, useState } from 'react';

import { setSession, updateProfile } from '../../data';
import { icons } from '../../assets/icons';

export type ProfileOnboardingStep = {
  id: string;
  title: string;
  description: string;
};

type Option = {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
};

const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
};

const isLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getDaysInMonth = (month: number, year: number) => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
};

const parseBirthday = (day: string, month: string, year: string) => {
  if (!day || !month || !year) {
    return null;
  }

  const dayNum = Number.parseInt(day, 10);
  const monthNum = Number.parseInt(month, 10);
  const yearNum = Number.parseInt(year, 10);

  if (Number.isNaN(dayNum) || Number.isNaN(monthNum) || Number.isNaN(yearNum)) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  if (yearNum < 1900 || yearNum > currentYear) {
    return null;
  }

  if (monthNum < 1 || monthNum > 12) {
    return null;
  }

  const daysInMonth = getDaysInMonth(monthNum, yearNum);
  if (dayNum < 1 || dayNum > daysInMonth) {
    return null;
  }

  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  if (date > today) {
    return null;
  }

  return date;
};

const getAgeFromDate = (date: Date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

export const useProfileOnboardingLogic = (profileId: string) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [sex, setSex] = useState<string | null>(null);
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedDietTags, setSelectedDietTags] = useState<string[]>([]);
  const [timezone, setTimezone] = useState(getTimezone());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const steps = useMemo<ProfileOnboardingStep[]>(
    () => [
      {
        id: 'intro',
        title: 'Personalize your plan',
        description:
          'A few quick details help us tailor meal plans, macro targets, and hydration reminders just for you.',
      },
      {
        id: 'basics',
        title: 'Tell us about you',
        description: 'This helps us calculate your baseline energy needs.',
      },
      {
        id: 'body',
        title: 'Body metrics',
        description: 'We use these to estimate calories and macros accurately.',
      },
      {
        id: 'goals',
        title: 'Goals & activity',
        description:
          'Your goal and activity level guide daily recommendations.',
      },
      {
        id: 'diet',
        title: 'Preferences',
        description: 'Diet tags help us filter recipes and suggestions.',
      },
    ],
    [],
  );

  const sexOptions = useMemo<Option[]>(
    () => [
      { id: 'male', label: 'Male' },
      { id: 'female', label: 'Female' },
      { id: 'na', label: 'Prefer not to say' },
    ],
    [],
  );

  const activityOptions = useMemo<Option[]>(
    () => [
      {
        id: 'sedentary',
        label: 'Not active',
        description: 'Mostly sitting, minimal movement during the day.',
      },
      {
        id: 'light',
        label: 'Lightly active',
        description: 'Short walks or light activity a few times per week.',
      },
      {
        id: 'moderate',
        label: 'Moderately active',
        description: 'Regular movement or workouts 3-4 days per week.',
      },
      {
        id: 'active',
        label: 'Very active',
        description: 'High activity or training most days of the week.',
      },
    ],
    [],
  );

  const goalOptions = useMemo<(Option & { icon: number })[]>(
    () => [
      { id: 'lose', label: 'Lose weight', icon: icons.goalLoseWeight },
      { id: 'maintain', label: 'Maintain', icon: icons.goalMaintain },
      { id: 'gain', label: 'Gain muscle', icon: icons.goalMuscle },
      { id: 'energy', label: 'More energy', icon: icons.goalEnergy },
      { id: 'custom', label: 'Custom goal', icon: icons.goalCustom },
    ],
    [],
  );

  const dietOptions = useMemo<Option[]>(
    () => [
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
      { id: 'pescatarian', label: 'Pescatarian' },
      { id: 'gluten-free', label: 'Gluten-free' },
      { id: 'dairy-free', label: 'Dairy-free' },
      { id: 'keto', label: 'Keto' },
      { id: 'paleo', label: 'Paleo' },
      { id: 'low-carb', label: 'Low carb' },
    ],
    [],
  );

  const birthdayDate = useMemo(
    () => parseBirthday(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear],
  );

  const birthdayTouched = birthDay || birthMonth || birthYear;
  const birthdayError = useMemo(() => {
    if (!birthdayTouched) {
      return '';
    }
    return birthdayDate ? '' : 'Enter a valid birthday.';
  }, [birthdayTouched, birthdayDate]);

  const selectedGoalLabels = useMemo(() => {
    const labels = selectedGoals
      .map(id => goalOptions.find(option => option.id === id)?.label)
      .filter(Boolean) as string[];
    if (selectedGoals.includes('custom') && customGoal.trim()) {
      return [
        ...labels.filter(label => label !== 'Custom goal'),
        customGoal.trim(),
      ];
    }
    return labels;
  }, [selectedGoals, goalOptions, customGoal]);

  const selectedDietLabels = useMemo(
    () =>
      selectedDietTags
        .map(id => dietOptions.find(option => option.id === id)?.label)
        .filter(Boolean) as string[],
    [selectedDietTags, dietOptions],
  );

  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    setStepIndex(current => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex(current => Math.max(current - 1, 0));
  };

  const handleSkip = async () => {
    await setSession({ isLoggedIn: true, profileId });
  };

  const handleComplete = async () => {
    if (birthdayError) {
      setError(birthdayError);
      return;
    }

    if (selectedGoals.includes('custom') && !customGoal.trim()) {
      setError('Add a custom goal or deselect it.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const parsedAge = birthdayDate ? getAgeFromDate(birthdayDate) : null;
    const parsedHeight = heightCm ? Number.parseFloat(heightCm) : null;
    const parsedWeight = weightKg ? Number.parseFloat(weightKg) : null;

    try {
      await updateProfile({
        id: profileId,
        dietTags: selectedDietLabels.length
          ? selectedDietLabels.join(', ')
          : null,
        heightCm: Number.isNaN(parsedHeight) ? null : parsedHeight,
        weightKg: Number.isNaN(parsedWeight) ? null : parsedWeight,
        age: Number.isNaN(parsedAge) ? null : parsedAge,
        sex: sex ?? null,
        activityLevel: activityLevel ?? null,
        goal: selectedGoalLabels.length ? selectedGoalLabels.join(', ') : null,
        timezone: timezone.trim() ? timezone.trim() : null,
      });

      await setSession({ isLoggedIn: true, profileId });
    } catch {
      setError('Unable to save your profile right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    sex,
    setSex,
    heightCm,
    setHeightCm,
    weightKg,
    setWeightKg,
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
    handleSkip,
    handleComplete,
  };
};
