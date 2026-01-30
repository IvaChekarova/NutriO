import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { usePlanLogic } from './logic';
import { createStyles } from './styles';
import MealItemModal from '../../components/MealItemModal';

const PlanScreen = () => {
  const {
    dateLabel,
    summary,
    sections,
    shiftDate,
    isModalOpen,
    initialFormValues,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
  } = usePlanLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal plan</Text>
            <Text style={styles.subtitle}>{dateLabel}</Text>
          </View>
          <View style={styles.dateNav}>
            <Pressable style={styles.navButton} onPress={() => shiftDate('prev')}>
              <Text style={styles.navButtonText}>{'<'}</Text>
            </Pressable>
            <Pressable style={styles.navButton} onPress={() => shiftDate('next')}>
              <Text style={styles.navButtonText}>{'>'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Daily summary</Text>
          <View style={styles.summaryGrid}>
            {summary.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryUnit}>{item.unit}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Meals</Text>
          <Pressable style={styles.addButton} onPress={() => openAddModal('breakfast')}>
            <Text style={styles.addButtonText}>Add meal</Text>
          </Pressable>
        </View>

        {sections.map(section => (
          <View key={section.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>{section.title}</Text>
              <Text style={styles.mealTotal}>
                {section.totalCalories} kcal
              </Text>
            </View>
            <View style={styles.mealItems}>
              {section.items.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.mealItemRow}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.mealItemName}>{item.name}</Text>
                  <Text style={styles.mealItemCalories}>
                    {item.calories} kcal
                  </Text>
                </Pressable>
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
      />
    </SafeAreaView>
  );
};

export default PlanScreen;
