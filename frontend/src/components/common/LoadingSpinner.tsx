import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

interface Props {
  fullScreen?: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<Props> = ({
  fullScreen = false,
  text,
  size = 'large',
  color = COLORS.primary
}) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]}>
    <ActivityIndicator size={size} color={color} />
    {text && <Text style={styles.text}>{text}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  text: {
    marginTop: 10,
    color: COLORS.text,
    fontSize: 16
  }
});

export default LoadingSpinner;
