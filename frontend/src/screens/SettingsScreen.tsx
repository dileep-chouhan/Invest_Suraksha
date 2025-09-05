import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsScreenComponent from '../components/profile/SettingsScreen';
import Header from '../components/common/Header';
import { COLORS } from '../utils/constants';

const SettingsScreen: React.FC = () => (
  <View style={styles.container}>
    <Header title="Settings" />
    <SettingsScreenComponent />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});

export default SettingsScreen;
