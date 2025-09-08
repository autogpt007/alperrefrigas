import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { decryptCardData, maskCardNumber } from '@/utils/cardEncryption';
import { formatDistanceToNow } from 'date-fns';

interface SecureCardViewerProps {
  orderId: string;
}

interface CardData {
  id: string;
  cardholder_name: string;
  encrypted_card_number: string;
  encrypted_expiry: string;
  encrypted_cvv: string;
  billing_address: any;
  expires_at: string;
  processed: boolean;
  processed_at: string | null;
  processed_by: string | null;
  created_at: string;
  access_log: any[];
}

const SecureCardViewer: React.FC<SecureCardViewerProps> = ({ orderId }) => {
  const [showFullCard, setShowFullCard] = useState(false);
  const [decryptedData, setDecryptedData] = useState<{
    cardNumber: string;
    expiry: string;
    cvv: string;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch card data
  const { data: cardData, isLoading, error } = useQuery({
    queryKey: ['secure-card', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secure_card_storage')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error) throw error;
      return data as CardData;
    },
  });

  // Decrypt card data when needed
  useEffect(() => {
    if (showFullCard && cardData && !decryptedData) {
      const decryptData = async () => {
        try {
          const [cardNumber, expiry, cvv] = await Promise.all([
            decryptCardData(cardData.encrypted_card_number),
            decryptCardData(cardData.encrypted_expiry),
            decryptCardData(cardData.encrypted_cvv)
          ]);
          
          setDecryptedData({ cardNumber, expiry, cvv });
        } catch (error) {
          console.error('Failed to decrypt card data:', error);
          toast({
            title: "Decryption Error",
            description: "Failed to decrypt card data.",
            variant: "destructive"
          });
        }
      };
      
      decryptData();
    }
  }, [showFullCard, cardData, decryptedData, toast]);

  // Process card mutation
  const processCardMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('secure_card_storage')
        .update({ 
          processed: true, 
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', cardData!.id);
      
      if (error) throw error;
      
      // Log the processing action
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'admin_action',
          details: {
            action: 'card_processed',
            card_id: cardData!.id,
            order_id: orderId
          },
          risk_level: 'medium'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-card', orderId] });
      toast({
        title: "Card Processed",
        description: "Card has been marked as processed."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to process card: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Purge card mutation
  const purgeCardMutation = useMutation({
    mutationFn: async () => {
      // Log the purge action first
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'admin_action',
          details: {
            action: 'card_purged',
            card_id: cardData!.id,
            order_id: orderId
          },
          risk_level: 'high'
        }
      });
      
      const { error } = await supabase
        .from('secure_card_storage')
        .delete()
        .eq('id', cardData!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-card', orderId] });
      toast({
        title: "Card Data Purged",
        description: "Card data has been permanently deleted."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to purge card: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleRevealCard = async () => {
    if (!showFullCard) {
      // Log the view action
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'admin_action',
          details: {
            action: 'card_viewed',
            card_id: cardData!.id,
            order_id: orderId
          },
          risk_level: 'medium'
        }
      });
    }
    setShowFullCard(!showFullCard);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-yellow-500/30">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading card data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !cardData) {
    return (
      <Card className="bg-slate-800 border-gray-500/30">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">No card data found for this order</div>
        </CardContent>
      </Card>
    );
  }

  const isExpired = new Date(cardData.expires_at) < new Date();
  const timeToExpiry = formatDistanceToNow(new Date(cardData.expires_at), { addSuffix: true });

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-yellow-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-yellow-400">
          <span className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Secure Card Storage
          </span>
          <div className="flex gap-2">
            {cardData.processed && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Processed
              </Badge>
            )}
            {isExpired && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                <Clock className="h-3 w-3 mr-1" />
                Expired
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Card Details */}
        <div className="grid gap-4">
          <div>
            <label className="text-gray-400 text-sm">Cardholder Name</label>
            <div className="text-white font-medium">{cardData.cardholder_name}</div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Card Number</label>
            <div className="text-white font-mono flex items-center gap-2">
              {showFullCard && decryptedData ? 
                decryptedData.cardNumber : 
                maskCardNumber(decryptedData?.cardNumber || '••••••••••••••••')
              }
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
                {showFullCard && decryptedData ? 
                  decryptedData.expiry.replace(/(.{2})/, '$1/') : 
                  '••/••'
                }
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm">CVV</label>
              <div className="text-white font-mono">
                {showFullCard && decryptedData ? decryptedData.cvv : '•••'}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="text-gray-400 text-sm">Billing Address</label>
            <div className="text-white text-sm">
              {cardData.billing_address.street}<br />
              {cardData.billing_address.city}, {cardData.billing_address.state} {cardData.billing_address.zip}<br />
              {cardData.billing_address.country}
            </div>
          </div>
        </div>

        {/* Card Status & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            <div>Expires: {timeToExpiry}</div>
            <div>Created: {formatDistanceToNow(new Date(cardData.created_at), { addSuffix: true })}</div>
            {cardData.processed_at && (
              <div>Processed: {formatDistanceToNow(new Date(cardData.processed_at), { addSuffix: true })}</div>
            )}
          </div>
          
          <div className="flex gap-2">
            {!cardData.processed && (
              <Button
                onClick={() => processCardMutation.mutate()}
                disabled={processCardMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {processCardMutation.isPending ? 'Processing...' : 'Mark as Processed'}
              </Button>
            )}
            
            <Button
              onClick={() => purgeCardMutation.mutate()}
              disabled={purgeCardMutation.isPending}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {purgeCardMutation.isPending ? 'Purging...' : 'Purge Card Data'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureCardViewer;