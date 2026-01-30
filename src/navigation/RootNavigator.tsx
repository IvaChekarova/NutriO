import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { getSession, subscribeSession } from '../data';

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isActive = true;
    getSession()
      .then(session => {
        if (isActive) {
          setIsAuthenticated(session.isLoggedIn);
        }
      })
      .catch(() => {
        if (isActive) {
          setIsAuthenticated(false);
        }
      });

    const unsubscribe = subscribeSession(session => {
      if (isActive) {
        setIsAuthenticated(session.isLoggedIn);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
