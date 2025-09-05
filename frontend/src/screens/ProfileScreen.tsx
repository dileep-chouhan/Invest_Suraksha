import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreenComponent from '../components/profile/ProfileScreen';
import { COLORS } from '../utils/constants';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View style={styles.container}>
    <ProfileScreenComponent navigation={navigation} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});

export default ProfileScreen;
