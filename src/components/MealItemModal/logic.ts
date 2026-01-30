import { useEffect, useMemo, useState } from 'react';

export type MealItemForm = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servings: string;
  mealType: string;
};

export type MealItemModalProps = {
  visible: boolean;
  initialValues: MealItemForm;
  onClose: () => void;
  onSave: (values: MealItemForm) => void;
};

export const useMealItemModal = ({
  visible,
  initialValues,
  onSave,
}: MealItemModalProps) => {
  const [form, setForm] = useState<MealItemForm>(initialValues);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(initialValues);
      setTouched(false);
    }
  }, [initialValues, visible]);

  const setField = (key: keyof MealItemForm, value: string) => {
    setTouched(true);
    setForm(current => ({ ...current, [key]: value }));
  };

  const errors = useMemo(() => {
    const nameError = !form.name.trim() ? 'Name is required.' : '';
    const caloriesValue = Number.parseFloat(form.calories || '0');
    const caloriesError = Number.isNaN(caloriesValue) || caloriesValue < 0
      ? 'Calories must be 0 or more.'
      : '';

    return { nameError, caloriesError };
  }, [form.calories, form.name]);

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

  return {
    form,
    setField,
    errors,
    canSubmit,
    handleSave,
    touched,
  };
};
