import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  addMealItem,
  deleteMealItem,
  getMealItemsForPlan,
  getOrCreateMealPlan,
  getProfileById,
  getSession,
  updateMealItem,
} from '../../data';
import { MealItemForm } from '../../components/MealItemModal/logic';
import { calculateDailyCalories } from '../../utils/nutrition';
import { subscribeMealPlanChange } from '../../utils/mealPlanEvents';

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  unit: string;
};

type MealItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  type: string;
  servings: number;
  servingUnit: string;
  baseAmount: number;
  baseUnit: string;
};

type MealSection = {
  id: string;
  title: string;
  mealType: string;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  items: MealItem[];
};

export const usePlanLogic = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [planId, setPlanId] = useState<string | null>(null);
  const [items, setItems] = useState<MealItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MealItem | null>(null);
  const [modalMealType, setModalMealType] = useState('breakfast');
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);

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
      const plan = await getOrCreateMealPlan(selectedDate);
      if (!plan) {
        if (isActive) {
          setPlanId(null);
          setItems([]);
        }
        return;
      }
      const mealItems = await getMealItemsForPlan(plan.id);
      if (isActive) {
        setPlanId(plan.id);
        setItems(
          mealItems.map(item => ({
            id: item.id,
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            mealType: item.meal_type,
            type: item.type,
            servings: item.servings,
            servingUnit: item.serving_unit ?? 'g',
            baseAmount: item.base_amount ?? 0,
            baseUnit: item.base_unit ?? 'g',
          })),
        );
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  useEffect(() => {
    let isActive = true;
    const loadProfile = async () => {
      const session = await getSession();
      if (!session.profileId) {
        return;
      }
      const profile = await getProfileById(session.profileId);
      if (!profile || !isActive) {
        return;
      }
      const result = calculateDailyCalories({
        weightKg: profile.weight_kg ?? undefined,
        heightCm: profile.height_cm ?? undefined,
        age: profile.age ?? undefined,
        sex: (profile.sex as 'male' | 'female' | 'na' | null) ?? undefined,
        activityLevel: profile.activity_level ?? undefined,
        goalText: profile.goal ?? undefined,
      });
      setCalorieGoal(result?.target ?? null);
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [items]);

  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'calories',
        label: 'Calories',
        value: `${totals.calories}`,
        unit: 'kcal',
      },
      {
        id: 'protein',
        label: 'Protein',
        value: `${totals.protein}`,
        unit: 'g',
      },
      { id: 'carbs', label: 'Carbs', value: `${totals.carbs}`, unit: 'g' },
      { id: 'fat', label: 'Fat', value: `${totals.fat}`, unit: 'g' },
    ],
    [totals],
  );

  const macroBreakdown = useMemo(() => {
    const totalGrams = totals.protein + totals.carbs + totals.fat;
    if (!totalGrams) {
      return [
        { id: 'protein', label: 'Protein', value: totals.protein, percent: 0 },
        { id: 'carbs', label: 'Carbs', value: totals.carbs, percent: 0 },
        { id: 'fat', label: 'Fat', value: totals.fat, percent: 0 },
      ];
    }

    return [
      {
        id: 'protein',
        label: 'Protein',
        value: totals.protein,
        percent: totals.protein / totalGrams,
      },
      {
        id: 'carbs',
        label: 'Carbs',
        value: totals.carbs,
        percent: totals.carbs / totalGrams,
      },
      {
        id: 'fat',
        label: 'Fat',
        value: totals.fat,
        percent: totals.fat / totalGrams,
      },
    ];
  }, [totals]);

  const sections = useMemo<MealSection[]>(
    () => [
      {
        id: 'breakfast',
        title: 'Breakfast',
        mealType: 'breakfast',
        totalCalories: 0,
        totalMacros: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        items: [],
      },
      {
        id: 'lunch',
        title: 'Lunch',
        mealType: 'lunch',
        totalCalories: 0,
        totalMacros: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        items: [],
      },
      {
        id: 'dinner',
        title: 'Dinner',
        mealType: 'dinner',
        totalCalories: 0,
        totalMacros: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        items: [],
      },
      {
        id: 'snacks',
        title: 'Snacks',
        mealType: 'snack',
        totalCalories: 0,
        totalMacros: {
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        items: [],
      },
    ],
    [],
  );

  const sectionsWithItems = useMemo(() => {
    return sections.map(section => {
      const sectionItems = items.filter(
        item => item.mealType === section.mealType,
      );
      const totalCalories = sectionItems.reduce(
        (sum, item) => sum + item.calories,
        0,
      );
      const totalMacros = sectionItems.reduce(
        (acc, item) => ({
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { protein: 0, carbs: 0, fat: 0 },
      );

      return {
        ...section,
        items: sectionItems,
        totalCalories,
        totalMacros,
      };
    });
  }, [items, sections]);

  const refreshItems = useCallback(async () => {
    if (!planId) {
      return;
    }

    const mealItems = await getMealItemsForPlan(planId);
    setItems(
      mealItems.map(item => ({
        id: item.id,
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        mealType: item.meal_type,
        type: item.type,
        servings: item.servings,
        servingUnit: item.serving_unit ?? 'g',
        baseAmount: item.base_amount ?? 0,
        baseUnit: item.base_unit ?? 'g',
      })),
    );
  }, [planId]);

  useEffect(() => {
    if (!planId) {
      return;
    }

    return subscribeMealPlanChange(() => {
      refreshItems();
    });
  }, [planId, refreshItems]);

  const openAddModal = (mealType: string) => {
    setEditingItem(null);
    setModalMealType(mealType);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MealItem) => {
    setEditingItem(item);
    setModalMealType(item.mealType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const initialFormValues = useMemo(() => {
    if (editingItem) {
      return {
        name: editingItem.name,
        calories: String(editingItem.calories),
        protein: String(editingItem.protein),
        carbs: String(editingItem.carbs),
        fat: String(editingItem.fat),
        servings: String(editingItem.servings),
        servingUnit: editingItem.servingUnit ?? 'g',
        mealType: editingItem.mealType,
        itemType: editingItem.type ?? 'manual',
        servingSizeG: editingItem.baseAmount
          ? String(editingItem.baseAmount)
          : '',
        baseAmount: editingItem.baseAmount
          ? String(editingItem.baseAmount)
          : '0',
        baseUnit: editingItem.baseUnit ?? 'g',
      };
    }

    return {
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servings: '1',
      servingUnit: 'g',
      mealType: modalMealType,
      itemType: 'manual',
      servingSizeG: '',
      baseAmount: '0',
      baseUnit: 'g',
    };
  }, [editingItem, modalMealType]);

  const handleSave = async (values: MealItemForm) => {
    if (!planId) {
      return;
    }

    const payload = {
      mealType: values.mealType,
      type: values.itemType || 'manual',
      name: values.name.trim(),
      calories: Number.parseFloat(values.calories) || 0,
      protein: Number.parseFloat(values.protein) || 0,
      carbs: Number.parseFloat(values.carbs) || 0,
      fat: Number.parseFloat(values.fat) || 0,
      servings: Number.parseFloat(values.servings) || 1,
      servingUnit: values.servingUnit || 'g',
      baseAmount: Number.parseFloat(values.baseAmount || '0') || 0,
      baseUnit: values.baseUnit || 'g',
    };

    if (editingItem) {
      await updateMealItem({
        id: editingItem.id,
        ...payload,
      });
    } else {
      await addMealItem({
        planId,
        ...payload,
      });
    }

    await refreshItems();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteMealItem(id);
    await refreshItems();
  };

  const shiftDate = (direction: 'prev' | 'next') => {
    setSelectedDate(current => {
      const next = new Date(current);
      next.setDate(current.getDate() + (direction === 'prev' ? -1 : 1));
      return next;
    });
  };

  return {
    dateLabel,
    summary,
    macroBreakdown,
    sections: sectionsWithItems,
    shiftDate,
    isModalOpen,
    editingItem,
    modalMealType,
    initialFormValues,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    calorieGoal,
  } as const;
};
