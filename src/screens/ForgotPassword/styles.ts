import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 32,
      justifyContent: 'center',
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 21,
    },
    form: {
      gap: 16,
      marginTop: 8,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 13,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: theme.colors.textSecondary,
    },
    input: {
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.colors.textPrimary,
    },
    button: {
      marginTop: 16,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    buttonDisabled: {
      opacity: 0.45,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    helper: {
      marginTop: 16,
      fontSize: 13,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
    backLink: {
      marginTop: 18,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });
