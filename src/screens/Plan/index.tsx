import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '../../theme';
import { usePlanLogic } from './logic';
import { createStyles } from './styles';
import MealItemModal from '../../components/MealItemModal';
import MacroRing from '../../components/MacroRing';

const PlanScreen = () => {
  const {
    dateLabel,
    summary,
    macroBreakdown,
    sections,
    shiftDate,
    isModalOpen,
    editingItem,
    initialFormValues,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    calorieGoal,
    handleDelete,
  } = usePlanLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const macroColors = {
    protein: '#2E7D32',
    carbs: '#D98B3A',
    fat: '#C44536',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal plan</Text>
            <Text style={styles.subtitle}>{dateLabel}</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.dateNav}>
              <Pressable
                style={styles.navButton}
                onPress={() => shiftDate('prev')}
              >
                <Text style={styles.navButtonText}>{'<'}</Text>
              </Pressable>
              <Pressable
                style={styles.navButton}
                onPress={() => shiftDate('next')}
              >
                <Text style={styles.navButtonText}>{'>'}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Daily summary</Text>
          <View style={styles.summaryRingRow}>
            <MacroRing
              calories={Number(summary[0]?.value || 0)}
              goalCalories={calorieGoal}
              segments={macroBreakdown.map(item => ({
                id: item.id,
                color: macroColors[item.id as keyof typeof macroColors],
                percent: item.percent,
              }))}
              emptyColor={theme.colors.textSecondary}
            />
            <View style={styles.legend}>
              {macroBreakdown.map(item => (
                <View key={item.id} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor:
                          macroColors[item.id as keyof typeof macroColors],
                      },
                    ]}
                  />
                  <View>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>
                      {Math.round(item.value)} g
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Meals</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => openAddModal('breakfast')}
          >
            <Text style={styles.addButtonText}>Add meal</Text>
          </Pressable>
        </View>

        {sections.map(section => (
          <View key={section.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealTitle}>{section.title}</Text>
                <View style={styles.macroChips}>
                  <View style={styles.macroChip}>
                    <View
                      style={[
                        styles.macroDot,
                        { backgroundColor: macroColors.protein },
                      ]}
                    />
                    <Text style={styles.macroChipText}>
                      {Math.round(section.totalMacros.protein)}g P
                    </Text>
                  </View>
                  <View style={styles.macroChip}>
                    <View
                      style={[
                        styles.macroDot,
                        { backgroundColor: macroColors.carbs },
                      ]}
                    />
                    <Text style={styles.macroChipText}>
                      {Math.round(section.totalMacros.carbs)}g C
                    </Text>
                  </View>
                  <View style={styles.macroChip}>
                    <View
                      style={[
                        styles.macroDot,
                        { backgroundColor: macroColors.fat },
                      ]}
                    />
                    <Text style={styles.macroChipText}>
                      {Math.round(section.totalMacros.fat)}g F
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.mealTotal}>{section.totalCalories} kcal</Text>
            </View>
            <View style={styles.mealItems}>
              {section.items.map(item => (
                <Swipeable
                  key={item.id}
                  renderRightActions={() => (
                    <View style={styles.swipeAction}>
                      <Text style={styles.swipeActionText}>Delete</Text>
                    </View>
                  )}
                  onSwipeableOpen={() => handleDelete(item.id)}
                >
                  <Pressable
                    style={styles.mealItemRow}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.mealItemName}>{item.name}</Text>
                    <Text style={styles.mealItemCalories}>
                      {item.calories} kcal
                    </Text>
                  </Pressable>
                </Swipeable>
              ))}
            </View>
            <Pressable
              style={styles.mealAddRow}
              onPress={() => openAddModal(section.mealType)}
            >
              <Text style={styles.mealAddText}>+ Add item</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <MealItemModal
        visible={isModalOpen}
        initialValues={initialFormValues}
        onClose={closeModal}
        onSave={handleSave}
        showMealSelector={Boolean(editingItem)}
      />
    </SafeAreaView>
  );
};

export default PlanScreen;
