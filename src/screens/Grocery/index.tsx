import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { useGroceryLogic } from './logic';
import { createStyles } from './styles';

const GroceryScreen = () => {
  const {
    groupedItems,
    isLoading,
    rangeLabel,
    expandedItems,
    collapsedCategories,
    toggleCategory,
    toggleChecked,
    toggleExpanded,
    markInPantry,
    addManualItem,
    rangeOption,
    setRangeOption,
    completeShopping,
  } = useGroceryLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [manualName, setManualName] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const handleAddManual = (value?: string) => {
    const name = (value ?? manualName).trim();
    if (!name) {
      return;
    }
    addManualItem(name);
    setManualName('');
    Alert.alert('Added', 'Successfully added to this week’s shopping list.');
  };
  void theme;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Grocery list for upcoming week</Text>
        <Text style={styles.subtitle}>
          Here you can find personalized grocery lists for planned meal prep for
          the selected week.
        </Text>
        <Text style={styles.rangeValue}>
          {rangeLabel || 'No planned meals for the upcoming week yet.'}
        </Text>

        <View style={styles.rangeControls}>
          <Text style={styles.rangeControlsLabel}>
            📅 Select days to include:
          </Text>
          <View style={styles.rangeChips}>
            <Pressable
              style={[
                styles.rangeChip,
                rangeOption === 'today' && styles.rangeChipActive,
              ]}
              onPress={() => setRangeOption('today')}
            >
              <Text
                style={[
                  styles.rangeChipText,
                  rangeOption === 'today' && styles.rangeChipTextActive,
                ]}
              >
                Today
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.rangeChip,
                rangeOption === 'next3' && styles.rangeChipActive,
              ]}
              onPress={() => setRangeOption('next3')}
            >
              <Text
                style={[
                  styles.rangeChipText,
                  rangeOption === 'next3' && styles.rangeChipTextActive,
                ]}
              >
                Next 3 days
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.rangeChip,
                rangeOption === 'week' && styles.rangeChipActive,
              ]}
              onPress={() => setRangeOption('week')}
            >
              <Text
                style={[
                  styles.rangeChipText,
                  rangeOption === 'week' && styles.rangeChipTextActive,
                ]}
              >
                Full week
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            groupedItems.length === 0 && styles.primaryButtonDisabled,
          ]}
          disabled={groupedItems.length === 0}
          onPress={() => {
            Alert.alert(
              'Complete shopping?',
              'This list will be marked as completed.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: completeShopping },
              ],
            );
          }}
        >
          <Text
            style={[
              styles.primaryButtonText,
              groupedItems.length === 0 && styles.primaryButtonTextDisabled,
            ]}
          >
            ✔️ Complete shopping
          </Text>
        </Pressable>

        <View style={styles.manualCard}>
          <Text style={styles.manualTitle}>Add custom item</Text>
          <View style={styles.manualRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="e.g. Coffee, Protein bars"
              placeholderTextColor={theme.colors.textSecondary}
              value={manualName}
              onChangeText={setManualName}
              onSubmitEditing={() => handleAddManual()}
              returnKeyType="done"
            />
            <Pressable
              style={styles.manualButton}
              onPress={() => handleAddManual()}
            >
              <Text style={styles.manualButtonText}>Add</Text>
            </Pressable>
          </View>
          <View style={styles.suggestionRow}>
            {['Eggs', 'Bananas', 'Oat milk'].map(suggestion => (
              <Pressable
                key={suggestion}
                style={styles.suggestionChip}
                onPress={() => handleAddManual(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.loadingText}>Building your list...</Text>
          </View>
        ) : groupedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No groceries yet</Text>
            <Text style={styles.emptyText}>
              Add meals to your plan to see your auto-generated list.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {groupedItems.map(group => {
              const isCollapsed = collapsedCategories.has(group.id);
              return (
                <View key={group.id} style={styles.groupCard}>
                  <Pressable
                    style={styles.groupHeader}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      toggleCategory(group.id);
                    }}
                  >
                    <View style={styles.groupHeaderLeft}>
                      <Text style={styles.groupTitle}>{group.label}</Text>
                      {isCollapsed ? (
                        <View
                          style={[
                            styles.groupCount,
                            group.items.length > 0 &&
                            group.items.every(item => item.checked)
                              ? styles.groupCountComplete
                              : styles.groupCountIncomplete,
                          ]}
                        >
                          <Text style={styles.groupCountText}>
                            {group.items.filter(item => item.checked).length}/
                            {group.items.length}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.groupToggle}>
                      {isCollapsed ? '+' : '-'}
                    </Text>
                  </Pressable>
                  {isCollapsed
                    ? null
                    : group.items.map(item => {
                        const isExpanded = expandedItems.has(item.id);
                        const hasUsages = item.usages.length > 0;
                        return (
                          <View
                            key={item.id}
                            style={[
                              styles.itemRow,
                              item.checked && styles.itemRowChecked,
                              item.inPantry && styles.itemRowPantry,
                            ]}
                          >
                            <Pressable
                              style={[
                                styles.checkbox,
                                item.checked && styles.checkboxChecked,
                              ]}
                              onPress={() => toggleChecked(item.id)}
                            >
                              <Text style={styles.checkboxText}>
                                {item.checked ? '✓' : ''}
                              </Text>
                            </Pressable>
                            <View style={styles.itemInfo}>
                              <View style={styles.itemHeader}>
                                <Text
                                  style={[
                                    styles.itemName,
                                    item.checked && styles.itemNameChecked,
                                  ]}
                                >
                                  {item.name}
                                </Text>
                                {!hasUsages ? (
                                  <Text style={styles.customTag}>Custom</Text>
                                ) : null}
                                {item.inPantry ? (
                                  <Text style={styles.pantryTag}>
                                    In pantry
                                  </Text>
                                ) : null}
                              </View>
                              <Text style={styles.itemAmount}>
                                {item.amountLabel}
                              </Text>
                              {hasUsages ? (
                                <>
                                  <Pressable
                                    style={styles.usageToggle}
                                    onPress={() => toggleExpanded(item.id)}
                                  >
                                    <Text style={styles.usageToggleText}>
                                      Used in {item.usages.length} meal
                                      {item.usages.length === 1 ? '' : 's'}
                                    </Text>
                                    <Text style={styles.usageToggleText}>
                                      {isExpanded ? '▲' : '▼'}
                                    </Text>
                                  </Pressable>
                                  {isExpanded ? (
                                    <View style={styles.usageList}>
                                      {item.usages.map((usage, index) => (
                                        <Text
                                          key={`${item.id}_usage_${index}`}
                                          style={styles.usageText}
                                        >
                                          • {usage.label}
                                        </Text>
                                      ))}
                                    </View>
                                  ) : null}
                                </>
                              ) : null}
                            </View>
                            <Pressable
                              style={styles.pantryButton}
                              onPress={() => markInPantry(item.id)}
                            >
                              <Text style={styles.pantryButtonText}>Have</Text>
                            </Pressable>
                          </View>
                        );
                      })}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroceryScreen;
