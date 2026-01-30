import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    slide: {
      flex: 1,
      paddingHorizontal: 28,
      paddingTop: 24,
      paddingBottom: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageWrap: {
      width: 240,
      height: 240,
      borderRadius: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      marginBottom: 24,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    description: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 8,
    },
    footer: {
      paddingHorizontal: 28,
      paddingBottom: 28,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.4,
    },
    dotActive: {
      width: 22,
      opacity: 1,
      backgroundColor: theme.colors.primary,
    },
    button: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    buttonSecondary: {
      backgroundColor: theme.colors.surface,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    buttonTextSecondary: {
      color: theme.colors.textPrimary,
    },
  });
