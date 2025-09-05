import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateObjectId, validatePagination } from '../middleware/validation';

const router = Router();
const courseController = new CourseController();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, validatePagination, courseController.getCourses);
router.get('/:id', optionalAuth, validateObjectId, courseController.getCourse);

// Protected routes
router.post('/complete-lesson', authenticateToken, courseController.markLessonComplete);
router.get('/progress', authenticateToken, courseController.getProgress);
router.post('/enroll/:id', authenticateToken, validateObjectId, courseController.enrollCourse);
router.post('/favorite/:id', authenticateToken, validateObjectId, courseController.favoriteCourse);
router.delete('/favorite/:id', authenticateToken, validateObjectId, courseController.unfavoriteCourse);
router.get('/my/enrolled', authenticateToken, courseController.getEnrolledCourses);
router.get('/my/favorites', authenticateToken, courseController.getFavoriteCourses);

export default router;
