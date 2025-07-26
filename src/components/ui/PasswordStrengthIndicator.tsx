import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getStrength = (password: string) => {
    let score = 0;
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    Object.values(criteria).forEach(met => {
      if (met) score += 20;
    });

    return { score, criteria };
  };

  const { score, criteria } = getStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: '', color: '' };
    if (score <= 40) return { label: 'Weak', color: 'text-red-500' };
    if (score <= 60) return { label: 'Fair', color: 'text-orange-500' };
    if (score <= 80) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const strengthInfo = getStrengthLabel(score);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={`text-sm font-medium ${strengthInfo.color}`}>
          {strengthInfo.label}
        </span>
      </div>
      
      <Progress value={score} className="h-2" />
      
      <div className="space-y-1">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'lowercase', label: 'Lowercase letter' },
          { key: 'uppercase', label: 'Uppercase letter' },
          { key: 'number', label: 'Number' },
          { key: 'special', label: 'Special character' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2 text-xs">
            {criteria[key as keyof typeof criteria] ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-red-500" />
            )}
            <span className={criteria[key as keyof typeof criteria] ? 'text-green-600' : 'text-muted-foreground'}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;