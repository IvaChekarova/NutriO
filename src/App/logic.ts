import { useEffect, useState } from 'react';

import { initDatabase } from '../data';
import { useTheme } from '../theme';

export const useAppLogic = () => {
  const { theme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const minDelay = 1600;
    const start = Date.now();

    const prepare = async () => {
      await initDatabase();

      const elapsed = Date.now() - start;
      const remaining = Math.max(minDelay - elapsed, 0);

      setTimeout(() => {
        if (isMounted) {
          setIsReady(true);
        }
      }, remaining);
    };

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    statusBarStyle: theme.statusBarStyle,
    isReady,
  } as const;
};
