import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, FONTS, SIZES } from '../../utils/constants';

const BiometricAuth: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loginWithBiometrics } = useAuth();

  useEffect(() => {
    handleBiometricAuth();
  }, []);

  const handleBiometricAuth = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!available || !enrolled) {
      Alert.alert('Unavailable', 'Biometric authentication is not set up.');
      return navigation.navigate('Login');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use Password',
      cancelLabel: 'Cancel'
    });

    if (result.success) {
      const res = await loginWithBiometrics();
      if (!res.success) {
        Alert.alert('Error', res.error);
        return navigation.navigate('Login');
      }
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Authenticating...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    ...FONTS.h3,
    color: COLORS.text
  }
});

export default BiometricAuth;
