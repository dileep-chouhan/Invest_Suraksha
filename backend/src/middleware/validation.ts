import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
      .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
      .regex(/(?=.*\d)/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional(),
    preferredLanguage: z.string().min(2).max(5).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional(),
    preferredLanguage: z.string().min(2).max(5).optional(),
    profile: z.object({
      age: z.number().min(18).max(100).optional(),
      occupation: z.string().max(100).optional(),
      investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      riskTolerance: z.enum(['low', 'medium', 'high']).optional()
    }).optional(),
    settings: z.object({
      notifications: z.boolean().optional(),
      biometricAuth: z.boolean().optional(),
      darkMode: z.boolean().optional()
    }).optional()
  })
});

export const tradingSchema = z.object({
  body: z.object({
    symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(10000, 'Quantity too large')
  })
});

export const quizSubmissionSchema = z.object({
  body: z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    answers: z.array(z.number().min(0)).min(1, 'At least one answer required'),
    timeTaken: z.number().min(0, 'Time taken must be positive')
  })
});

export const translationSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text is required').max(5000, 'Text too long'),
    targetLanguage: z.string().min(2, 'Target language is required').max(5),
    sourceLanguage: z.string().min(2).max(5).optional()
  })
});

export const bulkTranslationSchema = z.object({
  body: z.object({
    texts: z.array(z.string().min(1).max(5000)).max(100, 'Maximum 100 texts allowed'),
    targetLanguage: z.string().min(2, 'Target language is required').max(5),
    sourceLanguage: z.string().min(2).max(5).optional()
  })
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          message: 'Validation error',
          errors: errorMessages
        });
      }
      
      return res.status(500).json({ message: 'Validation error' });
    }
  };
};

// Custom validation functions
export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page = '1', limit = '10' } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ message: 'Invalid page number' });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ message: 'Invalid limit (1-100)' });
  }
  
  req.query.page = pageNum.toString();
  req.query.limit = limitNum.toString();
  
  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic input sanitization
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};
