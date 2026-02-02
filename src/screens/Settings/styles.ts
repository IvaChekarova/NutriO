import { StyleSheet } from 'react-native';

import { Theme } from '../../theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 24,
      paddingBottom: 40,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 20,
    },
    profileCard: {
      flexDirection: 'row',
      gap: 16,
      padding: 16,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      marginBottom: 24,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '700',
    },
    profileInfo: {
      flex: 1,
      justifyContent: 'center',
      gap: 4,
    },
    profileName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    profileEmail: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    linkButton: {
      marginTop: 6,
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
    },
    detailLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    detailValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      maxWidth: '60%',
      textAlign: 'right',
    },
    progressRow: {
      flexDirection: 'row',
      gap: 12,
    },
    progressCard: {
      flex: 1,
      borderRadius: 16,
      padding: 14,
      backgroundColor: theme.colors.surface,
    },
    progressLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    progressValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginTop: 8,
    },
    themeRow: {
      flexDirection: 'row',
      gap: 10,
    },
    themeChip: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: theme.colors.surface,
    },
    themeChipActive: {
      backgroundColor: theme.colors.primary,
    },
    themeChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    themeChipTextActive: {
      color: '#FFFFFF',
    },
    logoutButton: {
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
