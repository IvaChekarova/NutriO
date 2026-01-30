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
      paddingTop: 24,
      paddingBottom: 24,
      justifyContent: 'center',
    },
    header: {
      marginBottom: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 10,
    },
    description: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    progress: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginTop: 16,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.35,
    },
    progressDotActive: {
      width: 22,
      opacity: 1,
      backgroundColor: theme.colors.primary,
    },
    form: {
      marginTop: 24,
      gap: 16,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
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
    inputSmall: {
      flex: 1,
      textAlign: 'center',
    },
    inputWide: {
      flex: 2,
      textAlign: 'center',
    },
    hint: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    tileRow: {
      flexDirection: 'row',
      gap: 10,
    },
    tileGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    tileStack: {
      gap: 10,
    },
    tile: {
      width: '48%',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.textSecondary,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    tileWide: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.colors.textSecondary,
      backgroundColor: theme.colors.surface,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    tileActive: {
      borderColor: theme.colors.primary,
      backgroundColor: '#FFFFFF',
    },
    activityNotActive: {
      borderColor: theme.isDark ? '#FF6B6B' : '#E45858',
      backgroundColor: '#FFFFFF',
    },
    activityLight: {
      borderColor: theme.isDark ? '#FFD166' : '#E0AA3B',
      backgroundColor: '#FFFFFF',
    },
    activityModerate: {
      borderColor: theme.isDark ? '#FFA94D' : '#E0872C',
      backgroundColor: '#FFFFFF',
    },
    activityActive: {
      borderColor: theme.isDark ? '#6BD48B' : '#2E7D32',
      backgroundColor: '#FFFFFF',
    },
    tileText: {
      fontSize: 14,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    tileTextActive: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    tileIconWrap: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tileIcon: {
      width: 36,
      height: 36,
      resizeMode: 'contain',
    },
    tileSubtext: {
      marginTop: 4,
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    footer: {
      marginTop: 28,
      gap: 12,
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
      letterSpacing: 0.3,
    },
    buttonTextSecondary: {
      color: theme.colors.textPrimary,
    },
    helper: {
      textAlign: 'center',
      color: theme.colors.accent,
      fontSize: 12,
      marginTop: 6,
    },
    skip: {
      alignSelf: 'center',
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    navRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    navButton: {
      flex: 1,
    },
  });
