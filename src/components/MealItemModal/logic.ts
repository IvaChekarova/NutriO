import { useEffect, useMemo, useRef, useState } from 'react';

import { addCustomFood, getCustomFoods } from '../../data';
import { FoodSearchResult, searchFoods } from '../../data/usda/client';

export type MealItemForm = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servings: string;
  servingUnit: string;
  mealType: string;
  itemType: string;
  servingSizeG: string;
  baseAmount: string;
  baseUnit: string;
};

export type MealItemModalProps = {
  visible: boolean;
  initialValues: MealItemForm;
  onClose: () => void;
  onSave: (values: MealItemForm) => void;
  showMealSelector?: boolean;
};

export const useMealItemModal = ({
  visible,
  initialValues,
  onSave,
}: MealItemModalProps) => {
  const [form, setForm] = useState<MealItemForm>(initialValues);
  const [touched, setTouched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchAbortRef = useRef<AbortController | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState<MealItemForm>(initialValues);
  const [customTouched, setCustomTouched] = useState(false);
  const [saveToLibrary, setSaveToLibrary] = useState(false);
  const [baseNutrition, setBaseNutrition] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    baseAmount: number;
    baseUnit: string;
    hasServing: boolean;
    servingLabel: string;
  } | null>(null);

  const normalizeUnit = (unit: string) => {
    if (!unit || unit === 'serving') {
      return 'g';
    }

    return unit;
  };

  const normalizeUsdaUnit = (unit: string | undefined) => {
    const normalized = (unit || '').toLowerCase();
    if (normalized.includes('ml')) return 'ml';
    if (normalized.includes('g')) return 'g';
    if (normalized.includes('cup')) return 'cup';
    return 'serving';
  };

  const cupToMilliliters = (amount: number) => amount * 240;

  const toMilliliters = (amount: number, unit: string) => {
    if (unit === 'ml') return amount;
    if (unit === 'g') return amount;
    if (unit === 'cup') return cupToMilliliters(amount);
    return null;
  };

  const computeScaledNutrition = (amount: number, unit: string) => {
    if (!baseNutrition) {
      return null;
    }

    if (unit === 'serving') {
      return amount;
    }

    if (baseNutrition.hasServing) {
      const baseMl = toMilliliters(baseNutrition.baseAmount, baseNutrition.baseUnit);
      const nextMl = toMilliliters(amount, unit);
      if (baseMl === null || nextMl === null || baseMl === 0) {
        return null;
      }

      return nextMl / baseMl;
    }

    const nextMl = toMilliliters(amount, unit);
    if (nextMl === null || baseNutrition.baseAmount === 0) {
      return null;
    }

    return nextMl / baseNutrition.baseAmount;
  };

  useEffect(() => {
    if (visible) {
      setForm({
        ...initialValues,
        servingUnit: normalizeUnit(initialValues.servingUnit),
        itemType: initialValues.itemType || 'manual',
        servingSizeG: initialValues.servingSizeG ? String(initialValues.servingSizeG) : '',
        baseAmount: initialValues.baseAmount ? String(initialValues.baseAmount) : '0',
        baseUnit: initialValues.baseUnit || 'g',
      });
      setTouched(false);
      setSearchQuery('');
      setResults([]);
      setSearchError('');
      setIsCustomModalOpen(false);
      setCustomForm({
        ...initialValues,
        servingUnit: normalizeUnit(initialValues.servingUnit),
        itemType: initialValues.itemType || 'manual',
        servingSizeG: initialValues.servingSizeG ? String(initialValues.servingSizeG) : '',
        baseAmount: initialValues.baseAmount ? String(initialValues.baseAmount) : '0',
        baseUnit: initialValues.baseUnit || 'g',
      });
      setCustomTouched(false);
      setSaveToLibrary(false);
      if (initialValues.itemType === 'usda' || initialValues.itemType === 'custom') {
        const amount = Number.parseFloat(initialValues.servings || '1') || 1;
        const baseUnit = initialValues.baseUnit || initialValues.servingUnit || 'g';
        const calories = Number.parseFloat(initialValues.calories || '0') || 0;
        const protein = Number.parseFloat(initialValues.protein || '0') || 0;
        const carbs = Number.parseFloat(initialValues.carbs || '0') || 0;
        const fat = Number.parseFloat(initialValues.fat || '0') || 0;
        const baseAmount = Number.parseFloat(initialValues.baseAmount || '0') || amount;
        const hasServing = baseUnit === 'serving';
        const servingLabel = hasServing
          ? 'Per serving'
          : `Per ${baseAmount} ${baseUnit}`;

        setBaseNutrition({
          calories,
          protein,
          carbs,
          fat,
          baseAmount,
          baseUnit,
          hasServing,
          servingLabel,
        });
      } else {
        setBaseNutrition(null);
      }
    }
  }, [initialValues, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearchError('');
      return;
    }

    const timeout = setTimeout(() => {
      setIsSearching(true);
      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      Promise.all([getCustomFoods(trimmed), searchFoods(trimmed, { signal: controller.signal })])
        .then(([customFoods, usdaFoods]) => {
          const mappedCustom = customFoods.map(food => ({
            id: Number(food.id.replace(/\D/g, '')) || Date.now(),
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            servingSize: food.serving_size_g,
            servingSizeUnit: 'g',
            source: 'custom' as const,
          }));

          setResults([...mappedCustom, ...usdaFoods]);
          setSearchError('');
        })
        .catch(error => {
          if (error?.name === 'AbortError') {
            return;
          }
          setResults([]);
          setSearchError('Food search unavailable right now.');
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 200);

    return () => {
      clearTimeout(timeout);
      searchAbortRef.current?.abort();
    };
  }, [searchQuery, visible]);

  const setField = (key: keyof MealItemForm, value: string) => {
    setTouched(true);
    setForm(current => {
      const next = { ...current, [key]: value };
      if (next.itemType !== 'manual' && baseNutrition && (key === 'servings' || key === 'servingUnit')) {
        const amount = Number.parseFloat(next.servings || '0');
        const factor = computeScaledNutrition(amount, next.servingUnit);
        if (factor) {
          return {
            ...next,
            calories: (baseNutrition.calories * factor).toFixed(0),
            protein: (baseNutrition.protein * factor).toFixed(1),
            carbs: (baseNutrition.carbs * factor).toFixed(1),
            fat: (baseNutrition.fat * factor).toFixed(1),
          };
        }
      }
      return next;
    });
  };

  const errors = useMemo(() => {
    const nameError = !form.name.trim() ? 'Name is required.' : '';
    const caloriesValue = Number.parseFloat(form.calories || '0');
    const caloriesError = Number.isNaN(caloriesValue) || caloriesValue < 0
      ? 'Calories must be 0 or more.'
      : '';

    return { nameError, caloriesError };
  }, [form.calories, form.name]);

  const customErrors = useMemo(() => {
    const nameError = !customForm.name.trim() ? 'Name is required.' : '';
    const caloriesValue = Number.parseFloat(customForm.calories || '0');
    const caloriesError = Number.isNaN(caloriesValue) || caloriesValue < 0
      ? 'Calories must be 0 or more.'
      : '';

    const servingSizeValue = Number.parseFloat(customForm.servingSizeG || '0');
    const servingSizeError = !servingSizeValue || servingSizeValue <= 0
      ? 'Serving size must be greater than 0 g.'
      : '';

    return { nameError, caloriesError, servingSizeError };
  }, [customForm.calories, customForm.name, customForm.servingSizeG]);

  const canSubmit = useMemo(() => {
    return !errors.nameError && !errors.caloriesError;
  }, [errors]);

  const handleSave = () => {
    if (!canSubmit) {
      setTouched(true);
      return;
    }

    onSave(form);
  };

  const openCustomModal = () => {
    setCustomForm({
      ...form,
      itemType: 'manual',
      servingSizeG: form.servingSizeG || '',
      baseAmount: form.baseAmount || '0',
      baseUnit: form.baseUnit || 'g',
    });
    setCustomTouched(false);
    setSaveToLibrary(false);
    setIsCustomModalOpen(true);
  };

  const closeCustomModal = () => {
    setIsCustomModalOpen(false);
  };

  const setCustomField = (key: keyof MealItemForm, value: string) => {
    setCustomTouched(true);
    setCustomForm(current => ({ ...current, [key]: value }));
  };

  const handleSaveCustom = async () => {
    if (customErrors.nameError || customErrors.caloriesError || customErrors.servingSizeError) {
      setCustomTouched(true);
      return;
    }

    const servingSizeG = Number.parseFloat(customForm.servingSizeG || '0');

    if (saveToLibrary) {
      await addCustomFood({
        name: customForm.name,
        servingSizeG,
        calories: Number.parseFloat(customForm.calories) || 0,
        protein: Number.parseFloat(customForm.protein) || 0,
        carbs: Number.parseFloat(customForm.carbs) || 0,
        fat: Number.parseFloat(customForm.fat) || 0,
      });
    }

    const nextForm = {
      ...form,
      name: customForm.name,
      calories: customForm.calories,
      protein: customForm.protein,
      carbs: customForm.carbs,
      fat: customForm.fat,
      servings: String(servingSizeG),
      servingUnit: 'g',
      itemType: 'custom',
      servingSizeG: customForm.servingSizeG,
      baseAmount: customForm.servingSizeG,
      baseUnit: 'g',
    };

    setForm(nextForm);
    setTouched(true);
    setIsCustomModalOpen(false);
    setBaseNutrition({
      calories: Number.parseFloat(customForm.calories) || 0,
      protein: Number.parseFloat(customForm.protein) || 0,
      carbs: Number.parseFloat(customForm.carbs) || 0,
      fat: Number.parseFloat(customForm.fat) || 0,
      baseAmount: servingSizeG,
      baseUnit: 'g',
      hasServing: false,
      servingLabel: `Per ${servingSizeG} g`,
    });

    onSave(nextForm);
  };

  const handleSelectFood = (food: FoodSearchResult) => {
    if (food.source === 'custom') {
      const baseAmount = Number(food.servingSize) || 100;
      setBaseNutrition({
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        baseAmount,
        baseUnit: 'g',
        hasServing: false,
        servingLabel: `Per ${baseAmount} g`,
      });

      setForm(current => ({
        ...current,
        name: food.name,
        calories: food.calories ? Math.round(food.calories).toString() : current.calories,
        protein: food.protein ? food.protein.toFixed(1) : current.protein,
        carbs: food.carbs ? food.carbs.toFixed(1) : current.carbs,
        fat: food.fat ? food.fat.toFixed(1) : current.fat,
        servings: baseAmount.toString(),
        servingUnit: 'g',
        itemType: 'custom',
        servingSizeG: baseAmount.toString(),
        baseAmount: baseAmount.toString(),
        baseUnit: 'g',
      }));
      setTouched(true);
      setSearchQuery('');
      setResults([]);
      return;
    }

    const hasServing = Boolean(food.servingSize && food.servingSizeUnit);
    const baseUnit = hasServing ? normalizeUsdaUnit(food.servingSizeUnit) : 'g';
    const baseAmount = hasServing ? Number(food.servingSize) || 1 : 100;
    const servingLabel = hasServing
      ? `1 serving = ${food.servingSize} ${baseUnit}`
      : 'Per 100 g';

    setBaseNutrition({
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      baseAmount,
      baseUnit,
      hasServing,
      servingLabel,
    });

    setForm(current => ({
      ...current,
      name: food.name,
      calories: food.calories ? Math.round(food.calories).toString() : current.calories,
      protein: food.protein ? food.protein.toFixed(1) : current.protein,
      carbs: food.carbs ? food.carbs.toFixed(1) : current.carbs,
      fat: food.fat ? food.fat.toFixed(1) : current.fat,
      servings: '1',
      servingUnit: 'serving',
      itemType: 'usda',
      servingSizeG: hasServing ? '' : '100',
      baseAmount: baseAmount.toString(),
      baseUnit,
    }));
    setTouched(true);
    setSearchQuery('');
    setResults([]);
  };

  return {
    form,
    setField,
    errors,
    canSubmit,
    handleSave,
    touched,
    searchQuery,
    setSearchQuery,
    results,
    isSearching,
    searchError,
    handleSelectFood,
    isCustomModalOpen,
    customForm,
    customTouched,
    customErrors,
    setCustomField,
    openCustomModal,
    closeCustomModal,
    handleSaveCustom,
    baseNutrition,
    saveToLibrary,
    setSaveToLibrary,
  };
};
