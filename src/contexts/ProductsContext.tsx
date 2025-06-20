
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
      description: 'R-410A is a high-efficiency, non-ozone-depleting HFC refrigerant blend designed for modern air-conditioning systems. Operating at higher pressures than R-22, it provides excellent energy efficiency in both commercial and residential applications.',
      stock: 50,
      packaging: ['30 lb Cylinder', 'Pallet (48 cylinders)', 'Container (900 cylinders)', 'Bulk Tank (1000 lbs)'],
      applications: ['Residential AC', 'Commercial HVAC', 'Heat Pumps', 'New Equipment Manufacturing'],
      sdsUrl: '/sds/r410a-sds.pdf',
      gtin: '1234567890123',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '30 lbs',
      dimensions: { length: '12 in', width: '12 in', height: '18 in' },
      chemicalFormula: 'R-32/R-125 (50/50)',
      casNumber: '354-33-6',
      unNumber: 'UN3337',
      hazardClass: '2.1'
    },
    {
      id: 'r134a',
      name: 'Refrigerant R-134a',
      price: 75.50,
      image: '/placeholder.svg',
      sku: 'R134A-25LB',
      epaApproved: true,
      category: 'HFC',
      description: 'R-134a is a widely used HFC refrigerant for automotive air-conditioning and medium-temperature refrigeration applications. It has zero ozone depletion potential and excellent thermodynamic properties.',
      stock: 35,
      packaging: ['25 lb Cylinder', 'Pallet (40 cylinders)', 'Container (800 cylinders)', 'Bulk Tank (2000 lbs)'],
      applications: ['Automotive AC', 'Medium Temp Refrigeration', 'Commercial Cooling', 'Industrial Systems'],
      sdsUrl: '/sds/r134a-sds.pdf',
      gtin: '1234567890124',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '25 lbs',
      dimensions: { length: '11 in', width: '11 in', height: '17 in' },
      chemicalFormula: 'CF3CH2F',
      casNumber: '811-97-2',
      unNumber: 'UN3159',
      hazardClass: '2.2'
    },
    {
      id: 'r404a',
      name: 'Refrigerant R-404A',
      price: 92.25,
      image: '/placeholder.svg',
      sku: 'R404A-28LB',
      epaApproved: true,
      category: 'HFC',
      description: 'R-404A is an HFC blend designed for low and medium-temperature commercial refrigeration applications. It provides excellent performance in supermarket refrigeration and cold storage applications.',
      stock: 42,
      packaging: ['28 lb Cylinder', 'Pallet (45 cylinders)', 'Container (850 cylinders)', 'Bulk Tank (1500 lbs)'],
      applications: ['Low Temp Refrigeration', 'Supermarket Systems', 'Cold Storage', 'Ice Machines'],
      sdsUrl: '/sds/r404a-sds.pdf',
      gtin: '1234567890125',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '28 lbs',
      dimensions: { length: '12 in', width: '12 in', height: '18 in' },
      chemicalFormula: 'R-125/R-143a/R-134a (44/52/4)',
      casNumber: '59120-26-6',
      unNumber: 'UN3337',
      hazardClass: '2.1'
    },
    {
      id: 'r407c',
      name: 'Refrigerant R-407C',
      price: 94.75,
      image: '/placeholder.svg',
      sku: 'R407C-25LB',
      epaApproved: true,
      category: 'HFC',
      description: 'R-407C is an HFC blend refrigerant designed as a replacement for R-22 in air conditioning and heat pump applications. It offers similar performance characteristics with zero ozone depletion potential.',
      stock: 28,
      packaging: ['25 lb Cylinder', 'Pallet (48 cylinders)', 'Container (960 cylinders)', 'Bulk Tank (1200 lbs)'],
      applications: ['AC Retrofit', 'Heat Pumps', 'Commercial HVAC', 'Chiller Systems'],
      sdsUrl: '/sds/r407c-sds.pdf',
      gtin: '1234567890126',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '25 lbs',
      dimensions: { length: '11 in', width: '11 in', height: '17 in' },
      chemicalFormula: 'R-32/R-125/R-134a (23/25/52)',
      casNumber: '96693-70-6',
      unNumber: 'UN3337',
      hazardClass: '2.1'
    },
    {
      id: 'r507a',
      name: 'Refrigerant R-507A',
      price: 105.99,
      image: '/placeholder.svg',
      sku: 'R507A-25LB',
      epaApproved: true,
      category: 'HFC',
      description: 'R-507A is an azeotropic HFC blend designed for low and medium-temperature commercial refrigeration. It provides excellent performance in transport refrigeration and supermarket applications.',
      stock: 22,
      packaging: ['25 lb Cylinder', 'Pallet (40 cylinders)', 'Container (800 cylinders)', 'Bulk Tank (1000 lbs)'],
      applications: ['Transport Refrigeration', 'Supermarket Freezers', 'Cold Storage', 'Ice Rinks'],
      sdsUrl: '/sds/r507a-sds.pdf',
      gtin: '1234567890127',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '25 lbs',
      dimensions: { length: '11 in', width: '11 in', height: '17 in' },
      chemicalFormula: 'R-125/R-143a (50/50)',
      casNumber: '354-33-6',
      unNumber: 'UN3337',
      hazardClass: '2.1'
    },
    {
      id: 'r32',
      name: 'Refrigerant R-32',
      price: 112.50,
      image: '/placeholder.svg',
      sku: 'R32-20LB',
      epaApproved: true,
      category: 'HFC',
      description: 'R-32 is a next-generation HFC refrigerant with low global warming potential. It offers excellent energy efficiency and is increasingly used in modern air conditioning systems.',
      stock: 18,
      packaging: ['20 lb Cylinder', 'Pallet (50 cylinders)', 'Container (1000 cylinders)', 'Bulk Tank (800 lbs)'],
      applications: ['Modern AC Systems', 'VRF Systems', 'Heat Pumps', 'Energy Efficient HVAC'],
      sdsUrl: '/sds/r32-sds.pdf',
      gtin: '1234567890128',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '20 lbs',
      dimensions: { length: '10 in', width: '10 in', height: '16 in' },
      chemicalFormula: 'CH2F2',
      casNumber: '75-10-5',
      unNumber: 'UN3252',
      hazardClass: '2.1'
    },
    {
      id: 'r1234yf',
      name: 'Refrigerant R-1234yf',
      price: 189.99,
      image: '/placeholder.svg',
      sku: 'R1234YF-10LB',
      epaApproved: true,
      category: 'HFO',
      description: 'R-1234yf is a low-GWP HFO refrigerant designed for automotive air conditioning. It meets strict environmental regulations while providing excellent cooling performance.',
      stock: 15,
      packaging: ['10 lb Cylinder', 'Pallet (60 cylinders)', 'Container (600 cylinders)', 'Bulk Tank (500 lbs)'],
      applications: ['Automotive AC', 'Mobile AC', 'Electric Vehicle AC', 'New Vehicle Manufacturing'],
      sdsUrl: '/sds/r1234yf-sds.pdf',
      gtin: '1234567890129',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '10 lbs',
      dimensions: { length: '8 in', width: '8 in', height: '14 in' },
      chemicalFormula: 'CF3CF=CH2',
      casNumber: '754-12-1',
      unNumber: 'UN3161',
      hazardClass: '2.1'
    },
    {
      id: 'r1234ze',
      name: 'Refrigerant R-1234ze(E)',
      price: 165.75,
      image: '/placeholder.svg',
      sku: 'R1234ZE-25LB',
      epaApproved: true,
      category: 'HFO',
      description: 'R-1234ze(E) is an environmentally friendly HFO refrigerant with ultra-low GWP. Ideal for centrifugal chillers and high-temperature heat pumps.',
      stock: 12,
      packaging: ['25 lb Cylinder', 'Pallet (40 cylinders)', 'Container (800 cylinders)', 'Bulk Tank (1000 lbs)'],
      applications: ['Centrifugal Chillers', 'High-Temp Heat Pumps', 'Industrial Cooling', 'Process Cooling'],
      sdsUrl: '/sds/r1234ze-sds.pdf',
      gtin: '1234567890130',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '25 lbs',
      dimensions: { length: '11 in', width: '11 in', height: '17 in' },
      chemicalFormula: 'CHF=CHCF3',
      casNumber: '29118-24-9',
      unNumber: 'UN3161',
      hazardClass: '2.1'
    },
    {
      id: 'r290',
      name: 'Refrigerant R-290 (Propane)',
      price: 145.00,
      image: '/placeholder.svg',
      sku: 'R290-20LB',
      epaApproved: true,
      category: 'Natural',
      description: 'R-290 (Propane) is a natural refrigerant with zero ozone depletion potential and very low global warming potential. Excellent for small commercial and residential applications.',
      stock: 25,
      packaging: ['20 lb Cylinder', 'Pallet (50 cylinders)', 'Container (1000 cylinders)', 'Bulk Tank (800 lbs)'],
      applications: ['Small Commercial AC', 'Residential Heat Pumps', 'Vending Machines', 'Display Cases'],
      sdsUrl: '/sds/r290-sds.pdf',
      gtin: '1234567890131',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '20 lbs',
      dimensions: { length: '10 in', width: '10 in', height: '16 in' },
      chemicalFormula: 'C3H8',
      casNumber: '74-98-6',
      unNumber: 'UN1978',
      hazardClass: '2.1'
    },
    {
      id: 'r600a',
      name: 'Refrigerant R-600a (Isobutane)',
      price: 125.50,
      image: '/placeholder.svg',
      sku: 'R600A-12LB',
      epaApproved: true,
      category: 'Natural',
      description: 'R-600a (Isobutane) is a natural refrigerant commonly used in domestic refrigerators and small commercial applications. It has excellent thermodynamic properties and zero ozone depletion potential.',
      stock: 30,
      packaging: ['12 lb Cylinder', 'Pallet (60 cylinders)', 'Container (720 cylinders)', 'Bulk Tank (600 lbs)'],
      applications: ['Domestic Refrigerators', 'Small Freezers', 'Wine Coolers', 'Compact AC Units'],
      sdsUrl: '/sds/r600a-sds.pdf',
      gtin: '1234567890132',
      brand: 'FrigidFlow',
      condition: 'new',
      availability: 'in_stock',
      shippingWeight: '12 lbs',
      dimensions: { length: '9 in', width: '9 in', height: '15 in' },
      chemicalFormula: 'C4H10',
      casNumber: '75-28-5',
      unNumber: 'UN1969',
      hazardClass: '2.1'
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
