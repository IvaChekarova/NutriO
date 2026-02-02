/* eslint-disable react-native/no-inline-styles */
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

const SERVING_UNITS = [
  { id: 'g', label: 'g' },
  { id: 'ml', label: 'ml' },
  { id: 'cup', label: 'cup' },
  { id: 'serving', label: 'serving' },
];

const MealItemModal = ({
  visible,
  initialValues,
  onClose,
  onSave,
  showMealSelector = false,
}: MealItemModalProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {
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
  } = useMealItemModal({ visible, initialValues, onClose, onSave });

  const isLockedItem = form.itemType !== 'manual';
  const availableUnits = SERVING_UNITS;

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>Meal item</Text>
            <Pressable
              style={styles.linkButton}
              onPress={openCustomModal}
              hitSlop={8}
            >
              <Text style={styles.linkButtonText}>+ Add your own food</Text>
            </Pressable>

            <ScrollView keyboardShouldPersistTaps="always">
              <View style={styles.field}>
                <Text style={styles.sectionTitle}>Search foods</Text>
                <Text style={styles.label}>Type to search</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Try 'chicken breast'"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                />
                {isSearching ? (
                  <Text style={styles.helper}>Searching…</Text>
                ) : null}
                {!isSearching && searchError ? (
                  <Text style={styles.helper}>{searchError}</Text>
                ) : null}
                {results.length > 0 ? (
                  <ScrollView
                    style={styles.results}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="always"
                  >
                    {results.map(item => (
                      <Pressable
                        key={item.id}
                        style={styles.resultRow}
                        onPress={() => handleSelectFood(item)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.resultName}>{item.name}</Text>
                          {item.source === 'custom' ? (
                            <Text style={styles.resultMeta}>My food</Text>
                          ) : item.brand ? (
                            <Text style={styles.resultMeta}>{item.brand}</Text>
                          ) : null}
                        </View>
                        <Text style={styles.resultMeta}>
                          {Math.round(item.calories)} kcal
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                ) : null}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Food name</Text>
                <TextInput
                  value={form.name}
                  placeholder="Select a food above"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.input, styles.inputDisabled]}
                  editable={false}
                  selectTextOnFocus={false}
                />
                {touched && errors.nameError ? (
                  <Text style={styles.helper}>{errors.nameError}</Text>
                ) : null}
              </View>

              {showMealSelector ? (
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
              ) : null}

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    value={form.calories}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[styles.input, styles.inputDisabled]}
                    keyboardType="number-pad"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Amount</Text>
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

              <View style={styles.field}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.tabs}>
                  {availableUnits.map(unit => (
                    <Pressable
                      key={unit.id}
                      style={[
                        styles.tab,
                        form.servingUnit === unit.id && styles.tabActive,
                      ]}
                      onPress={() => setField('servingUnit', unit.id)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          form.servingUnit === unit.id && styles.tabTextActive,
                        ]}
                      >
                        {unit.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Protein</Text>
                  <TextInput
                    value={form.protein}
                    placeholder="g"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[styles.input, styles.inputDisabled]}
                    keyboardType="decimal-pad"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Carbs</Text>
                  <TextInput
                    value={form.carbs}
                    placeholder="g"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[styles.input, styles.inputDisabled]}
                    keyboardType="decimal-pad"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Fat</Text>
                  <TextInput
                    value={form.fat}
                    placeholder="g"
                    placeholderTextColor={theme.colors.textSecondary}
                    style={[styles.input, styles.inputDisabled]}
                    keyboardType="decimal-pad"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              </View>

              {touched && errors.caloriesError ? (
                <Text style={styles.helper}>{errors.caloriesError}</Text>
              ) : null}
              {isLockedItem && baseNutrition?.servingLabel ? (
                <Text style={styles.helper}>{baseNutrition.servingLabel}</Text>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={[styles.button, styles.buttonSecondary]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, !canSubmit && { opacity: 0.6 }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
            </View>
          </View>
          {isCustomModalOpen ? (
            <View style={styles.customOverlay}>
              <Pressable
                style={styles.customBackdrop}
                onPress={closeCustomModal}
              />
              <View style={styles.customSheet}>
                <Text style={styles.title}>Add your own food</Text>

                <ScrollView keyboardShouldPersistTaps="always">
                  <View style={styles.field}>
                    <Text style={styles.label}>Food name</Text>
                    <TextInput
                      value={customForm.name}
                      onChangeText={value => setCustomField('name', value)}
                      placeholder="e.g. Homemade granola"
                      placeholderTextColor={theme.colors.textSecondary}
                      style={styles.input}
                    />
                    {customTouched && customErrors.nameError ? (
                      <Text style={styles.helper}>
                        {customErrors.nameError}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Serving size (g)</Text>
                    <TextInput
                      value={customForm.servingSizeG}
                      onChangeText={value =>
                        setCustomField('servingSizeG', value)
                      }
                      placeholder="e.g. 100"
                      placeholderTextColor={theme.colors.textSecondary}
                      style={styles.input}
                      keyboardType="decimal-pad"
                    />
                    {customTouched && customErrors.servingSizeError ? (
                      <Text style={styles.helper}>
                        {customErrors.servingSizeError}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>Calories</Text>
                      <TextInput
                        value={customForm.calories}
                        onChangeText={value =>
                          setCustomField('calories', value)
                        }
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>Protein</Text>
                      <TextInput
                        value={customForm.protein}
                        onChangeText={value => setCustomField('protein', value)}
                        placeholder="g"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>Carbs</Text>
                      <TextInput
                        value={customForm.carbs}
                        onChangeText={value => setCustomField('carbs', value)}
                        placeholder="g"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View style={[styles.field, { flex: 1 }]}>
                      <Text style={styles.label}>Fat</Text>
                      <TextInput
                        value={customForm.fat}
                        onChangeText={value => setCustomField('fat', value)}
                        placeholder="g"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={styles.input}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  <Pressable
                    style={styles.checkboxRow}
                    onPress={() => setSaveToLibrary(current => !current)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        saveToLibrary && styles.checkboxChecked,
                      ]}
                    >
                      {saveToLibrary ? (
                        <Text style={styles.checkboxTick}>✓</Text>
                      ) : null}
                    </View>
                    <Text style={styles.checkboxLabel}>Save to My Foods</Text>
                  </Pressable>

                  {customTouched && customErrors.caloriesError ? (
                    <Text style={styles.helper}>
                      {customErrors.caloriesError}
                    </Text>
                  ) : null}
                </ScrollView>

                <View style={styles.footer}>
                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={closeCustomModal}
                  >
                    <Text
                      style={[styles.buttonText, styles.buttonTextSecondary]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable style={styles.button} onPress={handleSaveCustom}>
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
};

export default MealItemModal;
