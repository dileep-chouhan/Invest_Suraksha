import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import TranslationService from '../services/translation';
import { LANGUAGES } from '../utils/constants';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    const savedLanguage = await StorageService.getLanguage();
    setCurrentLanguage(savedLanguage);
  };

  const changeLanguage = useCallback(async (languageCode: string) => {
    setIsLoading(true);
    try {
      await StorageService.setLanguage(languageCode);
      setCurrentLanguage(languageCode);
      TranslationService.clearCache(); // Clear cache when language changes
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const translate = useCallback(async (text: string) => {
    if (currentLanguage === 'en') {
      return text;
    }
    
    try {
      return await TranslationService.translateText(text, currentLanguage);
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, [currentLanguage]);

  const getCurrentLanguageName = useCallback(() => {
    const language = LANGUAGES.find(lang => lang.code === currentLanguage);
    return language?.nativeName || 'English';
  }, [currentLanguage]);

  const getAvailableLanguages = useCallback(() => {
    return LANGUAGES;
  }, []);

  return {
    currentLanguage,
    isLoading,
    changeLanguage,
    translate,
    getCurrentLanguageName,
    getAvailableLanguages,
  };
};
