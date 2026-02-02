import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerText: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caloriesValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    caloriesLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });
