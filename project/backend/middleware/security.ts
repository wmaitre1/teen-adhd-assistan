import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { sanitizeInput, validateInput } from '../utils/inputValidation';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
};

// Security middleware
export const securityMiddleware = [
  // Basic security headers
  helmet(),
  
  // Rate limiting
  limiter,
  
  // CORS protection
  cors(corsOptions),
  
  // Content security policy
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.VITE_SUPABASE_URL],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    }
  }),
  
  // Input sanitization
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize request body
      if (req.body) {
        req.body = sanitizeInput(req.body);
      }
      
      // Sanitize query parameters
      if (req.query) {
        req.query = sanitizeInput(req.query);
      }
      
      // Validate input
      validateInput(req);
      
      next();
    } catch (error) {
      next(error);
    }
  },
  
  // Error handling
  (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Security middleware error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
];