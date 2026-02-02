import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 32,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    rangeValue: {
      marginTop: 12,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    rangeControls: {
      marginTop: 16,
      gap: 10,
    },
    rangeControlsLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    rangeChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    rangeChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
    },
    rangeChipActive: {
      backgroundColor: theme.colors.primary,
    },
    rangeChipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    rangeChipTextActive: {
      color: '#FFFFFF',
    },
    manualCard: {
      marginTop: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 12,
      gap: 10,
    },
    manualTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    manualRow: {
      flexDirection: 'row',
      gap: 10,
    },
    manualInput: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    manualButton: {
      paddingHorizontal: 14,
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    manualButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 12,
    },
    suggestionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    suggestionChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: theme.colors.background,
    },
    suggestionText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    controls: {
      marginTop: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    controlChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
    },
    controlChipActive: {
      backgroundColor: theme.colors.primary,
    },
    controlChipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    controlChipTextActive: {
      color: '#FFFFFF',
    },
    primaryButton: {
      marginTop: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
    },
    primaryButtonDisabled: {
      backgroundColor: theme.colors.surface,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
    primaryButtonTextDisabled: {
      color: theme.colors.textSecondary,
    },
    loading: {
      marginTop: 24,
      alignItems: 'center',
      gap: 8,
    },
    loadingText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    list: {
      marginTop: 16,
      gap: 14,
    },
    groupCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 12,
      gap: 10,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    groupHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    groupTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    groupCount: {
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    groupCountComplete: {
      backgroundColor: '#2E7D32',
    },
    groupCountIncomplete: {
      backgroundColor: '#C44536',
    },
    groupCountText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    groupToggle: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    itemRowChecked: {
      opacity: 0.5,
    },
    itemRowPantry: {
      opacity: 0.7,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    checkboxText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    itemInfo: {
      flex: 1,
      gap: 4,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    customTag: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    itemNameChecked: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    pantryTag: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    itemAmount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    usageToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    usageToggleText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    usageList: {
      marginTop: 6,
      gap: 4,
    },
    usageText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    pantryButton: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    pantryButtonText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
  });
