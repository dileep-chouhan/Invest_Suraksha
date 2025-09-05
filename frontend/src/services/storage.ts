import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // User preferences
  static async setLanguage(language: string): Promise<void> {
    await this.setItem('preferredLanguage', language);
  }

  static async getLanguage(): Promise<string> {
    const language = await this.getItem<string>('preferredLanguage');
    return language || 'en';
  }

  static async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.setItem('theme', theme);
  }

  static async getTheme(): Promise<'light' | 'dark'> {
    const theme = await this.getItem<'light' | 'dark'>('theme');
    return theme || 'light';
  }

  // Course progress
  static async saveProgress(courseId: string, progress: any): Promise<void> {
    await this.setItem(`progress_${courseId}`, progress);
  }

  static async getProgress(courseId: string): Promise<any | null> {
    return await this.getItem(`progress_${courseId}`);
  }

  // Offline courses cache
  static async cacheCourse(course: any): Promise<void> {
    await this.setItem(`course_${course._id}`, course);
  }

  static async getCachedCourse(courseId: string): Promise<any | null> {
    return await this.getItem(`course_${courseId}`);
  }
}
