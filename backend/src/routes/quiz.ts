import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticateToken } from '../middleware/auth';
import { quizLimiter } from '../middleware/rateLimit';
import { validate, quizSubmissionSchema, validateObjectId } from '../middleware/validation';

const router = Router();
const quizController = new QuizController();

// Protected routes
router.get('/:courseId', authenticateToken, validateObjectId, quizController.getQuiz);
router.post('/submit', authenticateToken, quizLimiter, validate(quizSubmissionSchema), quizController.submitQuiz);
router.get('/history/:courseId?', authenticateToken, quizController.getQuizHistory);
router.get('/stats/user', authenticateToken, quizController.getQuizStats);
router.get('/leaderboard/:courseId?', authenticateToken, quizController.getLeaderboard);
router.post('/retry/:courseId', authenticateToken, validateObjectId, quizController.retryQuiz);

export default router;
