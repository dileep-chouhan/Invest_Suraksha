import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { validate, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validate(updateProfileSchema), authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.delete('/delete-account', authenticateToken, authController.deleteAccount);

export default router;
