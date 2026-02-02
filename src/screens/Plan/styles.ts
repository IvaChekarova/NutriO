import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 6,
    },
    header: {
      marginTop: 12,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerActions: {
      alignItems: 'flex-end',
      gap: 8,
    },
    dateNav: {
      flexDirection: 'row',
      gap: 10,
    },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
    navButtonText: {
      fontSize: 16,
      color: theme.colors.textPrimary,
    },
    resetButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
    },
    resetButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    summaryRingRow: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
    },
    legend: {
      flex: 1,
      gap: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
    },
    legendLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
    },
    legendValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    addButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    addButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    mealCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    mealTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    mealTotal: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '700',
      marginTop: 2,
    },
    macroChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 6,
    },
    macroChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.background,
    },
    macroDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
    macroChipText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    mealItems: {
      gap: 10,
    },
    mealItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mealItemName: {
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    mealItemCalories: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    swipeAction: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      alignSelf: 'stretch',
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    swipeActionText: {
      color: '#C44536',
      fontSize: 13,
      fontWeight: '700',
    },
    mealAddRow: {
      marginTop: 12,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: theme.colors.background,
    },
    mealAddText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });
