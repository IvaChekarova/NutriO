import AsyncStorage from '@react-native-async-storage/async-storage';

type Session = {
  isLoggedIn: boolean;
  profileId?: string;
};

const SESSION_KEY = 'nutrio.session';
const listeners = new Set<(session: Session) => void>();

export const getSession = async (): Promise<Session> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return { isLoggedIn: false };
  }

  try {
    const parsed = JSON.parse(raw) as Session;
    return {
      isLoggedIn: Boolean(parsed.isLoggedIn),
      profileId: parsed.profileId,
    };
  } catch {
    return { isLoggedIn: false };
  }
};

export const setSession = async (session: Session) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  listeners.forEach(listener => listener(session));
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
  listeners.forEach(listener => listener({ isLoggedIn: false }));
};

export const subscribeSession = (listener: (session: Session) => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
