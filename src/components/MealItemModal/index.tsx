import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../../theme';
import { MealItemModalProps, useMealItemModal } from './logic';
import { createStyles } from './styles';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

const MealItemModal = ({ visible, initialValues, onClose, onSave }: MealItemModalProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {
    form,
    setField,
    errors,
    canSubmit,
    handleSave,
    touched,
  } = useMealItemModal({ visible, initialValues, onClose, onSave });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Meal item</Text>

          <ScrollView>
            <View style={styles.field}>
              <Text style={styles.label}>Meal</Text>
              <View style={styles.tabs}>
                {MEAL_TYPES.map(type => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.tab,
                      form.mealType === type.id && styles.tabActive,
                    ]}
                    onPress={() => setField('mealType', type.id)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        form.mealType === type.id && styles.tabTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={form.name}
                onChangeText={value => setField('name', value)}
                placeholder="e.g. Avocado toast"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
              />
              {touched && errors.nameError ? (
                <Text style={styles.helper}>{errors.nameError}</Text>
              ) : null}
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  value={form.calories}
                  onChangeText={value => setField('calories', value)}
                  placeholder="0"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Servings</Text>
                <TextInput
                  value={form.servings}
                  onChangeText={value => setField('servings', value)}
                  placeholder="1"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Protein</Text>
                <TextInput
                  value={form.protein}
                  onChangeText={value => setField('protein', value)}
                  placeholder="g"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Carbs</Text>
                <TextInput
                  value={form.carbs}
                  onChangeText={value => setField('carbs', value)}
                  placeholder="g"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Fat</Text>
                <TextInput
                  value={form.fat}
                  onChangeText={value => setField('fat', value)}
                  placeholder="g"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {touched && errors.caloriesError ? (
              <Text style={styles.helper}>{errors.caloriesError}</Text>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, !canSubmit && { opacity: 0.6 }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MealItemModal;
