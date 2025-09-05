import { Router } from 'express';
import { TranslationController } from '../controllers/translationController';
import { optionalAuth } from '../middleware/auth';
import { translationLimiter } from '../middleware/rateLimit';
import { validate, translationSchema, bulkTranslationSchema } from '../middleware/validation';

const router = Router();
const translationController = new TranslationController();

// Public routes with rate limiting
router.post('/translate', optionalAuth, translationLimiter, validate(translationSchema), translationController.translateText);
router.post('/translate/bulk', optionalAuth, translationLimiter, validate(bulkTranslationSchema), translationController.translateBulk);
router.get('/languages', translationController.getSupportedLanguages);
router.get('/stats', translationController.getTranslationStats);

export default router;
