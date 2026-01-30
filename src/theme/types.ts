export type ThemeMode = 'system' | 'light' | 'dark';

export type Theme = {
  isDark: boolean;
  statusBarStyle: 'light-content' | 'dark-content';
  colors: {
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    accent: string;
  };
};

export type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};
