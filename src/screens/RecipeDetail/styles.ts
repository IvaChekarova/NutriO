import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    heroImage: {
      width: '100%',
      height: 240,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      marginTop: -24,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 18,
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    description: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 14,
    },
    metaPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.background,
    },
    metaText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    tagText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary,
      textTransform: 'uppercase',
    },
    section: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 12,
    },
    addButton: {
      marginTop: 16,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
    ingredientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
    },
    ingredientName: {
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    ingredientAmount: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    stepCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
    },
    stepLabel: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    stepText: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 24,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 14,
    },
    modalLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    modalTabs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },
    modalTab: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: '#FFFFFF',
    },
    modalTabActive: {
      borderColor: theme.colors.primary,
    },
    modalTabText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    modalTabTextActive: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    modalField: {
      marginBottom: 12,
    },
    modalHelper: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    modalInput: {
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: theme.colors.textPrimary,
    },
    modalInputText: {
      fontSize: 15,
      color: theme.colors.textPrimary,
    },
    datePickerPanel: {
      marginTop: 8,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      padding: 8,
    },
    datePicker: {
      height: 190,
    },
    datePickerDone: {
      alignSelf: 'flex-end',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      marginTop: 6,
    },
    datePickerDoneText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 12,
    },
    modalError: {
      color: theme.colors.accent,
      fontSize: 12,
      marginBottom: 10,
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    modalButtonSecondary: {
      backgroundColor: theme.colors.surface,
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    modalButtonTextSecondary: {
      color: theme.colors.textPrimary,
    },
  });
