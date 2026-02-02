import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';
import { clearSession } from '../../data';
import { useSettingsLogic } from './logic';
import { createStyles } from './styles';

const SettingsScreen = () => {
  const { theme, mode, setMode } = useTheme();
  const styles = createStyles(theme);
  const { profile, initials, calorieGoal, hydrationGoal } = useSettingsLogic();

  const handleLogout = async () => {
    await clearSession();
  };

  const handleChangePhoto = () => {
    Alert.alert('Change photo', 'We will add photo upload later.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Pressable style={styles.linkButton} onPress={handleChangePhoto}>
              <Text style={styles.linkText}>Change profile photo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Height</Text>
            <Text style={styles.detailValue}>{profile.height}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{profile.weight}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{profile.age}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sex</Text>
            <Text style={styles.detailValue}>{profile.sex}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Activity</Text>
            <Text style={styles.detailValue}>{profile.activity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Goal</Text>
            <Text style={styles.detailValue}>{profile.goal}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Diet tags</Text>
            <Text style={styles.detailValue}>{profile.dietTags}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>Calorie goal</Text>
              <Text style={styles.progressValue}>
                {calorieGoal ? `${Math.round(calorieGoal)} kcal` : '—'}
              </Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>Hydration goal</Text>
              <Text style={styles.progressValue}>
                {hydrationGoal ? `${(hydrationGoal / 1000).toFixed(1)} L` : '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.themeRow}>
            {(['system', 'light', 'dark'] as const).map(option => (
              <Pressable
                key={option}
                style={[
                  styles.themeChip,
                  mode === option && styles.themeChipActive,
                ]}
                onPress={() => setMode(option)}
              >
                <Text
                  style={[
                    styles.themeChipText,
                    mode === option && styles.themeChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
