import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { clearSession } from '../../data';
import { createStyles } from './styles';

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogout = async () => {
    await clearSession();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
};

export default SettingsScreen;
