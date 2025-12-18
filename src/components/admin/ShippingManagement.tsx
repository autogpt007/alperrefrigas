import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Pencil, Trash2, Truck, Globe, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingZone {
  id: string;
  region_name: string;
  countries: string[];
  base_rate: number;
  free_shipping_threshold: number | null;
  transit_days_min: number;
  transit_days_max: number;
  is_active: boolean;
  hazmat_surcharge: number | null;
  order_index: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ShippingManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState({
    region_name: '',
    countries: '',
    base_rate: 0,
    free_shipping_threshold: 500,
    transit_days_min: 3,
    transit_days_max: 7,
    hazmat_surcharge: 25,
    is_active: true,
    order_index: 0,
    notes: ''
  });

  // Fetch shipping zones
  const { data: zones, isLoading } = useQuery({
    queryKey: ['shipping-zones-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as ShippingZone[];
    }
  });

  // Create zone mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const countriesArray = data.countries.split(',').map(c => c.trim()).filter(Boolean);
      const { error } = await supabase
        .from('shipping_zones')
        .insert({
          region_name: data.region_name,
          countries: countriesArray,
          base_rate: data.base_rate,
          free_shipping_threshold: data.free_shipping_threshold,
          transit_days_min: data.transit_days_min,
          transit_days_max: data.transit_days_max,
          hazmat_surcharge: data.hazmat_surcharge,
          is_active: data.is_active,
          order_index: data.order_index,
          notes: data.notes || null
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones-admin'] });
      toast.success('Shipping zone created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create shipping zone: ' + (error as Error).message);
    }
  });

  // Update zone mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const countriesArray = data.countries.split(',').map(c => c.trim()).filter(Boolean);
      const { error } = await supabase
        .from('shipping_zones')
        .update({
          region_name: data.region_name,
          countries: countriesArray,
          base_rate: data.base_rate,
          free_shipping_threshold: data.free_shipping_threshold,
          transit_days_min: data.transit_days_min,
          transit_days_max: data.transit_days_max,
          hazmat_surcharge: data.hazmat_surcharge,
          is_active: data.is_active,
          order_index: data.order_index,
          notes: data.notes || null
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones-admin'] });
      toast.success('Shipping zone updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update shipping zone: ' + (error as Error).message);
    }
  });

  // Delete zone mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones-admin'] });
      toast.success('Shipping zone deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete shipping zone: ' + (error as Error).message);
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('shipping_zones')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones-admin'] });
      toast.success('Zone status updated');
    }
  });

  const resetForm = () => {
    setFormData({
      region_name: '',
      countries: '',
      base_rate: 0,
      free_shipping_threshold: 500,
      transit_days_min: 3,
      transit_days_max: 7,
      hazmat_surcharge: 25,
      is_active: true,
      order_index: 0,
      notes: ''
    });
    setEditingZone(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setFormData({
      region_name: zone.region_name,
      countries: zone.countries.join(', '),
      base_rate: zone.base_rate,
      free_shipping_threshold: zone.free_shipping_threshold || 500,
      transit_days_min: zone.transit_days_min,
      transit_days_max: zone.transit_days_max,
      hazmat_surcharge: zone.hazmat_surcharge || 25,
      is_active: zone.is_active,
      order_index: zone.order_index,
      notes: zone.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      updateMutation.mutate({ id: editingZone.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Shipping Zones Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure shipping rates, free shipping thresholds, and HazMat surcharges by region
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Shipping Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}</DialogTitle>
              <DialogDescription>
                Configure shipping rates for a specific region or set of countries
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region_name">Region Name</Label>
                  <Input
                    id="region_name"
                    value={formData.region_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, region_name: e.target.value }))}
                    placeholder="e.g., United States, European Union"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countries">Country Codes (comma-separated)</Label>
                  <Input
                    id="countries"
                    value={formData.countries}
                    onChange={(e) => setFormData(prev => ({ ...prev, countries: e.target.value }))}
                    placeholder="e.g., US, CA, GB"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Use * for "Rest of World"</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_rate">Base Rate ($)</Label>
                  <Input
                    id="base_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.base_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_rate: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free_shipping_threshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.free_shipping_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, free_shipping_threshold: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hazmat_surcharge">HazMat Surcharge ($)</Label>
                  <Input
                    id="hazmat_surcharge"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hazmat_surcharge}
                    onChange={(e) => setFormData(prev => ({ ...prev, hazmat_surcharge: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transit_days_min">Min Transit Days</Label>
                  <Input
                    id="transit_days_min"
                    type="number"
                    min="1"
                    value={formData.transit_days_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, transit_days_min: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transit_days_max">Max Transit Days</Label>
                  <Input
                    id="transit_days_max"
                    type="number"
                    min="1"
                    value={formData.transit_days_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, transit_days_max: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_index">Display Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    min="0"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this shipping zone"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingZone ? 'Update Zone' : 'Create Zone'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones?.filter(z => z.is_active).length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Base Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${zones?.length ? (zones.reduce((sum, z) => sum + z.base_rate, 0) / zones.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg HazMat Surcharge</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${zones?.length ? (zones.reduce((sum, z) => sum + (z.hazmat_surcharge || 0), 0) / zones.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zones Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Zones</CardTitle>
          <CardDescription>
            Manage shipping rates and delivery times for different regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading shipping zones...</div>
          ) : zones?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No shipping zones configured. Add your first zone to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Countries</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Free Shipping</TableHead>
                  <TableHead>Transit Time</TableHead>
                  <TableHead>HazMat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones?.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.region_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {zone.countries.slice(0, 5).map((code) => (
                          <Badge key={code} variant="outline" className="text-xs">
                            {code}
                          </Badge>
                        ))}
                        {zone.countries.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{zone.countries.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${zone.base_rate.toFixed(2)}</TableCell>
                    <TableCell>
                      {zone.free_shipping_threshold ? `$${zone.free_shipping_threshold.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell>{zone.transit_days_min}-{zone.transit_days_max} days</TableCell>
                    <TableCell>${(zone.hazmat_surcharge || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={zone.is_active}
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: zone.id, is_active: checked })}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(zone)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this shipping zone?')) {
                              deleteMutation.mutate(zone.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingManagement;
