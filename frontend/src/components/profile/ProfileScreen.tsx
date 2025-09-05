import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SIZES, FONTS } from '../../utils/constants';
import LanguageSelector from '../common/LanguageSelector';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.itemText}>App Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Achievements')}>
          <Text style={styles.itemText}>Achievements</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Language</Text>
          <LanguageSelector />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.margin
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.base
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text
  },
  email: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginTop: 4
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    padding: SIZES.padding
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  itemText: {
    ...FONTS.body3,
    color: COLORS.text
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  logoutText: {
    ...FONTS.body3,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default ProfileScreen;
