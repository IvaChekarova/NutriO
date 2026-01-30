import { Theme } from './types';

export const lightTheme: Theme = {
  isDark: false,
  statusBarStyle: 'dark-content',
  colors: {
    background: '#FFFFFF',
    surface: '#F4F1EC',
    textPrimary: '#1F1B16',
    textSecondary: '#5C534B',
    primary: '#2E7D32',
    secondary: '#1B5E20',
    accent: '#D98B3A',
  },
};

export const darkTheme: Theme = {
  isDark: true,
  statusBarStyle: 'light-content',
  colors: {
    background: '#12100E',
    surface: '#1B1713',
    textPrimary: '#F5EFE6',
    textSecondary: '#B9AFA4',
    primary: '#64B56A',
    secondary: '#3E8A45',
    accent: '#F0B46A',
  },
};
