import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, registerSchema, sanitizeInput, RateLimiter, type LoginData, type RegisterData } from '@/lib/validation';
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator';
import { supabase } from '@/integrations/supabase/client';
import GoogleLoginButton from '@/components/ui/GoogleLoginButton';

const UserAuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Prevent double-submit
  const inFlightRef = useRef(false);
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  // Rate limiter for authentication attempts
  const rateLimiter = useRef(new RateLimiter(5, 900000)); // 5 attempts per 15 minutes

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError('');
    setSuccessMessage('');
    setValidationErrors({});
  };

  // Resend confirmation email
  const handleResendConfirmation = async () => {
    const email = activeTab === 'signin' ? loginData.email : registerData.email;
    
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });

      if (resendError) {
        setError(resendError.message || 'Failed to resend confirmation email.');
      } else {
        setSuccessMessage('Confirmation email sent! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to resend confirmation email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict double-submit prevention
    if (inFlightRef.current) {
      console.log('Login already in flight, ignoring duplicate submit');
      return;
    }
    inFlightRef.current = true;
    
    // Check rate limiting
    const userIP = 'login-user';
    if (!rateLimiter.current.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.current.getTimeUntilReset(userIP) / 60000);
      setError(`Too many login attempts. Please wait ${timeLeft} minutes before trying again.`);
      inFlightRef.current = false;
      return;
    }

    // Validate form data
    try {
      const validatedData = loginSchema.parse(loginData);
      setValidationErrors({});
      
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      console.log('Submitting login');
      
      const { error } = await login(validatedData.email, validatedData.password);
      
      if (error) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('Invalid login credentials')) {
          setError('Invalid email or password. If you just registered, please check your email to confirm your account first.');
        } else if (errorMessage.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
        } else {
          setError(error.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
          ? returnTo 
          : '/account';
        navigate(redirectPath);
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        setError(error.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict double-submit prevention
    if (inFlightRef.current) {
      console.log('Registration already in flight, ignoring duplicate submit');
      return;
    }
    inFlightRef.current = true;
    
    // Check rate limiting
    const userIP = 'register-user';
    if (!rateLimiter.current.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.current.getTimeUntilReset(userIP) / 60000);
      setError(`Too many registration attempts. Please wait ${timeLeft} minutes before trying again.`);
      inFlightRef.current = false;
      return;
    }

    // Validate form data
    try {
      const validatedData = registerSchema.parse(registerData);
      setValidationErrors({});
      
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      console.log('Submitting registration');
      
      const result = await register({
        name: sanitizeInput(validatedData.name),
        email: validatedData.email.toLowerCase().trim(),
        password: validatedData.password,
        company: validatedData.company ? sanitizeInput(validatedData.company) : undefined,
        epaLicense: validatedData.epaLicense ? sanitizeInput(validatedData.epaLicense) : undefined
      });
      
      if (result.error) {
        // Handle duplicate email specifically
        if (result.error.isDuplicate || result.error.message === 'DUPLICATE_EMAIL') {
          setError('This email is already registered. Please sign in instead, or use "Forgot Password" if you need to reset your password.');
          setActiveTab('signin');
          setLoginData(prev => ({ ...prev, email: registerData.email }));
          return;
        }
        
        const errorMessage = typeof result.error === 'string' ? result.error : 
                           result.error.message || 
                           (result.error.details && result.error.details.message) ||
                           'Registration failed';
        
        if (errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
          setActiveTab('signin');
          setLoginData(prev => ({ ...prev, email: registerData.email }));
        } else if (errorMessage.includes('Password must be at least')) {
          setError('Password must be at least 6 characters long.');
        } else if (errorMessage.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else if (errorMessage.includes('Too many requests')) {
          setError('Too many registration attempts. Please wait a moment before trying again.');
        } else {
          setError(`Registration failed: ${errorMessage}`);
        }
      } else if (result.needsEmailConfirmation) {
        setSuccessMessage(`Account created! Please check your email (${registerData.email}) to confirm your account before signing in. Check your spam folder if you don't see it.`);
        setActiveTab('signin');
        setLoginData(prev => ({ ...prev, email: registerData.email }));
      } else {
        const redirectPath = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') 
          ? returnTo 
          : '/account';
        navigate(redirectPath);
      }
    } catch (error: any) {
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    formType: 'login' | 'register',
    field: keyof LoginData | keyof RegisterData,
    value: string
  ) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

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

            {successMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {successMessage}
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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend Confirmation Email
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <GoogleLoginButton disabled={isLoading} />
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
                      disabled={isLoading}
                    />
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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend Confirmation Email
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <GoogleLoginButton disabled={isLoading} />
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
