import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import LanguageSelector from '../common/LanguageSelector';

const SettingsScreen: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [notifications, setNotifications] = useState(user?.settings.notifications || false);
  const [biometric, setBiometric] = useState(user?.settings.biometricAuth || false);
  const [darkMode, setDarkMode] = useState(user?.settings.darkMode || false);

  const handleToggle = async (key: 'notifications' | 'biometricAuth' | 'darkMode', value: boolean) => {
    if (key === 'notifications') setNotifications(value);
    if (key === 'biometricAuth') setBiometric(value);
    if (key === 'darkMode') setDarkMode(value);

    await updateProfile({ settings: { [key]: value } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={(val) => handleToggle('notifications', val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Biometric Authentication</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Use Biometrics</Text>
          <Switch
            value={biometric}
            onValueChange={(val) => handleToggle('biometricAuth', val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Appearance</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(val) => handleToggle('darkMode', val)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Language</Text>
        <LanguageSelector />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    ...FONTS.body3,
    color: COLORS.text
  }
});

export default SettingsScreen;
