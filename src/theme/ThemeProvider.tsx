import React, { createContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from './theme';
import { ThemeContextValue, ThemeMode } from './types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const theme = useMemo(() => {
    const resolvedScheme = mode === 'system' ? systemScheme ?? 'light' : mode;
    return resolvedScheme === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    mode,
    setMode,
  }), [theme, mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
