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
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
      gap: 12,
    },
    summaryItem: {
      width: '47%',
      padding: 12,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    summaryUnit: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    summaryLabel: {
      marginTop: 6,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
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
      alignItems: 'center',
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
    mealAddRow: {
      marginTop: 12,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
    },
    mealAddText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });
