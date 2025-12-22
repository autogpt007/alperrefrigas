
import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Percent, Save, RefreshCw, Calculator, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const PricingTiersManagement = () => {
  const { products, updateProduct, loading } = useProducts();
  const [selectedTab, setSelectedTab] = useState<'refrigerants' | 'air_conditioners'>('refrigerants');
  const [editingPrices, setEditingPrices] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Filter products by type
  const refrigerantProducts = products.filter(p => p.product_type === 'refrigerant' || !p.product_type);
  const acProducts = products.filter(p => p.product_type === 'air_conditioner');

  const currentProducts = selectedTab === 'refrigerants' ? refrigerantProducts : acProducts;

  // Initialize editing prices from products
  useEffect(() => {
    const prices: Record<string, any> = {};
    products.forEach(product => {
      prices[product.id] = {
        price: product.price,
        pallet_price: product.pallet_price,
        container_20ft_price: product.container_20ft_price,
        container_40ft_price: product.container_40ft_price,
        discount_20ft: product.discount_20ft ?? 0.30,
        discount_40ft: product.discount_40ft ?? 0.45,
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
      const updates = currentProducts.map(product => 
        updateProduct(product.id, editingPrices[product.id])
      );
      await Promise.all(updates);
      toast.success(`All ${selectedTab} pricing updated successfully`);
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update some pricing');
    } finally {
      setSaving(false);
    }
  };

  const calculateBulkPrice = (basePrice: number, discount: number) => {
    return basePrice * (1 - discount);
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
            Pricing Tiers Management
          </h1>
          <p className="text-gray-400 mt-1">
            Configure bulk pricing, discounts, and tier structures for all products
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Changes
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
        <TabsList className="bg-slate-700">
          <TabsTrigger value="refrigerants" className="data-[state=active]:bg-cyan-600">
            Refrigerants ({refrigerantProducts.length})
          </TabsTrigger>
          <TabsTrigger value="air_conditioners" className="data-[state=active]:bg-cyan-600">
            Air Conditioners ({acProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="refrigerants" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Refrigerant Bulk Pricing
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Set pallet and container prices with automatic discount calculations
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-gray-300">Product</TableHead>
                      <TableHead className="text-gray-300">Unit Price</TableHead>
                      <TableHead className="text-gray-300">Pallet Price</TableHead>
                      <TableHead className="text-gray-300">20ft Container</TableHead>
                      <TableHead className="text-gray-300">40ft Container</TableHead>
                      <TableHead className="text-gray-300">20ft Discount</TableHead>
                      <TableHead className="text-gray-300">40ft Discount</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refrigerantProducts.map((product) => {
                      const prices = editingPrices[product.id] || {};
                      return (
                        <TableRow key={product.id} className="border-slate-600">
                          <TableCell className="text-white font-medium max-w-48">
                            <div className="truncate">{product.name}</div>
                            {product.sku && (
                              <div className="text-gray-500 text-xs">{product.sku}</div>
                            )}
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
                              value={prices.pallet_price || ''}
                              onChange={(e) => handlePriceChange(product.id, 'pallet_price', parseFloat(e.target.value) || 0)}
                              className="bg-slate-700 border-slate-600 text-white w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={prices.container_20ft_price || ''}
                              onChange={(e) => handlePriceChange(product.id, 'container_20ft_price', parseFloat(e.target.value) || 0)}
                              className="bg-slate-700 border-slate-600 text-white w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={prices.container_40ft_price || ''}
                              onChange={(e) => handlePriceChange(product.id, 'container_40ft_price', parseFloat(e.target.value) || 0)}
                              className="bg-slate-700 border-slate-600 text-white w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.01"
                                value={(prices.discount_20ft || 0) * 100}
                                onChange={(e) => handlePriceChange(product.id, 'discount_20ft', (parseFloat(e.target.value) || 0) / 100)}
                                className="bg-slate-700 border-slate-600 text-white w-16"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.01"
                                value={(prices.discount_40ft || 0) * 100}
                                onChange={(e) => handlePriceChange(product.id, 'discount_40ft', (parseFloat(e.target.value) || 0) / 100)}
                                className="bg-slate-700 border-slate-600 text-white w-16"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="air_conditioners" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AC Bulk Pricing Tiers
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Configure base unit prices and quantity-based uplift percentages
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-gray-300">Product</TableHead>
                      <TableHead className="text-gray-300">List Price</TableHead>
                      <TableHead className="text-gray-300">Base Unit</TableHead>
                      <TableHead className="text-gray-300">Q20 Units</TableHead>
                      <TableHead className="text-gray-300">Q40 Units</TableHead>
                      <TableHead className="text-gray-300">5-19 Uplift</TableHead>
                      <TableHead className="text-gray-300">20-39 Uplift</TableHead>
                      <TableHead className="text-gray-300">40+ Uplift</TableHead>
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
                                  No pricing
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
                              className="bg-slate-700 border-slate-600 text-white w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={prices.q40_units || ''}
                              onChange={(e) => handlePriceChange(product.id, 'q40_units', parseInt(e.target.value) || 0)}
                              className="bg-slate-700 border-slate-600 text-white w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={prices.custom_uplift_5_19 || 0}
                                onChange={(e) => handlePriceChange(product.id, 'custom_uplift_5_19', parseFloat(e.target.value) || 0)}
                                className="bg-slate-700 border-slate-600 text-white w-16"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={prices.custom_uplift_20_39 || 0}
                                onChange={(e) => handlePriceChange(product.id, 'custom_uplift_20_39', parseFloat(e.target.value) || 0)}
                                className="bg-slate-700 border-slate-600 text-white w-16"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={prices.custom_uplift_40_half || 0}
                                onChange={(e) => handlePriceChange(product.id, 'custom_uplift_40_half', parseFloat(e.target.value) || 0)}
                                className="bg-slate-700 border-slate-600 text-white w-16"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
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
                <div className="text-center py-8 text-gray-400">
                  No air conditioner products found. Add AC products first.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Tier Explanation */}
          <Card className="bg-slate-800 border-slate-700 mt-4">
            <CardHeader>
              <CardTitle className="text-white text-lg">How AC Pricing Tiers Work</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-400 text-sm space-y-2">
              <p><strong className="text-cyan-400">Base Unit Price:</strong> The price per unit at full container quantity (best price)</p>
              <p><strong className="text-cyan-400">Q20/Q40 Units:</strong> Number of units that fit in 20ft/40ft containers</p>
              <p><strong className="text-cyan-400">Uplift Percentages:</strong> Price markup applied for smaller quantity orders</p>
              <div className="bg-slate-700/50 rounded p-3 mt-3">
                <p className="text-white mb-2">Example: Base price $500/unit</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>5-19 units: $500 × 1.35 = <span className="text-yellow-400">$675/unit</span></li>
                  <li>20-39 units: $500 × 1.25 = <span className="text-yellow-400">$625/unit</span></li>
                  <li>40+ units: $500 × 1.15 = <span className="text-yellow-400">$575/unit</span></li>
                  <li>Full container: <span className="text-green-400">$500/unit</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingTiersManagement;
