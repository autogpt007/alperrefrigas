import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'r410a',
      name: 'Refrigerant R-410A',
      price: 89.99,
      image: '/placeholder.svg',
      sku: 'R410A-30LB',
      epaApproved: true,
      category: 'HFC',
      description: 'High-efficiency, non-ozone-depleting HFC refrigerant for modern air-conditioning systems.',
      stock: 50,
      packaging: ['Pallet (48 cylinders)', 'Container (900 cylinders)', 'Bulk Tank (1000 lbs)'],
      applications: ['Residential AC', 'Commercial HVAC', 'Heat Pumps'],
      sdsUrl: '/placeholder.svg' // Placeholder SDS URL
    },
    {
      id: 'r134a',
      name: 'Refrigerant R-134a',
      price: 75.50,
      image: '/placeholder.svg',
      sku: 'R134A-25LB',
      epaApproved: true,
      category: 'HFC',
      description: 'Widely used HFC for automotive air-conditioning and medium-temperature refrigeration.',
      stock: 35,
      packaging: ['Pallet (40 cylinders)', 'Container (800 cylinders)', 'Bulk Tank (2000 lbs)'],
      applications: ['Automotive AC', 'Medium Temp Refrigeration', 'Commercial Cooling'],
      sdsUrl: '/placeholder.svg' // Placeholder SDS URL
    },
    {
      id: 'r404a',
      name: 'Refrigerant R-404A',
      price: 92.25,
      image: '/placeholder.svg',
      sku: 'R404A-28LB',
      epaApproved: true,
      category: 'HFC',
      description: 'HFC blend for low and medium-temperature commercial refrigeration applications.',
      stock: 42,
      packaging: ['Pallet (45 cylinders)', 'Container (850 cylinders)', 'Bulk Tank (1500 lbs)'],
      applications: ['Low Temp Refrigeration', 'Supermarket Systems', 'Cold Storage'],
      sdsUrl: '/placeholder.svg' // Placeholder SDS URL
    }
  ]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
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
