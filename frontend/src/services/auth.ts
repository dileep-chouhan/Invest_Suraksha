import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export class AuthService {
  static async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  static async isBiometricAvailable(): Promise<boolean> {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      return isEnrolled && hasHardware;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  static async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use Password',
        cancelLabel: 'Cancel',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  static async enableBiometricAuth(): Promise<void> {
    try {
      await AsyncStorage.setItem('biometricEnabled', 'true');
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
    }
  }

  static async disableBiometricAuth(): Promise<void> {
    try {
      await AsyncStorage.removeItem('biometricEnabled');
    } catch (error) {
      console.error('Error disabling biometric auth:', error);
    }
  }

  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }
}
