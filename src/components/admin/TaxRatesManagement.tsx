import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calculator, Search, Edit2, RefreshCw, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StateTaxRate {
  id: string;
  state_code: string;
  state_name: string;
  tax_rate: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const TaxRatesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingState, setEditingState] = useState<StateTaxRate | null>(null);
  const [editFormData, setEditFormData] = useState({
    tax_rate: '',
    notes: '',
    is_active: true,
  });

  // Fetch all tax rates
  const { data: taxRates, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-tax-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('state_tax_rates')
        .select('*')
        .order('state_name');

      if (error) throw error;
      return data as StateTaxRate[];
    },
  });

  // Update tax rate mutation
  const updateMutation = useMutation({
    mutationFn: async (updates: { id: string; tax_rate: number; notes: string | null; is_active: boolean }) => {
      const { error } = await supabase
        .from('state_tax_rates')
        .update({
          tax_rate: updates.tax_rate,
          notes: updates.notes,
          is_active: updates.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updates.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tax-rates'] });
      queryClient.invalidateQueries({ queryKey: ['tax-rate'] });
      toast.success('Tax rate updated successfully');
      setEditingState(null);
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update tax rate');
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('state_tax_rates')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tax-rates'] });
      queryClient.invalidateQueries({ queryKey: ['tax-rate'] });
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  // Filter tax rates by search term
  const filteredRates = taxRates?.filter(
    (rate) =>
      rate.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.state_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit dialog open
  const handleEditClick = (state: StateTaxRate) => {
    setEditingState(state);
    setEditFormData({
      tax_rate: state.tax_rate.toString(),
      notes: state.notes || '',
      is_active: state.is_active,
    });
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingState) return;

    const taxRate = parseFloat(editFormData.tax_rate);
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      toast.error('Tax rate must be between 0 and 100');
      return;
    }

    updateMutation.mutate({
      id: editingState.id,
      tax_rate: taxRate,
      notes: editFormData.notes.trim() || null,
      is_active: editFormData.is_active,
    });
  };

  // Calculate statistics
  const stats = {
    total: taxRates?.length || 0,
    active: taxRates?.filter((r) => r.is_active).length || 0,
    noTax: taxRates?.filter((r) => r.tax_rate === 0).length || 0,
    avgRate: taxRates?.length
      ? (taxRates.filter((r) => r.tax_rate > 0).reduce((sum, r) => sum + r.tax_rate, 0) /
          taxRates.filter((r) => r.tax_rate > 0).length).toFixed(2)
      : '0',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load tax rates. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            State Tax Rates Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage sales tax rates for all US states and territories
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-gray-400">Total States/Territories</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <p className="text-sm text-gray-400">Active Tax Jurisdictions</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-cyan-400">{stats.noTax}</div>
            <p className="text-sm text-gray-400">No Sales Tax States</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">{stats.avgRate}%</div>
            <p className="text-sm text-gray-400">Average Tax Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-900/30 border-blue-700">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          Tax rates shown are state-level rates only. Local taxes may apply and vary by jurisdiction. 
          These rates are used for order calculations at checkout. Changes take effect immediately.
        </AlertDescription>
      </Alert>

      {/* Search and Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tax Rates by State</CardTitle>
          <CardDescription className="text-gray-400">
            Click on a state to edit its tax rate or toggle its active status
          </CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by state name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">State</TableHead>
                  <TableHead className="text-gray-300">Code</TableHead>
                  <TableHead className="text-gray-300 text-right">Tax Rate</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Notes</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRates?.map((rate) => (
                  <TableRow key={rate.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell className="text-white font-medium">{rate.state_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-500 text-gray-300">
                        {rate.state_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {rate.tax_rate === 0 ? (
                        <Badge className="bg-green-600/20 text-green-400">No Tax</Badge>
                      ) : (
                        <span className="text-cyan-400 font-mono">{rate.tax_rate.toFixed(3)}%</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rate.is_active}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({ id: rate.id, is_active: checked })
                        }
                        disabled={toggleActiveMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-gray-400 text-sm">
                      {rate.notes || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(rate)}
                        className="text-gray-300 hover:text-white"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRates?.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No states found matching "{searchTerm}"
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingState} onOpenChange={() => setEditingState(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Edit Tax Rate - {editingState?.state_name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the tax rate and settings for {editingState?.state_code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tax_rate" className="text-gray-300">
                Tax Rate (%)
              </Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.001"
                min="0"
                max="100"
                value={editFormData.tax_rate}
                onChange={(e) => setEditFormData({ ...editFormData, tax_rate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 6.25"
              />
              <p className="text-xs text-gray-500">Enter the percentage (e.g., 6.25 for 6.25%)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., State rate only, local rates may apply"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="is_active" className="text-gray-300">
                  Active Status
                </Label>
                <p className="text-xs text-gray-500">
                  Inactive states won't be used for tax calculations
                </p>
              </div>
              <Switch
                id="is_active"
                checked={editFormData.is_active}
                onCheckedChange={(checked) =>
                  setEditFormData({ ...editFormData, is_active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingState(null)}
              className="border-slate-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {updateMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxRatesManagement;
