
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  price: number;
  pallet_price?: number;
  container_20ft_price?: number;
  container_40ft_price?: number;
  discount_20ft?: number;
  discount_40ft?: number;
  packaging_options?: string[];
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
  mpn?: string;
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
  product_type: 'refrigerant' | 'accessory' | 'air_conditioner';
  // AC Bulk Pricing fields
  q20_units?: number;
  q40_units?: number;
  mid_bulk_uplift_percent?: number;
  custom_uplift_5_19?: number;
  custom_uplift_20_39?: number;
  custom_uplift_40_half?: number;
  base_unit_price?: number;
  google_product_category?: string;
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  identifier_exists?: boolean;
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

// Helper function to safely convert Json arrays to string arrays
const jsonToStringArray = (jsonValue: any): string[] => {
  if (!jsonValue) return [];
  if (Array.isArray(jsonValue)) {
    return jsonValue.filter(item => typeof item === 'string');
  }
  return [];
};

// Helper function to safely convert Json to Record<string, any>
const jsonToRecord = (jsonValue: any): Record<string, any> => {
  if (!jsonValue) return {};
  if (typeof jsonValue === 'object' && jsonValue !== null && !Array.isArray(jsonValue)) {
    return jsonValue as Record<string, any>;
  }
  return {};
};

// Helper function to safely convert Json to dimensions object
const jsonToDimensions = (jsonValue: any): { length: string; width: string; height: string } => {
  const defaultDimensions = { length: '', width: '', height: '' };
  if (!jsonValue || typeof jsonValue !== 'object') return defaultDimensions;
  
  return {
    length: typeof jsonValue.length === 'string' ? jsonValue.length : '',
    width: typeof jsonValue.width === 'string' ? jsonValue.width : '',
    height: typeof jsonValue.height === 'string' ? jsonValue.height : ''
  };
};

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
        pallet_price: product.pallet_price ? Number(product.pallet_price) : undefined,
        container_20ft_price: product.container_20ft_price ? Number(product.container_20ft_price) : undefined,
        container_40ft_price: product.container_40ft_price ? Number(product.container_40ft_price) : undefined,
        discount_20ft: product.discount_20ft ? Number(product.discount_20ft) : undefined,
        discount_40ft: product.discount_40ft ? Number(product.discount_40ft) : undefined,
        packaging_options: jsonToStringArray(product.packaging_options),
        image: product.images?.[0] || product.thumbnail_url || '/placeholder.svg',
        images: Array.isArray(product.images) ? product.images.filter(img => typeof img === 'string') : [],
        sku: product.sku || '',
        epaApproved: product.epa_approved || false,
        category: product.category || 'HFC',
        description: product.description || '',
        stock: product.stock_quantity || 0,
        packaging: jsonToStringArray(product.packaging),
        applications: jsonToStringArray(product.applications),
        sdsUrl: product.sds_url || '',
        gtin: product.gtin || '',
        brand: product.brand || 'FrigidFlow',
        condition: (product.condition as 'new' | 'used' | 'refurbished') || 'new',
        availability: (product.availability as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder') || 'in_stock',
        shippingWeight: product.shipping_weight || '',
        dimensions: jsonToDimensions(product.dimensions),
        chemicalFormula: product.chemical_formula || '',
        casNumber: product.cas_number || '',
        unNumber: product.un_number || '',
        hazardClass: product.hazard_class || '',
        technicalSpecs: jsonToRecord(product.technical_specs),
        product_type: (product.product_type as 'refrigerant' | 'accessory' | 'air_conditioner') || 'refrigerant',
        // AC Bulk Pricing fields
        q20_units: product.q20_units ?? undefined,
        q40_units: product.q40_units ?? undefined,
        mid_bulk_uplift_percent: product.mid_bulk_uplift_percent ? Number(product.mid_bulk_uplift_percent) : 12,
        custom_uplift_5_19: product.custom_uplift_5_19 ? Number(product.custom_uplift_5_19) : 35,
        custom_uplift_20_39: product.custom_uplift_20_39 ? Number(product.custom_uplift_20_39) : 25,
        custom_uplift_40_half: product.custom_uplift_40_half ? Number(product.custom_uplift_40_half) : 15,
        base_unit_price: product.base_unit_price ? Number(product.base_unit_price) : undefined,
        mpn: product.mpn || '',
        google_product_category: product.google_product_category || '',
        weight_kg: product.weight_kg ? Number(product.weight_kg) : undefined,
        length_cm: product.length_cm ? Number(product.length_cm) : undefined,
        width_cm: product.width_cm ? Number(product.width_cm) : undefined,
        height_cm: product.height_cm ? Number(product.height_cm) : undefined,
        identifier_exists: product.identifier_exists ?? true
      }))

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
        technical_specs: productData.technicalSpecs || {},
        product_type: productData.product_type,
        // AC Bulk Pricing fields
        q20_units: productData.q20_units,
        q40_units: productData.q40_units,
        mid_bulk_uplift_percent: productData.mid_bulk_uplift_percent,
        custom_uplift_5_19: productData.custom_uplift_5_19,
        custom_uplift_20_39: productData.custom_uplift_20_39,
        custom_uplift_40_half: productData.custom_uplift_40_half,
        base_unit_price: productData.base_unit_price,
        mpn: productData.mpn,
        google_product_category: productData.google_product_category,
        weight_kg: productData.weight_kg,
        length_cm: productData.length_cm,
        width_cm: productData.width_cm,
        height_cm: productData.height_cm,
        identifier_exists: productData.identifier_exists
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
        images: Array.isArray(data.images) ? data.images.filter(img => typeof img === 'string') : [],
        sku: data.sku || '',
        epaApproved: data.epa_approved || false,
        category: data.category || 'HFC',
        description: data.description || '',
        stock: data.stock_quantity || 0,
        packaging: jsonToStringArray(data.packaging),
        applications: jsonToStringArray(data.applications),
        sdsUrl: data.sds_url || '',
        gtin: data.gtin || '',
        brand: data.brand || 'FrigidFlow',
        condition: (data.condition as 'new' | 'used' | 'refurbished') || 'new',
        availability: (data.availability as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder') || 'in_stock',
        shippingWeight: data.shipping_weight || '',
        dimensions: jsonToDimensions(data.dimensions),
        chemicalFormula: data.chemical_formula || '',
        casNumber: data.cas_number || '',
        unNumber: data.un_number || '',
        hazardClass: data.hazard_class || '',
        technicalSpecs: jsonToRecord(data.technical_specs),
        product_type: (data.product_type as 'refrigerant' | 'accessory' | 'air_conditioner') || 'refrigerant',
        q20_units: data.q20_units ?? undefined,
        q40_units: data.q40_units ?? undefined,
        mid_bulk_uplift_percent: data.mid_bulk_uplift_percent ? Number(data.mid_bulk_uplift_percent) : 12,
        custom_uplift_5_19: data.custom_uplift_5_19 ? Number(data.custom_uplift_5_19) : 35,
        custom_uplift_20_39: data.custom_uplift_20_39 ? Number(data.custom_uplift_20_39) : 25,
        custom_uplift_40_half: data.custom_uplift_40_half ? Number(data.custom_uplift_40_half) : 15,
        base_unit_price: data.base_unit_price ? Number(data.base_unit_price) : undefined,
        mpn: data.mpn || '',
        google_product_category: data.google_product_category || '',
        weight_kg: data.weight_kg ? Number(data.weight_kg) : undefined,
        length_cm: data.length_cm ? Number(data.length_cm) : undefined,
        width_cm: data.width_cm ? Number(data.width_cm) : undefined,
        height_cm: data.height_cm ? Number(data.height_cm) : undefined,
        identifier_exists: data.identifier_exists ?? true
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
      if (updates.product_type !== undefined) supabaseUpdates.product_type = updates.product_type;
      // AC Bulk Pricing fields
      if (updates.q20_units !== undefined) supabaseUpdates.q20_units = updates.q20_units;
      if (updates.q40_units !== undefined) supabaseUpdates.q40_units = updates.q40_units;
      if (updates.mid_bulk_uplift_percent !== undefined) supabaseUpdates.mid_bulk_uplift_percent = updates.mid_bulk_uplift_percent;
      if (updates.custom_uplift_5_19 !== undefined) supabaseUpdates.custom_uplift_5_19 = updates.custom_uplift_5_19;
      if (updates.custom_uplift_20_39 !== undefined) supabaseUpdates.custom_uplift_20_39 = updates.custom_uplift_20_39;
      if (updates.custom_uplift_40_half !== undefined) supabaseUpdates.custom_uplift_40_half = updates.custom_uplift_40_half;
      if (updates.base_unit_price !== undefined) supabaseUpdates.base_unit_price = updates.base_unit_price;
      if (updates.mpn !== undefined) supabaseUpdates.mpn = updates.mpn;
      if (updates.google_product_category !== undefined) supabaseUpdates.google_product_category = updates.google_product_category;
      if (updates.weight_kg !== undefined) supabaseUpdates.weight_kg = updates.weight_kg;
      if (updates.length_cm !== undefined) supabaseUpdates.length_cm = updates.length_cm;
      if (updates.width_cm !== undefined) supabaseUpdates.width_cm = updates.width_cm;
      if (updates.height_cm !== undefined) supabaseUpdates.height_cm = updates.height_cm;
      if (updates.identifier_exists !== undefined) supabaseUpdates.identifier_exists = updates.identifier_exists;

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
