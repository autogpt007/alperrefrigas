import { useState, useCallback } from 'react';
import { useSecureValidation } from './useSecureValidation';
import { useToast } from '@/hooks/use-toast';

interface SecureFormOptions {
  maxAttempts?: number;
  timeWindowMinutes?: number;
  enableCSRF?: boolean;
}

export const useSecureForm = (options: SecureFormOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const { validateAndSanitize, logSecurityEvent } = useSecureValidation(options);
  const { toast } = useToast();

  // Generate CSRF token
  const generateCSRFToken = useCallback(() => {
    if (options.enableCSRF) {
      const token = window.crypto.randomUUID();
      setCsrfToken(token);
      return token;
    }
    return '';
  }, [options.enableCSRF]);

  // Validate CSRF token
  const validateCSRFToken = useCallback((token: string) => {
    if (options.enableCSRF && token !== csrfToken) {
      logSecurityEvent('api_call', { 
        reason: 'csrf_token_mismatch',
        providedToken: token.substring(0, 8) + '...' 
      }, 'high');
      return false;
    }
    return true;
  }, [csrfToken, options.enableCSRF, logSecurityEvent]);

  // Secure form submission handler
  const handleSecureSubmit = useCallback(async <T>(
    formData: Record<string, any>,
    submitFn: (sanitizedData: Record<string, any>) => Promise<T>,
    identifier: string = 'form_submission'
  ): Promise<{ success: boolean; data?: T; error?: string }> => {
    setIsSubmitting(true);
    
    try {
      // CSRF validation
      if (options.enableCSRF && !validateCSRFToken(formData.csrfToken || '')) {
        toast({
          title: "Security Error",
          description: "Invalid security token. Please refresh and try again.",
          variant: "destructive"
        });
        return { success: false, error: 'Invalid security token' };
      }

      // Validate and sanitize input
      const validation = await validateAndSanitize(
        formData, 
        identifier, 
        'data_access'
      );
      
      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error || "Invalid input detected",
          variant: "destructive"
        });
        return { success: false, error: validation.error };
      }

      // Submit with sanitized data
      const result = await submitFn(validation.data);
      
      // Log successful submission
      await logSecurityEvent('data_access', { 
        identifier,
        action: 'form_submitted',
        fieldsProcessed: Object.keys(formData).length
      }, 'low');

      return { success: true, data: result };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      
      // Log submission error
      await logSecurityEvent('data_access', { 
        identifier,
        action: 'form_submission_failed',
        error: errorMessage
      }, 'medium');
      
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAndSanitize, logSecurityEvent, validateCSRFToken, options.enableCSRF, toast]);

  return {
    isSubmitting,
    csrfToken,
    generateCSRFToken,
    handleSecureSubmit
  };
};