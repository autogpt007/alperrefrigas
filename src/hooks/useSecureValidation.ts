import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, sanitizeEmail, sanitizeName, sanitizeAddress, validateFormData, RateLimiter } from '@/lib/inputValidation';

interface SecurityHookOptions {
  maxAttempts?: number;
  timeWindowMinutes?: number;
}

export const useSecureValidation = (options: SecurityHookOptions = {}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(
    options.maxAttempts || 5,
    options.timeWindowMinutes || 15
  ));

  const logSecurityEvent = useCallback(async (
    eventType: 'login_attempt' | 'admin_action' | 'payment_attempt' | 'data_access' | 'api_call',
    details: Record<string, any> = {},
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    try {
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: eventType,
          user_email: details.userEmail,
          ip_address: details.ipAddress,
          user_agent: navigator.userAgent,
          details,
          risk_level: riskLevel
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const validateAndSanitize = useCallback(async (
    data: Record<string, any>,
    identifier: string,
    eventType: 'login_attempt' | 'admin_action' | 'payment_attempt' | 'data_access' | 'api_call' = 'data_access'
  ) => {
    setIsValidating(true);

    try {
      // Rate limiting check
      if (!rateLimiter.canAttempt(identifier)) {
        await logSecurityEvent(eventType, { 
          identifier,
          reason: 'rate_limit_exceeded'
        }, 'high');
        throw new Error('Too many attempts. Please try again later.');
      }

      rateLimiter.recordAttempt(identifier);

      // Validate against common injection attacks
      if (!validateFormData(data)) {
        await logSecurityEvent(eventType, { 
          identifier,
          reason: 'potential_injection_attack',
          data: JSON.stringify(data).substring(0, 200) // Log first 200 chars only
        }, 'critical');
        throw new Error('Invalid data format detected.');
      }

      // Sanitize the data
      const sanitized: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          if (key.toLowerCase().includes('email')) {
            sanitized[key] = sanitizeEmail(value);
          } else if (key.toLowerCase().includes('name')) {
            sanitized[key] = sanitizeName(value);
          } else if (key.toLowerCase().includes('address') || key.toLowerCase().includes('street') || key.toLowerCase().includes('city')) {
            sanitized[key] = sanitizeAddress(value);
          } else {
            sanitized[key] = sanitizeInput(value);
          }
        } else {
          sanitized[key] = value;
        }
      }

      // Log successful validation
      await logSecurityEvent(eventType, { 
        identifier,
        fieldsProcessed: Object.keys(data).length
      }, 'low');

      return { 
        success: true, 
        data: sanitized
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    } finally {
      setIsValidating(false);
    }
  }, [rateLimiter, logSecurityEvent]);

  return {
    validateAndSanitize,
    logSecurityEvent,
    isValidating
  };
};