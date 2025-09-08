import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Bitcoin, Banknote, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
}

interface PaymentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  availableMethods: string[];
}

const paymentCategories: PaymentCategory[] = [
  {
    id: 'traditional',
    name: 'Traditional Payments',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Credit cards and bank transfers',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'digital',
    name: 'Digital Payments',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'Zelle, CashApp and digital wallets',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'crypto',
    name: 'Crypto Payments',
    icon: <Bitcoin className="w-6 h-6" />,
    description: 'Bitcoin, USDT, Ethereum and more',
    gradient: 'from-orange-500 to-orange-600'
  }
];

const paymentMethods: PaymentMethod[] = [
  { id: 'credit_card', name: 'Credit Card', icon: <CreditCard className="w-5 h-5" />, category: 'traditional', description: 'Visa, Mastercard, American Express' },
  { id: 'bank_wire', name: 'Bank Wire', icon: <Banknote className="w-5 h-5" />, category: 'traditional', description: 'Direct bank transfer' },
  { id: 'zelle', name: 'Zelle', icon: <Zap className="w-5 h-5" />, category: 'digital', description: 'Send money with Zelle' },
  { id: 'cashapp', name: 'CashApp', icon: <Smartphone className="w-5 h-5" />, category: 'digital', description: 'Pay with Cash App' },
  { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">₿</div>, category: 'crypto', description: 'Digital currency' },
  { id: 'usdt', name: 'Tether (USDT)', icon: <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">₮</div>, category: 'crypto', description: 'Stable cryptocurrency' },
  { id: 'ethereum', name: 'Ethereum (ETH)', icon: <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">Ξ</div>, category: 'crypto', description: 'Smart contract platform' },
  { id: 'litecoin', name: 'Litecoin (LTC)', icon: <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">Ł</div>, category: 'crypto', description: 'Peer-to-peer cryptocurrency' }
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  availableMethods
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const availableCategories = paymentCategories.filter(category =>
    paymentMethods.some(method => 
      method.category === category.id && availableMethods.includes(method.id)
    )
  );

  const availableMethodsInCategory = paymentMethods.filter(method =>
    method.category === selectedCategory && availableMethods.includes(method.id)
  );

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    onMethodSelect(methodId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Choose Payment Method
        </h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment option
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableCategories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105",
              "border-2 hover:shadow-lg",
              selectedCategory === category.id
                ? "border-primary shadow-lg ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-r mx-auto mb-4",
                "flex items-center justify-center text-white",
                category.gradient
              )}>
                {category.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                {category.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Method Selection */}
      {selectedCategory && (
        <div className="animate-fade-in">
          <h4 className="text-md font-semibold text-foreground mb-4 text-center">
            Select {paymentCategories.find(c => c.id === selectedCategory)?.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableMethodsInCategory.map((method) => (
              <Card
                key={method.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-102",
                  "border hover:shadow-md",
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleMethodSelect(method.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {method.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-foreground truncate">
                      {method.name}
                    </h5>
                    {method.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {method.description}
                      </p>
                    )}
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedMethod && (
        <div className="text-center">
          <Button
            onClick={() => {
              setSelectedCategory(null);
            }}
            variant="outline"
            size="sm"
          >
            Change Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};