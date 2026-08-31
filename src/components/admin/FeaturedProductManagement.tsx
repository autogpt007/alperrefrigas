import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, Package, Star, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  epa_approved: boolean;
}

interface FeaturedProduct {
  id: string;
  product_id: string;
  section_name: string;
  order_index: number;
  is_active: boolean;
  products: Product;
}

const FeaturedProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const sections = [
    { value: 'homepage_inventory', label: 'Homepage Inventory Section' },
    { value: 'featured', label: 'Featured Products Section' },
    { value: 'recommended', label: 'Recommended Products' },
    { value: 'trending', label: 'Trending Products' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, category, epa_approved')
        .order('name');

      if (productsError) throw productsError;

      // Fetch featured products with product details
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_products')
        .select(`
          id,
          product_id,
          section_name,
          order_index,
          is_active,
          products (
            id,
            name,
            price,
            category,
            epa_approved
          )
        `)
        .order('section_name, order_index');

      if (featuredError) throw featuredError;

      setProducts(productsData || []);
      setFeaturedProducts(featuredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeaturedProduct = async (productId: string, sectionName: string) => {
    try {
      setSaving(true);
      
      // Get the next order index for this section
      const sectionProducts = featuredProducts.filter(fp => fp.section_name === sectionName);
      const nextOrderIndex = sectionProducts.length > 0 
        ? Math.max(...sectionProducts.map(fp => fp.order_index)) + 1 
        : 0;

      const { data, error } = await supabase
        .from('featured_products')
        .insert({
          product_id: productId,
          section_name: sectionName,
          order_index: nextOrderIndex,
          is_active: true
        })
        .select(`
          id,
          product_id,
          section_name,
          order_index,
          is_active,
          products (
            id,
            name,
            price,
            category,
            epa_approved
          )
        `)
        .single();

      if (error) throw error;

      setFeaturedProducts(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Product added to featured section",
      });
    } catch (error: any) {
      console.error('Error adding featured product:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "This product is already featured in this section"
          : "Failed to add featured product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const removeFeaturedProduct = async (featuredProductId: string) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('featured_products')
        .delete()
        .eq('id', featuredProductId);

      if (error) throw error;

      setFeaturedProducts(prev => prev.filter(fp => fp.id !== featuredProductId));
      
      toast({
        title: "Success",
        description: "Product removed from featured section",
      });
    } catch (error) {
      console.error('Error removing featured product:', error);
      toast({
        title: "Error",
        description: "Failed to remove featured product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFeaturedProduct = async (featuredProductId: string, updates: Partial<FeaturedProduct>) => {
    try {
      setSaving(true);
      
      const { products: _omitProducts, ...dbUpdates } = updates as Partial<FeaturedProduct> & { products?: unknown };

      const { error } = await supabase
        .from('featured_products')
        .update(dbUpdates)
        .eq('id', featuredProductId);


      if (error) throw error;

      setFeaturedProducts(prev => 
        prev.map(fp => 
          fp.id === featuredProductId 
            ? { ...fp, ...updates }
            : fp
        )
      );
      
      toast({
        title: "Success",
        description: "Featured product updated",
      });
    } catch (error) {
      console.error('Error updating featured product:', error);
      toast({
        title: "Error",
        description: "Failed to update featured product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getProductsBySection = (sectionName: string) => {
    return featuredProducts
      .filter(fp => fp.section_name === sectionName)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const getAvailableProducts = (sectionName: string) => {
    const usedProductIds = featuredProducts
      .filter(fp => fp.section_name === sectionName)
      .map(fp => fp.product_id);
    
    return products.filter(p => !usedProductIds.includes(p.id));
  };

  if (loading) {
    return <div className="p-6 text-white">Loading featured products...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Featured Products Management</h1>
        <p className="text-gray-300">
          Control which products appear in specific sections across the website
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => {
          const sectionProducts = getProductsBySection(section.value);
          const availableProducts = getAvailableProducts(section.value);

          return (
            <Card key={section.value} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {section.label}
                  <Badge variant="secondary" className="ml-auto">
                    {sectionProducts.length} products
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Product Form */}
                <div className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-gray-300">Add Product to Section</Label>
                    <Select onValueChange={(productId) => addFeaturedProduct(productId, section.value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select a product to add..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center gap-2">
                              <span>{product.name}</span>
                              {product.epa_approved && (
                                <Badge variant="outline" className="text-xs">EPA</Badge>
                              )}
                              <span className="text-gray-400">${product.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Featured Products List */}
                {sectionProducts.length > 0 ? (
                  <div className="space-y-4">
                    {sectionProducts.map((featuredProduct, index) => (
                      <div
                        key={featuredProduct.id}
                        className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{featuredProduct.products.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-300">${featuredProduct.products.price}</span>
                            <Badge variant="outline" className="text-xs">
                              {featuredProduct.products.category}
                            </Badge>
                            {featuredProduct.products.epa_approved && (
                              <Badge className="text-xs bg-green-500/20 text-green-300">EPA Approved</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Label className="text-gray-300">Order</Label>
                          <Input
                            type="number"
                            value={featuredProduct.order_index}
                            onChange={(e) => updateFeaturedProduct(featuredProduct.id, { 
                              order_index: parseInt(e.target.value) || 0 
                            })}
                            className="w-20 bg-slate-600 border-slate-500 text-white"
                            min="0"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-gray-300">Active</Label>
                          <Switch
                            checked={featuredProduct.is_active}
                            onCheckedChange={(checked) => updateFeaturedProduct(featuredProduct.id, { 
                              is_active: checked 
                            })}
                          />
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeaturedProduct(featuredProduct.id)}
                          disabled={saving}
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products featured in this section yet.</p>
                    <p className="text-sm">Add products above to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="bg-slate-800/50 border-slate-700 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            How Featured Products Work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• <strong>Homepage Inventory Section:</strong> Controls which product badges appear in the main SEO content section</p>
          <p>• <strong>Featured Products Section:</strong> Controls the main featured products displayed on the homepage</p>
          <p>• <strong>Order Index:</strong> Lower numbers appear first (0, 1, 2, etc.)</p>
          <p>• <strong>Active Toggle:</strong> Only active products are displayed on the website</p>
          <p>• Products can be featured in multiple sections simultaneously</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProductManagement;