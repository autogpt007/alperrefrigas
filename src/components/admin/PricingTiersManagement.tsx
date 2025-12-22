
import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Percent, Save, RefreshCw, TrendingUp, Wind } from 'lucide-react';
import { toast } from 'sonner';

const PricingTiersManagement = () => {
  const { products, updateProduct, loading } = useProducts();
  const [editingPrices, setEditingPrices] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Filter only AC products
  const acProducts = products.filter(p => p.product_type === 'air_conditioner');

  // Initialize editing prices from products
  useEffect(() => {
    const prices: Record<string, any> = {};
    acProducts.forEach(product => {
      prices[product.id] = {
        price: product.price,
        base_unit_price: product.base_unit_price,
        q20_units: product.q20_units,
        q40_units: product.q40_units,
        mid_bulk_uplift_percent: product.mid_bulk_uplift_percent ?? 12,
        custom_uplift_5_19: product.custom_uplift_5_19 ?? 35,
        custom_uplift_20_39: product.custom_uplift_20_39 ?? 25,
        custom_uplift_40_half: product.custom_uplift_40_half ?? 15,
      };
    });
    setEditingPrices(prices);
  }, [products]);

  const handlePriceChange = (productId: string, field: string, value: number) => {
    setEditingPrices(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleSaveProduct = async (productId: string) => {
    setSaving(true);
    try {
      const priceData = editingPrices[productId];
      await updateProduct(productId, priceData);
      toast.success('Pricing updated successfully');
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = acProducts.map(product => 
        updateProduct(product.id, editingPrices[product.id])
      );
      await Promise.all(updates);
      toast.success('All AC pricing updated successfully');
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update some pricing');
    } finally {
      setSaving(false);
    }
  };

  // Calculate tier prices based on base unit price and uplifts
  const calculateTierPrice = (basePrice: number, upliftPercent: number) => {
    return basePrice * (1 + upliftPercent / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-cyan-400" />
            AC Pricing Tiers
          </h1>
          <p className="text-gray-400 mt-1">
            Configure bulk pricing tiers for air conditioner products
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={saving || acProducts.length === 0}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Changes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">{acProducts.length}</div>
            <div className="text-gray-400 text-sm">AC Products</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">
              {acProducts.filter(p => p.base_unit_price && p.q20_units).length}
            </div>
            <div className="text-gray-400 text-sm">With Pricing Configured</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">
              {acProducts.filter(p => !p.base_unit_price || !p.q20_units).length}
            </div>
            <div className="text-gray-400 text-sm">Needs Pricing Setup</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Pricing Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AC Bulk Pricing Tiers
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Set base unit price and quantity-based uplift percentages for each product
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-300">List Price</TableHead>
                  <TableHead className="text-gray-300">Base Unit $</TableHead>
                  <TableHead className="text-gray-300">Q20</TableHead>
                  <TableHead className="text-gray-300">Q40</TableHead>
                  <TableHead className="text-gray-300">5-19 Units</TableHead>
                  <TableHead className="text-gray-300">20-39 Units</TableHead>
                  <TableHead className="text-gray-300">40-Half</TableHead>
                  <TableHead className="text-gray-300">Mid-Bulk</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acProducts.map((product) => {
                  const prices = editingPrices[product.id] || {};
                  const hasConfig = prices.base_unit_price && prices.q20_units;
                  
                  return (
                    <TableRow key={product.id} className="border-slate-600">
                      <TableCell className="text-white font-medium max-w-48">
                        <div className="truncate">{product.name}</div>
                        <div className="flex gap-1 mt-1">
                          {product.btu && (
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                              {product.btu.toLocaleString()} BTU
                            </Badge>
                          )}
                          {!hasConfig && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                              ⚠ No pricing
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={prices.price || ''}
                          onChange={(e) => handlePriceChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={prices.base_unit_price || ''}
                          onChange={(e) => handlePriceChange(product.id, 'base_unit_price', parseFloat(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white w-24"
                          placeholder="$/unit"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={prices.q20_units || ''}
                          onChange={(e) => handlePriceChange(product.id, 'q20_units', parseInt(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white w-16"
                          placeholder="qty"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={prices.q40_units || ''}
                          onChange={(e) => handlePriceChange(product.id, 'q40_units', parseInt(e.target.value) || 0)}
                          className="bg-slate-700 border-slate-600 text-white w-16"
                          placeholder="qty"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={prices.custom_uplift_5_19 || 0}
                            onChange={(e) => handlePriceChange(product.id, 'custom_uplift_5_19', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white w-14"
                          />
                          <Percent className="h-3 w-3 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={prices.custom_uplift_20_39 || 0}
                            onChange={(e) => handlePriceChange(product.id, 'custom_uplift_20_39', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white w-14"
                          />
                          <Percent className="h-3 w-3 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={prices.custom_uplift_40_half || 0}
                            onChange={(e) => handlePriceChange(product.id, 'custom_uplift_40_half', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white w-14"
                          />
                          <Percent className="h-3 w-3 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={prices.mid_bulk_uplift_percent || 0}
                            onChange={(e) => handlePriceChange(product.id, 'mid_bulk_uplift_percent', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white w-14"
                          />
                          <Percent className="h-3 w-3 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSaveProduct(product.id)}
                          disabled={saving}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {acProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Wind className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No air conditioner products found</p>
              <p className="text-sm mt-2">Add AC products first from the AC Products page</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tier Explanation */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">How AC Pricing Tiers Work</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 text-sm space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong className="text-cyan-400">Base Unit Price:</strong> The price per unit at full container quantity (best price for buyer)</p>
              <p className="mt-2"><strong className="text-cyan-400">Q20/Q40:</strong> Number of units that fit in 20ft/40ft containers</p>
            </div>
            <div>
              <p><strong className="text-cyan-400">Uplift %:</strong> Price markup applied for smaller quantity orders</p>
              <p className="mt-2"><strong className="text-cyan-400">Mid-Bulk:</strong> Uplift for orders between half and full container</p>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4 mt-4">
            <p className="text-white font-medium mb-3">Example: Base price $500/unit with default uplifts</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-800 rounded p-2">
                <div className="text-xs text-gray-500">5-19 units (+35%)</div>
                <div className="text-yellow-400 font-medium">$675/unit</div>
              </div>
              <div className="bg-slate-800 rounded p-2">
                <div className="text-xs text-gray-500">20-39 units (+25%)</div>
                <div className="text-yellow-400 font-medium">$625/unit</div>
              </div>
              <div className="bg-slate-800 rounded p-2">
                <div className="text-xs text-gray-500">40-Half Container (+15%)</div>
                <div className="text-yellow-400 font-medium">$575/unit</div>
              </div>
              <div className="bg-slate-800 rounded p-2">
                <div className="text-xs text-gray-500">Full Container</div>
                <div className="text-green-400 font-medium">$500/unit</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTiersManagement;
