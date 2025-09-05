import { Request, Response } from 'express';
import { TranslationService } from '../services/translationService';
import Translation from '../models/Translation';

const translationService = new TranslationService();

export class TranslationController {
  async translateText(req: Request, res: Response) {
    try {
      const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

      if (!text || !targetLanguage) {
        return res.status(400).json({ 
          message: 'Text and target language are required' 
        });
      }

      if (!translationService.isLanguageSupported(targetLanguage)) {
        return res.status(400).json({ 
          message: 'Target language not supported' 
        });
      }

      const result = await translationService.translateText({
        text,
        targetLanguage,
        sourceLanguage
      });

      // Log translation for analytics (optional)
      try {
        const translation = new Translation({
          originalText: text,
          translatedText: result.translatedText,
          sourceLanguage: result.sourceLanguage,
          targetLanguage: result.targetLanguage,
          timestamp: new Date()
        });
        await translation.save();
      } catch (logError) {
        console.error('Error logging translation:', logError);
      }

      res.json(result);
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ message: 'Translation service error' });
    }
  }

  async translateBulk(req: Request, res: Response) {
    try {
      const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

      if (!texts || !Array.isArray(texts) || !targetLanguage) {
        return res.status(400).json({ 
          message: 'Texts array and target language are required' 
        });
      }

      if (texts.length > 100) {
        return res.status(400).json({ 
          message: 'Maximum 100 texts allowed per request' 
        });
      }

      const translations = await Promise.all(
        texts.map(text => 
          translationService.translateText({
            text,
            targetLanguage,
            sourceLanguage
          })
        )
      );

      res.json({ translations });
    } catch (error) {
      console.error('Bulk translation error:', error);
      res.status(500).json({ message: 'Bulk translation service error' });
    }
  }

  async getSupportedLanguages(req: Request, res: Response) {
    try {
      const languages = translationService.getSupportedLanguages();
      res.json({ languages });
    } catch (error) {
      console.error('Get supported languages error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTranslationStats(req: Request, res: Response) {
    try {
      const stats = await Translation.aggregate([
        {
          $group: {
            _id: '$targetLanguage',
            count: { $sum: 1 },
            lastUsed: { $max: '$timestamp' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const totalTranslations = await Translation.countDocuments();
      const uniqueLanguages = stats.length;

      res.json({
        totalTranslations,
        uniqueLanguages,
        languageStats: stats
      });
    } catch (error) {
      console.error('Get translation stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
