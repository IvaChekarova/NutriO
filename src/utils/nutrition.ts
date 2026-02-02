type Sex = 'male' | 'female' | 'na' | null | undefined;

type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | null
  | undefined;

type CalorieGoalInput = {
  weightKg?: number | null;
  heightCm?: number | null;
  age?: number | null;
  sex?: Sex;
  activityLevel?: ActivityLevel;
  goalText?: string | null;
};

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const DEFICIT_KCAL = 400;
const SURPLUS_KCAL = 300;

const calculateBmr = (params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}) => {
  const { weightKg, heightCm, age, sex } = params;
  const male = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const female = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  if (sex === 'male') {
    return male;
  }
  if (sex === 'female') {
    return female;
  }
  return (male + female) / 2;
};

const parseGoalType = (goalText?: string | null) => {
  const normalized = goalText?.toLowerCase() ?? '';
  if (normalized.includes('lose')) {
    return 'lose';
  }
  if (normalized.includes('gain')) {
    return 'gain';
  }
  if (normalized.includes('maintain')) {
    return 'maintain';
  }
  return 'maintain';
};

export const calculateDailyCalories = (input: CalorieGoalInput) => {
  const weightKg = input.weightKg ?? null;
  const heightCm = input.heightCm ?? null;
  const age = input.age ?? null;

  if (!weightKg || !heightCm || !age) {
    return null;
  }

  const bmr = calculateBmr({
    weightKg,
    heightCm,
    age,
    sex: input.sex ?? 'na',
  });

  const factor = ACTIVITY_FACTORS[input.activityLevel ?? ''] ?? 1.2;
  const tdee = bmr * factor;
  const goalType = parseGoalType(input.goalText);

  let target = tdee;
  if (goalType === 'lose') {
    target = tdee - DEFICIT_KCAL;
  }
  if (goalType === 'gain') {
    target = tdee + SURPLUS_KCAL;
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
  };
};
