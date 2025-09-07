import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, CreditCard, Shield, Clock, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { decryptCardData, maskCardNumber } from '@/utils/cardEncryption';

interface SecureCardViewerProps {
  orderId: string;
}

const SecureCardViewer: React.FC<SecureCardViewerProps> = ({ orderId }) => {
  const [showFullCard, setShowFullCard] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch secure card data
  const { data: cardData, isLoading, error } = useQuery({
    queryKey: ['secure-card', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secure_card_storage')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  // Mark card as processed
  const processCardMutation = useMutation({
    mutationFn: async () => {
      if (!cardData) throw new Error('No card data found');
      
      // Log access
      await supabase.rpc('log_card_access', {
        card_id: cardData.id,
        action: 'marked_processed'
      });
      
      // Mark as processed
      const { error } = await supabase
        .from('secure_card_storage')
        .update({ 
          processed: true, 
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', cardData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Card marked as processed",
        description: "Card data will be automatically purged within 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ['secure-card', orderId] });
    },
    onError: (error) => {
      toast({
        title: "Error processing card",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Manually purge card data
  const purgeCardMutation = useMutation({
    mutationFn: async () => {
      if (!cardData) throw new Error('No card data found');
      
      // Log access
      await supabase.rpc('log_card_access', {
        card_id: cardData.id,
        action: 'manual_purge'
      });
      
      // Delete card data
      const { error } = await supabase
        .from('secure_card_storage')
        .delete()
        .eq('id', cardData.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Card data purged",
        description: "All sensitive card data has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['secure-card', orderId] });
    },
    onError: (error) => {
      toast({
        title: "Error purging card",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleRevealCard = async () => {
    if (!cardData) return;
    
    // Log access
    await supabase.rpc('log_card_access', {
      card_id: cardData.id,
      action: 'card_details_viewed'
    });
    
    setShowFullCard(!showFullCard);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-400 animate-pulse" />
            <span className="text-gray-300">Loading card data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !cardData) {
    return (
      <Card className="bg-slate-800/50 border-slate-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-gray-400">
            <CreditCard className="h-5 w-5" />
            <span>No card data stored for this order</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isExpired = new Date(cardData.expires_at) < new Date();
  const isProcessed = cardData.processed;
  const daysSinceCreation = Math.floor((new Date().getTime() - new Date(cardData.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          Secure Card Data
          <div className="flex gap-2 ml-auto">
            {isProcessed && <Badge variant="outline" className="text-green-400 border-green-400">Processed</Badge>}
            {isExpired && <Badge variant="outline" className="text-red-400 border-red-400">Expired</Badge>}
            <Badge variant="outline" className="text-amber-400 border-amber-400">
              <Clock className="h-3 w-3 mr-1" />
              Day {daysSinceCreation}/7
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Warning */}
        <Alert className="bg-amber-500/10 border-amber-500/30">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            Card data expires automatically after 7 days. Always mark as processed after payment completion.
          </AlertDescription>
        </Alert>

        {/* Card Information */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Cardholder Name</label>
            <div className="text-white font-medium">{cardData.cardholder_name}</div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Card Number</label>
            <div className="text-white font-mono flex items-center gap-2">
              {showFullCard ? decryptCardData(cardData.encrypted_card_number) : maskCardNumber(decryptCardData(cardData.encrypted_card_number))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRevealCard}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {showFullCard ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Expiry Date</label>
              <div className="text-white font-mono">
                {showFullCard ? 
                  decryptCardData(cardData.encrypted_expiry).replace(/(.{2})/, '$1/') : 
                  '••/••'
                }
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm">CVV</label>
              <div className="text-white font-mono">
                {showFullCard ? decryptCardData(cardData.encrypted_cvv) : '•••'}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="text-gray-400 text-sm">Billing Address</label>
            <div className="text-white text-sm bg-slate-700/50 p-3 rounded">
              {(cardData.billing_address as any)?.street}<br/>
              {(cardData.billing_address as any)?.city}, {(cardData.billing_address as any)?.state} {(cardData.billing_address as any)?.zipCode}<br/>
              {(cardData.billing_address as any)?.country}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-slate-600">
          {!isProcessed && (
            <Button
              onClick={() => processCardMutation.mutate()}
              disabled={processCardMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark as Processed
            </Button>
          )}
          
          <Button
            onClick={() => purgeCardMutation.mutate()}
            disabled={purgeCardMutation.isPending}
            variant="destructive"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Purge Card Data
          </Button>
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-400 pt-2 border-t border-slate-600">
          <div>Created: {new Date(cardData.created_at).toLocaleString()}</div>
          <div>Expires: {new Date(cardData.expires_at).toLocaleString()}</div>
          {cardData.processed_at && (
            <div>Processed: {new Date(cardData.processed_at).toLocaleString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureCardViewer;