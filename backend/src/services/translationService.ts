import { translate } from 'google-translate-api-x';
import { config } from '../config';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache for translations

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslationService {
  private supportedLanguages = [
    'hi', // Hindi
    'bn', // Bengali
    'te', // Telugu
    'mr', // Marathi
    'ta', // Tamil
    'gu', // Gujarati
    'ur', // Urdu
    'kn', // Kannada
    'or', // Odia
    'ml', // Malayalam
    'pa', // Punjabi
    'as', // Assamese
    'en'  // English
  ];

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, targetLanguage, sourceLanguage = 'en' } = request;
    
    const cacheKey = `translate_${sourceLanguage}_${targetLanguage}_${Buffer.from(text).toString('base64')}`;
    const cached = cache.get<TranslationResponse>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const result = await translate(text, { from: sourceLanguage, to: targetLanguage });
      
      const response: TranslationResponse = {
        originalText: text,
        translatedText: result.text,
        sourceLanguage: result.from.language.iso,
        targetLanguage: targetLanguage
      };

      cache.set(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text if translation fails
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      };
    }
  }

  async translateCourse(courseData: any, targetLanguage: string): Promise<any> {
    if (targetLanguage === 'en') {
      return courseData;
    }

    const translatedCourse = { ...courseData };

    // Translate title and description
    const titleTranslation = await this.translateText({
      text: courseData.title,
      targetLanguage
    });
    
    const descTranslation = await this.translateText({
      text: courseData.description,
      targetLanguage
    });

    translatedCourse.title = titleTranslation.translatedText;
    translatedCourse.description = descTranslation.translatedText;

    // Translate lessons
    if (courseData.lessons) {
      translatedCourse.lessons = await Promise.all(
        courseData.lessons.map(async (lesson: any) => {
          const lessonTitleTranslation = await this.translateText({
            text: lesson.title,
            targetLanguage
          });
          
          const lessonContentTranslation = await this.translateText({
            text: lesson.content,
            targetLanguage
          });

          return {
            ...lesson,
            title: lessonTitleTranslation.translatedText,
            content: lessonContentTranslation.translatedText
          };
        })
      );
    }

    return translatedCourse;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  isLanguageSupported(languageCode: string): boolean {
    return this.supportedLanguages.includes(languageCode);
  }
}
