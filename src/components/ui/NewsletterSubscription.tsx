import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Mail, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSubscriptionProps {
  className?: string;
  compact?: boolean;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ 
  className = "", 
  compact = false 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      // Submit via secure edge function instead of direct database access
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          email: email.toLowerCase().trim(),
          name: name || '',
          type: 'newsletter'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to subscribe to newsletter');
      }

      if (data?.error) {
        throw new Error(data.error);
      }
    },
    onSuccess: () => {
      setIsSubscribed(true);
      setEmail('');
      setName('');
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about new products and special offers.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    subscribeMutation.mutate({ email, name });
  };

  if (isSubscribed) {
    return (
      <Card className={`bg-green-50 border-green-200 ${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Successfully subscribed!</span>
          </div>
          <p className="text-center text-sm text-green-600 mt-2">
            Thank you for joining our newsletter.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button 
          onClick={handleSubmit}
          disabled={subscribeMutation.isPending || !email.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Mail className="h-4 w-4 mr-2" />
          {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-gray-800 flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Stay Updated with Alper Refrigerants
        </CardTitle>
        <CardDescription className="text-gray-600">
          Get the latest news about new products, special offers, and industry insights delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-300"
              required
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={subscribeMutation.isPending || !email.trim()}
          >
            <Mail className="h-4 w-4 mr-2" />
            {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;