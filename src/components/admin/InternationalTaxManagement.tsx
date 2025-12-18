import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Globe, Percent, Edit, Save, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InternationalTaxRate {
  id: string;
  country_code: string;
  country_name: string;
  tax_type: string;
  tax_rate: number;
  region: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const InternationalTaxManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InternationalTaxRate>>({});

  // Fetch all international tax rates
  const { data: taxRates, isLoading } = useQuery({
    queryKey: ['international-tax-rates-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('international_tax_rates')
        .select('*')
        .order('region')
        .order('country_name');
      
      if (error) throw error;
      return data as InternationalTaxRate[];
    },
  });

  // Update tax rate mutation
  const updateTaxRate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InternationalTaxRate> }) => {
      const { data, error } = await supabase
        .from('international_tax_rates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['international-tax-rates-admin'] });
      toast.success('Tax rate updated successfully');
      setEditingId(null);
      setEditForm({});
    },
    onError: (error) => {
      console.error('Error updating tax rate:', error);
      toast.error('Failed to update tax rate');
    },
  });

  // Toggle active status
  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('international_tax_rates')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['international-tax-rates-admin'] });
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const startEditing = (rate: InternationalTaxRate) => {
    setEditingId(rate.id);
    setEditForm({
      tax_rate: rate.tax_rate,
      notes: rate.notes,
    });
  };

  const saveEdit = (id: string) => {
    updateTaxRate.mutate({ id, updates: editForm });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Group tax rates by region
  const groupedRates = taxRates?.reduce((acc, rate) => {
    if (!acc[rate.region]) {
      acc[rate.region] = [];
    }
    acc[rate.region].push(rate);
    return acc;
  }, {} as Record<string, InternationalTaxRate[]>) || {};

  const getRegionLabel = (region: string) => {
    switch (region) {
      case 'EU': return 'European Union (VAT)';
      case 'UK': return 'United Kingdom (VAT)';
      case 'AU': return 'Australia (GST)';
      case 'US': return 'United States (State Sales Tax)';
      default: return region;
    }
  };

  const getRegionBadgeColor = (region: string) => {
    switch (region) {
      case 'EU': return 'bg-blue-100 text-blue-800';
      case 'UK': return 'bg-red-100 text-red-800';
      case 'AU': return 'bg-green-100 text-green-800';
      case 'US': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTaxTable = (rates: InternationalTaxRate[], region: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Country</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Tax Type</TableHead>
          <TableHead className="text-right">Rate (%)</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-center">Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((rate) => (
          <TableRow key={rate.id}>
            <TableCell className="font-medium">{rate.country_name}</TableCell>
            <TableCell>
              <Badge variant="outline">{rate.country_code}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={getRegionBadgeColor(region)}>
                {rate.tax_type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {editingId === rate.id ? (
                <Input
                  type="number"
                  step="0.01"
                  className="w-20 text-right"
                  value={editForm.tax_rate || ''}
                  onChange={(e) => setEditForm({ ...editForm, tax_rate: parseFloat(e.target.value) })}
                />
              ) : (
                <span className="font-mono">{rate.tax_rate.toFixed(2)}%</span>
              )}
            </TableCell>
            <TableCell className="max-w-[200px]">
              {editingId === rate.id ? (
                <Input
                  className="w-full"
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Notes..."
                />
              ) : (
                <span className="text-sm text-muted-foreground truncate block">
                  {rate.notes || '-'}
                </span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Switch
                checked={rate.is_active}
                onCheckedChange={(checked) => toggleActive.mutate({ id: rate.id, isActive: checked })}
              />
            </TableCell>
            <TableCell className="text-right">
              {editingId === rate.id ? (
                <div className="flex gap-2 justify-end">
                  <Button size="sm" onClick={() => saveEdit(rate.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => startEditing(rate)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">International Tax Rates</h1>
          <p className="text-muted-foreground">Manage VAT, GST, and sales tax rates for international orders</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Globe className="h-4 w-4 mr-2" />
          {taxRates?.length || 0} Countries
        </Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Tax rates are automatically applied at checkout based on the customer's country. 
          US orders use state-based sales tax calculated from ZIP code. 
          EU/UK/AU orders use the rates configured below.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">EU Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupedRates['EU']?.length || 0}</div>
            <p className="text-xs text-muted-foreground">VAT rates 17-27%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">UK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20%</div>
            <p className="text-xs text-muted-foreground">Standard VAT rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Australia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10%</div>
            <p className="text-xs text-muted-foreground">GST rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(taxRates?.filter(r => r.is_active).map(r => r.region)).size}
            </div>
            <p className="text-xs text-muted-foreground">of 4 total regions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="EU" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="EU" className="flex items-center gap-2">
            🇪🇺 EU ({groupedRates['EU']?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="UK" className="flex items-center gap-2">
            🇬🇧 UK
          </TabsTrigger>
          <TabsTrigger value="AU" className="flex items-center gap-2">
            🇦🇺 Australia
          </TabsTrigger>
          <TabsTrigger value="US" className="flex items-center gap-2">
            🇺🇸 US
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedRates).map(([region, rates]) => (
          <TabsContent key={region} value={region}>
            <Card>
              <CardHeader>
                <CardTitle>{getRegionLabel(region)}</CardTitle>
                <CardDescription>
                  {region === 'US' 
                    ? 'US tax is calculated per state based on ZIP code. Configure state rates in Tax Rates management.'
                    : `Manage ${rates[0]?.tax_type || 'tax'} rates for ${region} countries`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {region === 'US' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      US state sales tax rates are managed separately. The US entry here is a placeholder - 
                      actual tax calculation uses ZIP code lookup to determine state-specific rates.
                      <Button variant="link" className="p-0 ml-2 h-auto" onClick={() => window.location.href = '/admin/tax-rates'}>
                        Manage US State Tax Rates →
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  renderTaxTable(rates, region)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InternationalTaxManagement;
