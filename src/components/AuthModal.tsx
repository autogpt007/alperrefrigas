import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HCaptchaWrapper, { HCaptchaHandle } from '@/components/ui/HCaptcha';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Separate captcha tokens and refs for each tab to prevent cross-contamination
  const [loginCaptchaToken, setLoginCaptchaToken] = useState<string | null>(null);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState<string | null>(null);
  const loginCaptchaRef = useRef<HCaptchaHandle>(null);
  const registerCaptchaRef = useRef<HCaptchaHandle>(null);
  
  // Remount keys to force hard reset of captcha widgets
  const [loginCaptchaKey, setLoginCaptchaKey] = useState(1);
  const [registerCaptchaKey, setRegisterCaptchaKey] = useState(1);
  
  // Prevent double-submit
  const inFlightRef = useRef(false);
  
  const { login, register } = useAuth();

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

  // Hard reset login captcha - clears token, resets widget, and remounts
  const hardResetLoginCaptcha = () => {
    setLoginCaptchaToken(null);
    try { loginCaptchaRef.current?.resetCaptcha(); } catch {}
    setLoginCaptchaKey((k) => k + 1);
  };

  // Hard reset register captcha - clears token, resets widget, and remounts
  const hardResetRegisterCaptcha = () => {
    setRegisterCaptchaToken(null);
    try { registerCaptchaRef.current?.resetCaptcha(); } catch {}
    setRegisterCaptchaKey((k) => k + 1);
  };

  // Reset both captchas when switching tabs to ensure fresh tokens
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError('');
    setSuccessMessage('');
    // Hard reset BOTH captchas to kill any stale token paths
    hardResetLoginCaptcha();
    hardResetRegisterCaptcha();
  };

  // Login captcha handlers
  const handleLoginCaptchaVerify = (token: string) => {
    setLoginCaptchaToken(token);
    setError('');
  };

  const handleLoginCaptchaExpire = () => {
    hardResetLoginCaptcha();
    setError('Captcha expired. Please verify again.');
  };

  const handleLoginCaptchaError = () => {
    hardResetLoginCaptcha();
    setError('Captcha error. Please try again.');
  };

  // Register captcha handlers
  const handleRegisterCaptchaVerify = (token: string) => {
    setRegisterCaptchaToken(token);
    setError('');
  };

  const handleRegisterCaptchaExpire = () => {
    hardResetRegisterCaptcha();
    setError('Captcha expired. Please verify again.');
  };

  const handleRegisterCaptchaError = () => {
    hardResetRegisterCaptcha();
    setError('Captcha error. Please try again.');
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
    
    // Prevent double-submit
    if (inFlightRef.current) return;
    
    // Consume token atomically - capture, clear state, and hard reset immediately
    const tokenToUse = loginCaptchaToken;
    setLoginCaptchaToken(null);
    hardResetLoginCaptcha();

    if (!tokenToUse) {
      setError('Please complete the captcha verification.');
      return;
    }
    
    inFlightRef.current = true;
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { error } = await login(loginData.email, loginData.password, tokenToUse);
      
      if (error) {
        const errorMessage = error.message || 'Login failed. Please check your credentials.';
        if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else if (/504|timeout|timed out/i.test(errorMessage)) {
          setError('The request timed out. Please complete the captcha and try again.');
        } else {
          setError(errorMessage);
        }
      } else {
        onClose();
        setLoginData({ email: '', password: '' });
      }
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
        setError('Captcha verification failed. Please complete the captcha again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-submit
    if (inFlightRef.current) return;
    
    // Consume token atomically - capture, clear state, and hard reset immediately
    const tokenToUse = registerCaptchaToken;
    setRegisterCaptchaToken(null);
    hardResetRegisterCaptcha();

    if (!tokenToUse) {
      setError('Please complete the captcha verification.');
      return;
    }
    
    inFlightRef.current = true;
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { error } = await register(registerData, tokenToUse);
      
      if (error) {
        const errorMessage = error.message || 'Registration failed. Please try again.';
        if (errorMessage.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
          setError('Captcha verification failed. Please complete the captcha again.');
        } else if (/504|timeout|timed out/i.test(errorMessage)) {
          setError('The request timed out, but your account may have been created. Try signing in first. If that fails, try registering again.');
        } else {
          setError(errorMessage);
        }
      } else {
        onClose();
        setRegisterData({
          name: '',
          email: '',
          password: '',
          company: '',
          epaLicense: ''
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (errorMessage.includes('already-seen-response') || errorMessage.includes('captcha')) {
        setError('Captcha verification failed. Please complete the captcha again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError('');
    setSuccessMessage('');
    hardResetLoginCaptcha();
    hardResetRegisterCaptcha();
    setLoginData({ email: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      password: '',
      company: '',
      epaLicense: ''
    });
  };

  const canSubmitLogin = !isLoading && !!loginCaptchaToken;
  const canSubmitRegister = !isLoading && !!registerCaptchaToken;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          {/* Glowing Header */}
          <CardHeader className="text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Access Portal
              </CardTitle>
              <p className="text-gray-400 text-sm">Sign in or create your account</p>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-4 border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-green-400">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-cyan-500/20">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-cyan-400"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-cyan-400" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyan-400"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="py-2">
                    <HCaptchaWrapper
                      key={`modal-login-captcha-${loginCaptchaKey}`}
                      ref={loginCaptchaRef}
                      onVerify={handleLoginCaptchaVerify}
                      onExpire={handleLoginCaptchaExpire}
                      onError={handleLoginCaptchaError}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmitLogin}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 disabled:opacity-50"
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

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend Confirmation Email
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Building className="h-4 w-4 text-cyan-400" />
                      Company (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={registerData.company}
                      onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
                      className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="Your Company"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-400" />
                      EPA License (Optional)
                    </Label>
                    <Input
                      type="text"
                      value={registerData.epaLicense}
                      onChange={(e) => setRegisterData({...registerData, epaLicense: e.target.value})}
                      className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="EPA-608-123456"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-cyan-400" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 pr-10"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyan-400"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="py-2">
                    <HCaptchaWrapper
                      key={`modal-register-captcha-${registerCaptchaKey}`}
                      ref={registerCaptchaRef}
                      onVerify={handleRegisterCaptchaVerify}
                      onExpire={handleRegisterCaptchaExpire}
                      onError={handleRegisterCaptchaError}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmitRegister}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : !registerCaptchaToken ? (
                      'Complete Captcha to Continue'
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Resend Confirmation Email
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthModal;
