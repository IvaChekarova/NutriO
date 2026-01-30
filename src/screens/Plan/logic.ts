import { useEffect, useMemo, useState } from 'react';

import { addMealItem, getMealItemsForPlan, getOrCreateMealPlan, updateMealItem } from '../../data';
import { MealItemForm } from '../../components/MealItemModal/logic';

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
  servings: number;
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
            servings: item.servings,
          })),
        );
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

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
      { id: 'calories', label: 'Calories', value: `${totals.calories}`, unit: 'kcal' },
      { id: 'protein', label: 'Protein', value: `${totals.protein}`, unit: 'g' },
      { id: 'carbs', label: 'Carbs', value: `${totals.carbs}`, unit: 'g' },
      { id: 'fat', label: 'Fat', value: `${totals.fat}`, unit: 'g' },
    ],
    [totals],
  );

  const sections = useMemo<MealSection[]>(
    () => [
      {
        id: 'breakfast',
        title: 'Breakfast',
        mealType: 'breakfast',
      },
      {
        id: 'lunch',
        title: 'Lunch',
        mealType: 'lunch',
      },
      {
        id: 'dinner',
        title: 'Dinner',
        mealType: 'dinner',
      },
      {
        id: 'snacks',
        title: 'Snacks',
        mealType: 'snack',
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

  const refreshItems = async () => {
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
        servings: item.servings,
      })),
    );
  };

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
        mealType: editingItem.mealType,
      };
    }

    return {
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servings: '1',
      mealType: modalMealType,
    };
  }, [editingItem, modalMealType]);

  const handleSave = async (values: MealItemForm) => {
    if (!planId) {
      return;
    }

    const payload = {
      mealType: values.mealType,
      name: values.name.trim(),
      calories: Number.parseFloat(values.calories) || 0,
      protein: Number.parseFloat(values.protein) || 0,
      carbs: Number.parseFloat(values.carbs) || 0,
      fat: Number.parseFloat(values.fat) || 0,
      servings: Number.parseFloat(values.servings) || 1,
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
  } as const;
};
