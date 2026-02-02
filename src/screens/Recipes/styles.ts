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
      marginTop: 12,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    preferenceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: -10,
      marginBottom: 18,
    },
    preferenceTag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    preferenceTagText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary,
      textTransform: 'uppercase',
    },
    filterSection: {
      marginBottom: 16,
    },
    filterLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    filterInput: {
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    list: {
      gap: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 160,
    },
    cardPlaceholder: {
      width: '100%',
      height: 160,
      backgroundColor: theme.colors.surface,
    },
    cardBody: {
      padding: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    cardDescription: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    cardMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    cardMetaText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    cardMetaDot: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginHorizontal: 6,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: '#FFFFFF',
    },
    tagText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary,
      textTransform: 'uppercase',
    },
  });
