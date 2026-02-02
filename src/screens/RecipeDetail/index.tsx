/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { useTheme } from '../../theme';
import { useRecipeDetailLogic } from './logic';
import { createStyles } from './styles';
import { RecipesStackParamList } from '../../navigation/RecipesNavigator';
import { addRecipeToMealPlan } from '../../data';
import { emitMealPlanChange } from '../../utils/mealPlanEvents';

type RecipeDetailRoute = RouteProp<RecipesStackParamList, 'RecipeDetail'>;

const imageOverrides = [
  {
    keys: ['chicken'],
    url: 'https://images.unsplash.com/photo-1604908811697-4a96c4d8d34a?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['salmon', 'fish'],
    url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['tofu', 'vegan'],
    url: 'https://images.unsplash.com/photo-1505576633757-0ac1084af824?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['salad', 'bowl'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['egg', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['shrimp'],
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
];

const resolveRecipeImage = (title: string, fallback?: string) => {
  const lower = title.toLowerCase();
  const match = imageOverrides.find(item =>
    item.keys.some(key => lower.includes(key)),
  );

  return match?.url || fallback || '';
};

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

const DATE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'custom', label: 'Pick date' },
];

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const RecipeDetailScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RecipeDetailRoute>();
  const { recipe } = useRecipeDetailLogic(route.params.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealType, setMealType] = useState('lunch');
  const [dateChoice, setDateChoice] = useState('today');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const selectedDate = useMemo(() => {
    if (dateChoice === 'today') {
      return new Date();
    }

    if (dateChoice === 'tomorrow') {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }

    return customDate;
  }, [customDate, dateChoice]);

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      setCustomDate(date);
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20, color: theme.colors.textSecondary }}>
          Loading recipe...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {resolveRecipeImage(recipe.title, recipe.imageUrl) ? (
          <Image
            source={{ uri: resolveRecipeImage(recipe.title, recipe.imageUrl) }}
            style={styles.heroImage}
          />
        ) : null}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>
                  {recipe.prepTime + recipe.cookTime} min total
                </Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{recipe.difficulty}</Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>
                  {Math.round(
                    recipe.totalCalories / Math.max(recipe.servings, 1),
                  )}{' '}
                  kcal/serving
                </Text>
              </View>
            </View>

            {recipe.dietTags.length > 0 ? (
              <View style={styles.tagRow}>
                {recipe.dietTags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Pressable
              style={styles.addButton}
              onPress={() => setIsModalOpen(true)}
            >
              <Text style={styles.addButtonText}>Add to meal plan</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map(ingredient => (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>
                  {ingredient.quantity} {ingredient.unit}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {recipe.steps.map(step => (
              <View key={step.id} style={styles.stepCard}>
                <Text style={styles.stepLabel}>Step {step.stepNumber}</Text>
                <Text style={styles.stepText}>{step.instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setIsModalOpen(false)}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add to meal plan</Text>

            <Text style={styles.modalLabel}>Meal</Text>
            <View style={styles.modalTabs}>
              {MEAL_TYPES.map(type => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.modalTab,
                    mealType === type.id && styles.modalTabActive,
                  ]}
                  onPress={() => setMealType(type.id)}
                >
                  <Text
                    style={[
                      styles.modalTabText,
                      mealType === type.id && styles.modalTabTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalLabel}>Date</Text>
            <View style={styles.modalTabs}>
              {DATE_OPTIONS.map(option => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.modalTab,
                    dateChoice === option.id && styles.modalTabActive,
                  ]}
                  onPress={() => {
                    setDateChoice(option.id);
                    setShowPicker(option.id === 'custom');
                  }}
                >
                  <Text
                    style={[
                      styles.modalTabText,
                      dateChoice === option.id && styles.modalTabTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {dateChoice === 'custom' ? (
              <View style={styles.modalField}>
                <Text style={styles.modalHelper}>Pick a date</Text>
                <Pressable
                  style={styles.modalInput}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.modalInputText}>
                    {customDate ? formatDateLabel(customDate) : 'Select date'}
                  </Text>
                </Pressable>
                {showPicker ? (
                  Platform.OS === 'ios' ? (
                    <View style={styles.datePickerPanel}>
                      <DateTimePicker
                        value={customDate ?? new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        style={styles.datePicker}
                      />
                      <Pressable
                        style={styles.datePickerDone}
                        onPress={() => setShowPicker(false)}
                      >
                        <Text style={styles.datePickerDoneText}>Done</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <DateTimePicker
                      value={customDate ?? new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )
                ) : null}
              </View>
            ) : null}

            {error ? <Text style={styles.modalError}>{error}</Text> : null}

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setIsModalOpen(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextSecondary,
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  if (!selectedDate) {
                    setError('Please enter a valid date.');
                    return;
                  }

                  setError('');
                  await addRecipeToMealPlan({
                    recipeId: recipe.id,
                    date: selectedDate,
                    mealType,
                  });
                  emitMealPlanChange();
                  setIsModalOpen(false);
                }}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
