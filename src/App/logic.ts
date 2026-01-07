import { useColorScheme } from 'react-native';

export const useAppLogic = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return {
    statusBarStyle: isDarkMode ? 'light-content' : 'dark-content',
  } as const;
};
