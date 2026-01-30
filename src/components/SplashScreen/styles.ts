import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    logoWrap: {
      marginBottom: 16,
    },
    logo: {
      width: 500,
      height: 500,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      color: theme.colors.primary,
      marginBottom: 6,
      letterSpacing: 0.6,
    },
    subtitle: {
      fontSize: 15,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      paddingHorizontal: 28,
      lineHeight: 20,
    },
  });
