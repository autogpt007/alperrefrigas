import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, Calendar, Percent, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CouponManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order_amount: '0',
    max_uses: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Coupon[];
    }
  });

  // Create/Update coupon mutation
  const saveMutation = useMutation({
    mutationFn: async (couponData: any) => {
      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: `Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: `Failed to ${editingCoupon ? 'update' : 'create'} coupon`,
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete coupon mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Coupon deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete coupon",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '0',
      max_uses: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setIsCreating(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order_amount: coupon.minimum_order_amount.toString(),
      max_uses: coupon.max_uses?.toString() || '',
      start_date: coupon.start_date.split('T')[0],
      end_date: coupon.end_date?.split('T')[0] || '',
      is_active: coupon.is_active
    });
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code.toUpperCase(),
      title: formData.title,
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      minimum_order_amount: parseFloat(formData.minimum_order_amount),
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      start_date: formData.start_date + 'T00:00:00Z',
      end_date: formData.end_date ? formData.end_date + 'T23:59:59Z' : null,
      is_active: formData.is_active
    };

    saveMutation.mutate(couponData);
  };

  const isExpired = (endDate: string | null) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const isActive = (coupon: Coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const endDate = coupon.end_date ? new Date(coupon.end_date) : null;
    
    return coupon.is_active && 
           startDate <= now && 
           (!endDate || endDate >= now);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Coupon Management</h1>
          <p className="text-gray-300">Create and manage discount coupons</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-slate-800/50 border-cyan-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Coupon Code *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="SAVE15"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="15% Off Summer Sale"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Save 15% on all refrigerants this summer!"
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Discount Type *</Label>
                  <Select value={formData.discount_type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({...formData, discount_type: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Discount Value *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    placeholder={formData.discount_type === 'percentage' ? '15' : '50.00'}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Minimum Order ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({...formData, minimum_order_amount: e.target.value})}
                    placeholder="0.00"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Max Uses</Label>
                  <Input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                    placeholder="Unlimited"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-300">End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="is_active" className="text-gray-300">Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-cyan-500 hover:bg-cyan-600"
                  disabled={saveMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-white">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="py-8 text-center">
              <p className="text-gray-400">No coupons created yet. Create your first coupon to get started!</p>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">{coupon.title}</h3>
                      <Badge 
                        variant={isActive(coupon) ? "default" : "secondary"}
                        className={isActive(coupon) ? "bg-green-500" : "bg-gray-500"}
                      >
                        {isActive(coupon) ? "Active" : isExpired(coupon.end_date) ? "Expired" : "Inactive"}
                      </Badge>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded-lg font-mono text-sm">
                        {coupon.code}
                      </span>
                    </div>
                    
                    {coupon.description && (
                      <p className="text-gray-300 mb-3">{coupon.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Discount:</span>
                        <div className="flex items-center text-white">
                          {coupon.discount_type === 'percentage' ? (
                            <><Percent className="h-4 w-4 mr-1" />{coupon.discount_value}%</>
                          ) : (
                            <><DollarSign className="h-4 w-4 mr-1" />${coupon.discount_value}</>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Min Order:</span>
                        <div className="text-white">${coupon.minimum_order_amount}</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Uses:</span>
                        <div className="text-white">
                          {coupon.current_uses}{coupon.max_uses ? `/${coupon.max_uses}` : '/∞'}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Valid Until:</span>
                        <div className="text-white flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {coupon.end_date ? format(new Date(coupon.end_date), 'MMM dd, yyyy') : 'No expiry'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(coupon.id)}
                      disabled={deleteMutation.isPending}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
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

export default CouponManagement;