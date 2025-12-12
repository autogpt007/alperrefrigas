
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, registerSchema, sanitizeInput, RateLimiter, type LoginData, type RegisterData } from '@/lib/validation';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import HCaptchaWrapper from '@/components/ui/HCaptcha';

const UserAuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Separate captcha tokens and refs for each tab to prevent cross-contamination
  const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(null);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<string | null>(null);
  const loginCaptchaRef = useRef<HCaptcha>(null);
  const registerCaptchaRef = useRef<HCaptcha>(null);
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  // Rate limiter for authentication attempts
  const rateLimiter = new RateLimiter(5, 900000); // 5 attempts per 15 minutes

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    epaLicense: ''
  });

  useEffect(() => {
    if (user) {
      // Validate returnTo URL for security (only allow internal paths)
      const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
        ? returnTo 
        : '/account';
      navigate(redirectPath);
    }
  }, [user, navigate, returnTo]);

  // Reset both captchas when switching tabs to ensure fresh tokens
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError('');
    setValidationErrors({});
    // Clear all captcha tokens and reset widgets
    setLoginCaptchaToken(null);
    setRegisterCaptchaToken(null);
    loginCaptchaRef.current?.resetCaptcha();
    registerCaptchaRef.current?.resetCaptcha();
  };

  // Login captcha handlers
  const handleLoginCaptchaVerify = (token: string) => {
    setLoginCaptchaToken(token);
    setError('');
  };

  const handleLoginCaptchaExpire = () => {
    setLoginCaptchaToken(null);
    setError('Captcha expired. Please verify again.');
  };

  const handleLoginCaptchaError = () => {
    setLoginCaptchaToken(null);
    setError('Captcha error. Please try again.');
  };

  // Register captcha handlers
  const handleRegisterCaptchaVerify = (token: string) => {
    setRegisterCaptchaToken(token);
    setError('');
  };

  const handleRegisterCaptchaExpire = () => {
    setRegisterCaptchaToken(null);
    setError('Captcha expired. Please verify again.');
  };

  const handleRegisterCaptchaError = () => {
    setRegisterCaptchaToken(null);
    setError('Captcha error. Please try again.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const userIP = 'login-user';
    if (!rateLimiter.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset(userIP) / 60000);
      setError(`Too many login attempts. Please wait ${timeLeft} minutes before trying again.`);
      return;
    }

    // Capture token atomically and clear state immediately to prevent reuse
    const tokenToUse = loginCaptchaToken;
    setLoginCaptchaToken(null);

    // Validate form data
    try {
      const validatedData = loginSchema.parse(loginData);
      setValidationErrors({});
      setIsLoading(true);
      setError('');
      
      console.log('Attempting login for:', validatedData.email);
      const { error } = await login(validatedData.email, validatedData.password, tokenToUse || undefined);
      
      // Always reset captcha after API call
      loginCaptchaRef.current?.resetCaptcha();
      
      if (error) {
        console.error('Login error:', error);
        const errorMessage = error.message || '';
        if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out') || errorMessage.includes('504')) {
          setError('The request timed out. Please complete the captcha and try again.');
        } else {
          setError(error.message || 'Login failed. Please check your credentials.');
        }
      } else {
        console.log('Login successful, redirecting');
        const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
          ? returnTo 
          : '/account';
        navigate(redirectPath);
      }
    } catch (error: any) {
      // Reset captcha on any error
      loginCaptchaRef.current?.resetCaptcha();
      
      if (error.errors) {
        // Zod validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error('Login failed:', error);
        const errorMessage = error?.message || '';
        if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else if (error.message) {
          setError(error.message);
        } else if (error.details) {
          setError(`Login failed: ${error.details}`);
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const userIP = 'register-user';
    if (!rateLimiter.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset(userIP) / 60000);
      setError(`Too many registration attempts. Please wait ${timeLeft} minutes before trying again.`);
      return;
    }

    // Capture token atomically and clear state immediately to prevent reuse
    const tokenToUse = registerCaptchaToken;
    setRegisterCaptchaToken(null);

    if (!tokenToUse) {
      setError('Please complete the captcha verification.');
      return;
    }

    // Validate form data
    try {
      const validatedData = registerSchema.parse(registerData);
      setValidationErrors({});
      setIsLoading(true);
      setError('');
      
      console.log('Attempting registration for:', validatedData.email);
      const { error } = await register({
        name: sanitizeInput(validatedData.name),
        email: validatedData.email.toLowerCase().trim(),
        password: validatedData.password,
        company: validatedData.company ? sanitizeInput(validatedData.company) : undefined,
        epaLicense: validatedData.epaLicense ? sanitizeInput(validatedData.epaLicense) : undefined
      }, tokenToUse);
      
      // Always reset captcha after API call
      registerCaptchaRef.current?.resetCaptcha();
      
      if (error) {
        console.error('Registration error:', error);
        
        // Handle different types of error objects
        const errorMessage = typeof error === 'string' ? error : 
                           error.message || 
                           (error.details && error.details.message) ||
                           'Registration failed';
        
        console.log('Error message type:', typeof error, 'Error details:', error);
        
        if (errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
          setActiveTab('signin');
        } else if (errorMessage.includes('Password must be at least')) {
          setError('Password must be at least 6 characters long.');
        } else if (errorMessage.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else if (errorMessage.includes('Too many requests')) {
          setError('Too many registration attempts. Please wait a moment before trying again.');
        } else if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out') || errorMessage.includes('504')) {
          setError('The request timed out. Your account may have been created - please try signing in first. If that doesn\'t work, complete the captcha and try again.');
        } else {
          setError(`Registration failed: ${errorMessage}`);
        }
      } else {
        console.log('Registration successful');
        // Navigate to appropriate page after successful registration
        const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
          ? returnTo 
          : '/account';
        navigate(redirectPath);
      }
    } catch (error: any) {
      // Reset captcha on any error
      registerCaptchaRef.current?.resetCaptcha();
      
      if (error.errors) {
        // Zod validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error('Registration failed:', error);
        const errorMessage = error?.message || '';
        if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    formType: 'login' | 'register',
    field: keyof LoginData | keyof RegisterData,
    value: string
  ) => {
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Don't sanitize during typing - only sanitize on submit to preserve natural typing flow
    const sanitizedValue = field === 'email' 
      ? value.toLowerCase().trim() 
      : value;

    if (formType === 'login') {
      setLoginData(prev => ({
        ...prev,
        [field]: sanitizedValue
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [field]: sanitizedValue
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Access
            </CardTitle>
            <p className="text-gray-600">Sign in to your account or create a new one</p>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                      placeholder="your@email.com"
                      className={validationErrors.email ? 'border-red-500' : ''}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                        placeholder="••••••••"
                        className={validationErrors.password ? 'border-red-500' : ''}
                        required
                        disabled={isLoading}
                      />
                      {validationErrors.password && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="py-2">
                    <HCaptchaWrapper
                      ref={loginCaptchaRef}
                      onVerify={handleLoginCaptchaVerify}
                      onExpire={handleLoginCaptchaExpire}
                      onError={handleLoginCaptchaError}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !loginCaptchaToken}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : !loginCaptchaToken ? (
                      'Complete Captcha to Sign In'
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                      placeholder="John Doe"
                      className={validationErrors.name ? 'border-red-500' : ''}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.name && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                      placeholder="your@email.com"
                      className={validationErrors.email ? 'border-red-500' : ''}
                      required
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      Company (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={registerData.company}
                      onChange={(e) => handleInputChange('register', 'company', e.target.value)}
                      placeholder="Your Company"
                      className={validationErrors.company ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {validationErrors.company && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.company}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                        placeholder="••••••••"
                        className={validationErrors.password ? 'border-red-500' : ''}
                        required
                        disabled={isLoading}
                      />
                      {validationErrors.password && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <PasswordStrengthIndicator password={registerData.password} />
                  </div>

                  <div className="py-2">
                    <HCaptchaWrapper
                      ref={registerCaptchaRef}
                      onVerify={handleRegisterCaptchaVerify}
                      onExpire={handleRegisterCaptchaExpire}
                      onError={handleRegisterCaptchaError}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !registerCaptchaToken}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : !registerCaptchaToken ? (
                      'Complete Captcha to Create Account'
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuthPage;
