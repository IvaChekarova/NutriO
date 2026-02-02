import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 24,
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 999,
      backgroundColor: theme.colors.textSecondary,
      alignSelf: 'center',
      opacity: 0.4,
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    field: {
      marginBottom: 14,
    },
    label: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    customButton: {
      marginBottom: 14,
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: '#FFFFFF',
    },
    customButtonText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    input: {
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: theme.colors.textPrimary,
    },
    inputDisabled: {
      opacity: 0.6,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    checkboxTick: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    checkboxLabel: {
      fontSize: 13,
      color: theme.colors.textPrimary,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    inputSmall: {
      flex: 1,
      textAlign: 'center',
    },
    tabs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tab: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: '#FFFFFF',
    },
    tabActive: {
      borderColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    helper: {
      fontSize: 12,
      color: theme.colors.accent,
      marginTop: 4,
    },
    results: {
      marginTop: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.surface,
      overflow: 'hidden',
      maxHeight: 240,
    },
    linkButton: {
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    linkButtonText: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    resultRow: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    resultName: {
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    resultMeta: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    footer: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 12,
    },
    customOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    customBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    customSheet: {
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    button: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    buttonTextSecondary: {
      color: theme.colors.textPrimary,
    },
  });
