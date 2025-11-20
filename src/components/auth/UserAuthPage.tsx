
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const UserAuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const userIP = 'login-user'; // In a real app, you'd get the user's IP
    if (!rateLimiter.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset(userIP) / 60000);
      setError(`Too many login attempts. Please wait ${timeLeft} minutes before trying again.`);
      return;
    }

    // Validate form data
    try {
      const validatedData = loginSchema.parse(loginData);
      setValidationErrors({});
      setIsLoading(true);
      setError('');
      
      console.log('Attempting login for:', validatedData.email);
      const { error } = await login(validatedData.email, validatedData.password);
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed. Please check your credentials.');
      } else {
        console.log('Login successful, redirecting');
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
        console.error('Login failed:', error);
        // More specific error handling
        if (error.message) {
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
    const userIP = 'register-user'; // In a real app, you'd get the user's IP
    if (!rateLimiter.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset(userIP) / 60000);
      setError(`Too many registration attempts. Please wait ${timeLeft} minutes before trying again.`);
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
      });
      
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
        } else {
          setError(`Registration failed: ${errorMessage}`);
        }
      } else {
        console.log('Registration successful');
        setError('Account created successfully! You are now signed in.');
        // Navigate to appropriate page after successful registration
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
        console.error('Registration failed:', error);
        setError('An unexpected error occurred. Please try again.');
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
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
                      <Building className="h-4 w-4 text-blue-500" />
                      EPA License (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={registerData.epaLicense}
                      onChange={(e) => handleInputChange('register', 'epaLicense', e.target.value)}
                      placeholder="Your EPA License Number"
                      className={validationErrors.epaLicense ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {validationErrors.epaLicense && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors.epaLicense}</p>
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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
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
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t">
              <p className="text-center text-sm text-gray-600">
                Continue as guest during checkout - no account required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuthPage;
