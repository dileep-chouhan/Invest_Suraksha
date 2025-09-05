import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../utils/constants';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

const Header: React.FC<Props> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress
}) => (
  <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.container}>
    <SafeAreaView>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    padding: 8
  },
  spacer: {
    width: 32
  },
  textContainer: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    ...FONTS.h2,
    color: '#fff'
  },
  subtitle: {
    ...FONTS.body4,
    color: '#fff',
    opacity: 0.8
  }
});

export default Header;
