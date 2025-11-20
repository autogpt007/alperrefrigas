import { z } from 'zod';

// Utility functions for input sanitization
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '');
};

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters')
    .trim(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters'),
  phoneAvailableOnWhatsApp: z.boolean().default(true),
  whatsappPhone: z.string()
    .regex(/^[\d\s\-\+\(\)]*$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(1, 'Please select a subject')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim()
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
  company: z.string()
    .max(200, 'Company name must be less than 200 characters')
    .optional(),
  epaLicense: z.string()
    .max(100, 'EPA license must be less than 100 characters')
    .optional()
});

// Admin settings validation schema
export const adminSettingsSchema = z.object({
  notificationEmail: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  headerEmail: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  whatsappNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code')
    .max(20, 'Phone number must be less than 20 characters'),
  mainPhone: z.string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters'),
  certificateDetails: z.string()
    .max(1000, 'Certificate details must be less than 1000 characters')
    .optional(),
  // Payment settings
  bankWireInstructions: z.string()
    .min(10, 'Instructions must be at least 10 characters')
    .max(1000, 'Instructions must be less than 1000 characters'),
  bankName: z.string()
    .min(2, 'Bank name must be at least 2 characters')
    .max(100, 'Bank name must be less than 100 characters'),
  bankRoutingNumber: z.string()
    .regex(/^\d{9}$/, 'Routing number must be exactly 9 digits')
    .max(9, 'Routing number must be exactly 9 digits'),
  bankAccountNumber: z.string()
    .min(8, 'Account number must be at least 8 characters')
    .max(20, 'Account number must be less than 20 characters')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  bankSwiftCode: z.string()
    .min(8, 'SWIFT code must be at least 8 characters')
    .max(11, 'SWIFT code must be at most 11 characters')
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Please enter a valid SWIFT code'),
  freeShippingThreshold: z.string()
    .min(1, 'Free shipping threshold is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
  // Tawk.to live chat settings
  tawkPropertyId: z.string()
    .max(100, 'Property ID must be less than 100 characters')
    .optional(),
  tawkWidgetId: z.string()
    .max(100, 'Widget ID must be less than 100 characters')
    .optional(),
  tawkEnabled: z.boolean().optional()
});

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.maxAttempts;
    
    const now = Date.now();
    if (now - attempt.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - attempt.count);
  }

  getTimeUntilReset(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return 0;
    
    const timeLeft = this.windowMs - (Date.now() - attempt.lastAttempt);
    return Math.max(0, timeLeft);
  }
}

// Export validation functions
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type AdminSettingsData = z.infer<typeof adminSettingsSchema>;