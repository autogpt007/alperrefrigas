import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface PaymentWallet {
  id: string;
  payment_type: string;
  wallet_address: string;
  qr_code_url: string | null;
  label: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PAYMENT_TYPES = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)' },
  { value: 'ethereum', label: 'Ethereum (ETH)' },
  { value: 'usdt', label: 'Tether (USDT)' },
  { value: 'litecoin', label: 'Litecoin (LTC)' },
  { value: 'cashapp', label: 'CashApp' },
  { value: 'zelle', label: 'Zelle' }
];

const PaymentManagement = () => {
  const [wallets, setWallets] = useState<PaymentWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWallet, setEditingWallet] = useState<PaymentWallet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    payment_type: '',
    wallet_address: '',
    label: '',
    is_active: true
  });
  const [generateQR, setGenerateQR] = useState(false);
  const [showAddresses, setShowAddresses] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_wallet_addresses')
        .select('*')
        .order('payment_type', { ascending: true });

      if (error) {
        console.error('Error fetching wallets:', error);
        return;
      }

      setWallets(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (address: string): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(address, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payment_type || !formData.wallet_address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      let qrCodeUrl = null;
      if (generateQR && formData.wallet_address) {
        qrCodeUrl = await generateQRCode(formData.wallet_address);
      }

      const walletData = {
        ...formData,
        qr_code_url: qrCodeUrl
      };

      if (editingWallet) {
        // Update existing wallet
        const { error } = await supabase
          .from('payment_wallet_addresses')
          .update(walletData)
          .eq('id', editingWallet.id);

        if (error) {
          console.error('Error updating wallet:', error);
          toast({
            title: "Error",
            description: "Failed to update payment method",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Payment method updated successfully",
        });
      } else {
        // Create new wallet
        const { error } = await supabase
          .from('payment_wallet_addresses')
          .insert([walletData]);

        if (error) {
          console.error('Error creating wallet:', error);
          toast({
            title: "Error",
            description: "Failed to create payment method",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Payment method created successfully",
        });
      }

      // Reset form and refresh data
      setFormData({
        payment_type: '',
        wallet_address: '',
        label: '',
        is_active: true
      });
      setEditingWallet(null);
      setIsDialogOpen(false);
      setGenerateQR(false);
      await fetchWallets();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wallet: PaymentWallet) => {
    setEditingWallet(wallet);
    setFormData({
      payment_type: wallet.payment_type,
      wallet_address: wallet.wallet_address,
      label: wallet.label || '',
      is_active: wallet.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (walletId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('payment_wallet_addresses')
        .delete()
        .eq('id', walletId);

      if (error) {
        console.error('Error deleting wallet:', error);
        toast({
          title: "Error",
          description: "Failed to delete payment method",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });

      await fetchWallets();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleAddressVisibility = (walletId: string) => {
    setShowAddresses(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const maskAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getPaymentTypeLabel = (type: string) => {
    const paymentType = PAYMENT_TYPES.find(pt => pt.value === type);
    return paymentType?.label || type.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Manage cryptocurrency wallet addresses and payment methods
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingWallet(null);
              setFormData({
                payment_type: '',
                wallet_address: '',
                label: '',
                is_active: true
              });
              setGenerateQR(false);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingWallet ? 'Edit Payment Method' : 'Add Payment Method'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="payment_type">Payment Type *</Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wallet_address">
                  {formData.payment_type.includes('app') || formData.payment_type === 'zelle' 
                    ? 'Tag/Username *' 
                    : 'Wallet Address *'
                  }
                </Label>
                <Textarea
                  id="wallet_address"
                  value={formData.wallet_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, wallet_address: e.target.value }))}
                  placeholder={
                    formData.payment_type.includes('app') || formData.payment_type === 'zelle'
                      ? 'Enter your tag/username'
                      : 'Enter wallet address'
                  }
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Main Bitcoin Wallet"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="generate_qr"
                  checked={generateQR}
                  onCheckedChange={setGenerateQR}
                />
                <Label htmlFor="generate_qr" className="flex items-center">
                  <QrCode className="h-4 w-4 mr-1" />
                  Generate QR Code
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {editingWallet ? 'Update' : 'Create'} Payment Method
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {wallets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payment methods configured yet.</p>
                <p className="text-sm">Add your first payment method to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <Card key={wallet.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {getPaymentTypeLabel(wallet.payment_type)}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={wallet.is_active ? "default" : "secondary"}>
                      {wallet.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {wallet.qr_code_url && (
                      <Badge variant="outline">
                        <QrCode className="h-3 w-3 mr-1" />
                        QR
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {wallet.payment_type.includes('app') || wallet.payment_type === 'zelle' 
                        ? 'Tag/Username:' 
                        : 'Address:'
                      }
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                        {showAddresses[wallet.id] 
                          ? wallet.wallet_address 
                          : maskAddress(wallet.wallet_address)
                        }
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAddressVisibility(wallet.id)}
                      >
                        {showAddresses[wallet.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {wallet.label && (
                    <div>
                      <Label className="text-sm font-medium">Label:</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {wallet.label}
                      </p>
                    </div>
                  )}

                  {wallet.qr_code_url && (
                    <div>
                      <Label className="text-sm font-medium">QR Code:</Label>
                      <div className="mt-2 inline-block">
                        <img
                          src={wallet.qr_code_url}
                          alt="QR Code"
                          className="w-24 h-24 border rounded"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(wallet)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(wallet.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;