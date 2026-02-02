import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

import { getSession, subscribeSession } from '../data';
import { darkTheme, lightTheme } from './theme';
import { ThemeContextValue, ThemeMode } from './types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadMode = async (id: string | null) => {
      if (!id) {
        if (isActive) {
          setMode('system');
        }
        return;
      }
      const stored = await AsyncStorage.getItem(`theme.mode.${id}`);
      if (!isActive) {
        return;
      }
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setMode(stored);
      } else {
        setMode('system');
      }
    };

    const init = async () => {
      const session = await getSession();
      if (!isActive) {
        return;
      }
      const id = session.profileId ?? null;
      setProfileId(id);
      await loadMode(id);
    };

    init();

    const unsubscribe = subscribeSession(session => {
      const id = session.profileId ?? null;
      setProfileId(id);
      loadMode(id);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const theme = useMemo(() => {
    const resolvedScheme = mode === 'system' ? (systemScheme ?? 'light') : mode;
    return resolvedScheme === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setMode: (nextMode: ThemeMode) => {
        setMode(nextMode);
        if (profileId) {
          AsyncStorage.setItem(`theme.mode.${profileId}`, nextMode).catch(
            () => undefined,
          );
        }
      },
    }),
    [theme, mode, profileId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
