
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  epaApproved: boolean;
  category: string;
  description: string;
  stock: number;
  packaging?: string[];
  applications?: string[];
  sdsUrl?: string;
  // SEO and Google Merchant Center fields
  gtin?: string;
  brand: string;
  condition: 'new' | 'used' | 'refurbished';
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
  shippingWeight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  chemicalFormula?: string;
  casNumber?: string;
  unNumber?: string;
  hazardClass?: string;
  images?: string[];
  technicalSpecs?: Record<string, any>;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load products from Supabase on component mount
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our Product interface
      const transformedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || product.thumbnail_url || '/placeholder.svg',
        images: product.images || [],
        sku: product.sku || '',
        epaApproved: product.epa_approved || false,
        category: product.category || 'HFC',
        description: product.description || '',
        stock: product.stock_quantity || 0,
        packaging: Array.isArray(product.packaging) ? product.packaging : [],
        applications: Array.isArray(product.applications) ? product.applications : [],
        sdsUrl: product.sds_url || '',
        gtin: product.gtin || '',
        brand: product.brand || 'FrigidFlow',
        condition: (product.condition as 'new' | 'used' | 'refurbished') || 'new',
        availability: (product.availability as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder') || 'in_stock',
        shippingWeight: product.shipping_weight || '',
        dimensions: product.dimensions || { length: '', width: '', height: '' },
        chemicalFormula: product.chemical_formula || '',
        casNumber: product.cas_number || '',
        unNumber: product.un_number || '',
        hazardClass: product.hazard_class || '',
        technicalSpecs: product.technical_specs || {}
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      // Transform our Product interface to match Supabase schema
      const supabaseProduct = {
        name: productData.name,
        price: productData.price,
        images: productData.images || (productData.image ? [productData.image] : []),
        thumbnail_url: productData.image,
        sku: productData.sku,
        epa_approved: productData.epaApproved,
        category: productData.category,
        description: productData.description,
        stock_quantity: productData.stock,
        packaging: productData.packaging || [],
        applications: productData.applications || [],
        sds_url: productData.sdsUrl,
        gtin: productData.gtin,
        brand: productData.brand,
        condition: productData.condition,
        availability: productData.availability,
        shipping_weight: productData.shippingWeight,
        dimensions: productData.dimensions,
        chemical_formula: productData.chemicalFormula,
        cas_number: productData.casNumber,
        un_number: productData.unNumber,
        hazard_class: productData.hazardClass,
        technical_specs: productData.technicalSpecs || {}
      };

      const { data, error } = await supabase
        .from('products')
        .insert([supabaseProduct])
        .select()
        .single();

      if (error) throw error;

      // Transform the returned data and add to local state
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        image: data.images?.[0] || data.thumbnail_url || '/placeholder.svg',
        images: data.images || [],
        sku: data.sku || '',
        epaApproved: data.epa_approved || false,
        category: data.category || 'HFC',
        description: data.description || '',
        stock: data.stock_quantity || 0,
        packaging: data.packaging || [],
        applications: data.applications || [],
        sdsUrl: data.sds_url || '',
        gtin: data.gtin || '',
        brand: data.brand || 'FrigidFlow',
        condition: data.condition || 'new',
        availability: data.availability || 'in_stock',
        shippingWeight: data.shipping_weight || '',
        dimensions: data.dimensions || { length: '', width: '', height: '' },
        chemicalFormula: data.chemical_formula || '',
        casNumber: data.cas_number || '',
        unNumber: data.un_number || '',
        hazardClass: data.hazard_class || '',
        technicalSpecs: data.technical_specs || {}
      };

      setProducts(prev => [newProduct, ...prev]);

      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product to database",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Transform updates to match Supabase schema
      const supabaseUpdates: any = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.price !== undefined) supabaseUpdates.price = updates.price;
      if (updates.image !== undefined) supabaseUpdates.thumbnail_url = updates.image;
      if (updates.images !== undefined) supabaseUpdates.images = updates.images;
      if (updates.sku !== undefined) supabaseUpdates.sku = updates.sku;
      if (updates.epaApproved !== undefined) supabaseUpdates.epa_approved = updates.epaApproved;
      if (updates.category !== undefined) supabaseUpdates.category = updates.category;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.stock !== undefined) supabaseUpdates.stock_quantity = updates.stock;
      if (updates.packaging !== undefined) supabaseUpdates.packaging = updates.packaging;
      if (updates.applications !== undefined) supabaseUpdates.applications = updates.applications;
      if (updates.sdsUrl !== undefined) supabaseUpdates.sds_url = updates.sdsUrl;
      if (updates.gtin !== undefined) supabaseUpdates.gtin = updates.gtin;
      if (updates.brand !== undefined) supabaseUpdates.brand = updates.brand;
      if (updates.condition !== undefined) supabaseUpdates.condition = updates.condition;
      if (updates.availability !== undefined) supabaseUpdates.availability = updates.availability;
      if (updates.shippingWeight !== undefined) supabaseUpdates.shipping_weight = updates.shippingWeight;
      if (updates.dimensions !== undefined) supabaseUpdates.dimensions = updates.dimensions;
      if (updates.chemicalFormula !== undefined) supabaseUpdates.chemical_formula = updates.chemicalFormula;
      if (updates.casNumber !== undefined) supabaseUpdates.cas_number = updates.casNumber;
      if (updates.unNumber !== undefined) supabaseUpdates.un_number = updates.unNumber;
      if (updates.hazardClass !== undefined) supabaseUpdates.hazard_class = updates.hazardClass;
      if (updates.technicalSpecs !== undefined) supabaseUpdates.technical_specs = updates.technicalSpecs;

      const { error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setProducts(prev => prev.filter(product => product.id !== id));

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshProducts = async () => {
    setLoading(true);
    await loadProducts();
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      loading, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      refreshProducts 
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
