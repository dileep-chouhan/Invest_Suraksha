import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Translation API rate limiting
export const translationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 translation requests per minute
  message: {
    error: 'Translation rate limit exceeded, please try again later.',
    retryAfter: 60 * 1000
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Translation rate limit exceeded, please slow down.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Trading endpoints rate limiting
export const tradingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit to 20 trading actions per minute
  message: {
    error: 'Trading rate limit exceeded, please wait before placing more orders.',
    retryAfter: 60 * 1000
  },
  keyGenerator: (req: Request) => {
    // Use user ID instead of IP for authenticated trading endpoints
    return req.user?.userId || req.ip;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Trading rate limit exceeded, please wait before placing more orders.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Quiz submission rate limiting
export const quizLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit to 3 quiz submissions per 5 minutes
  message: {
    error: 'Quiz submission rate limit exceeded, please wait before retrying.',
    retryAfter: 5 * 60 * 1000
  },
  keyGenerator: (req: Request) => {
    return `${req.user?.userId || req.ip}_${req.body.courseId}`;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Quiz submission rate limit exceeded, please wait before retrying.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Create custom rate limiter
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  keyGenerator?: (req: Request) => string
) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      });
    }
  });
};
