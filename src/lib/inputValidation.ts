// Enhanced input validation and sanitization for security

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
};

/**
 * Validates and sanitizes email addresses
 */
export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeInput(email);
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Validates phone numbers (US format)
 */
export const sanitizePhoneNumber = (phone: string): string => {
  const sanitized = sanitizeInput(phone);
  // Remove all non-digit characters
  const digitsOnly = sanitized.replace(/\D/g, '');
  // Validate US phone number (10 or 11 digits)
  return (digitsOnly.length === 10 || digitsOnly.length === 11) ? digitsOnly : '';
};

/**
 * Validates and sanitizes names (allows letters, spaces, hyphens, apostrophes)
 */
export const sanitizeName = (name: string): string => {
  const sanitized = sanitizeInput(name);
  // Allow only letters, spaces, hyphens, and apostrophes
  return sanitized.replace(/[^a-zA-Z\s\-']/g, '');
};

/**
 * Validates and sanitizes addresses
 */
export const sanitizeAddress = (address: string): string => {
  const sanitized = sanitizeInput(address);
  // Allow alphanumeric, spaces, common punctuation for addresses
  return sanitized.replace(/[^a-zA-Z0-9\s\-.,#]/g, '');
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxAttempts: number = 5, timeWindowMinutes: number = 15) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = userAttempts.filter(time => now - time < this.timeWindow);
    this.attempts.set(identifier, recentAttempts);
    
    return recentAttempts.length < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    userAttempts.push(now);
    this.attempts.set(identifier, userAttempts);
  }
}

/**
 * Validates form data for common injection attacks
 */
export const validateFormData = (data: Record<string, any>): boolean => {
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi
  ];

  const dataString = JSON.stringify(data).toLowerCase();
  
  return !maliciousPatterns.some(pattern => pattern.test(dataString));
};