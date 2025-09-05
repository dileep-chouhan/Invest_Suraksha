import ApiService from './api';
import { StorageService } from './storage';

export class TranslationService {
  private cache = new Map<string, string>();
  
  async translateText(
    text: string, 
    targetLanguage: string, 
    sourceLanguage: string = 'en'
  ): Promise<string> {
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Check local storage
    const cached = await StorageService.getItem<string>(`translation_${cacheKey}`);
    if (cached) {
      this.cache.set(cacheKey, cached);
      return cached;
    }

    try {
      const response = await ApiService.translateText(text, targetLanguage, sourceLanguage);
      const translatedText = response.translatedText || text;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      await StorageService.setItem(`translation_${cacheKey}`, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new TranslationService();
