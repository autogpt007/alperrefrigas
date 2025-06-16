
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Filter, ShoppingCart, FileText } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface RefrigerantProduct {
  id: string;
  name: string;
  type: string;
  price: number;
  sku: string;
  epaApproved: boolean;
  description: string;
  specifications: {
    purity: string;
    packaging: string;
    weight: string;
  };
  sdsLink: string;
  image: string;
  inStock: boolean;
}

const mockProducts: RefrigerantProduct[] = [
  {
    id: '1',
    name: 'R-410A Refrigerant',
    type: 'HFC',
    price: 125.99,
    sku: 'REF-410A-25',
    epaApproved: true,
    description: 'High-efficiency refrigerant for residential and commercial air conditioning systems.',
    specifications: {
      purity: '99.9%',
      packaging: '25 lb cylinder',
      weight: '25 lbs'
    },
    sdsLink: '/sds/r410a.pdf',
    image: '/placeholder.svg',
    inStock: true
  },
  {
    id: '2',
    name: 'R-134A Refrigerant',
    type: 'HFC',
    price: 89.99,
    sku: 'REF-134A-30',
    epaApproved: true,
    description: 'Automotive and commercial refrigeration refrigerant.',
    specifications: {
      purity: '99.8%',
      packaging: '30 lb cylinder',
      weight: '30 lbs'
    },
    sdsLink: '/sds/r134a.pdf',
    image: '/placeholder.svg',
    inStock: true
  },
  {
    id: '3',
    name: 'R-22 Refrigerant',
    type: 'HCFC',
    price: 299.99,
    sku: 'REF-22-30',
    epaApproved: true,
    description: 'Legacy refrigerant for older HVAC systems (phase-out scheduled).',
    specifications: {
      purity: '99.9%',
      packaging: '30 lb cylinder',
      weight: '30 lbs'
    },
    sdsLink: '/sds/r22.pdf',
    image: '/placeholder.svg',
    inStock: false
  }
];

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const { addItem } = useCart();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.type.toLowerCase().includes(term.toLowerCase()) ||
      product.sku.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: RefrigerantProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sku: product.sku,
      epaApproved: product.epaApproved
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Refrigerant Catalog</h1>
        <p className="text-gray-600 mb-6">
          Browse our comprehensive selection of EPA-approved refrigerants for commercial and residential use.
        </p>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, type, or SKU..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                {product.epaApproved && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    EPA Approved
                  </Badge>
                )}
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg bg-gray-100"
                />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {product.type}
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                  <div>
                    <span className="font-medium">Purity:</span> {product.specifications.purity}
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span> {product.specifications.weight}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <div className="text-sm text-gray-500">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(product.sdsLink, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
