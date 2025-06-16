
import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '../ProductCard';

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    {
      id: '1',
      name: 'R-134a Quantum Grade',
      price: 89.99,
      image: '/placeholder.svg',
      sku: 'R134A-QG-30LB',
      epaApproved: true,
      category: 'HFC'
    },
    {
      id: '2',
      name: 'R-410A Ultra Pure',
      price: 125.50,
      image: '/placeholder.svg',
      sku: 'R410A-UP-25LB',
      epaApproved: true,
      category: 'HFC'
    },
    {
      id: '3',
      name: 'R-32 Next Gen',
      price: 95.75,
      image: '/placeholder.svg',
      sku: 'R32-NG-20LB',
      epaApproved: true,
      category: 'HFO'
    },
    {
      id: '4',
      name: 'R-290 Natural Pro',
      price: 68.25,
      image: '/placeholder.svg',
      sku: 'R290-NP-15LB',
      epaApproved: true,
      category: 'Natural'
    },
    {
      id: '5',
      name: 'R-404A Commercial',
      price: 115.00,
      image: '/placeholder.svg',
      sku: 'R404A-CM-30LB',
      epaApproved: true,
      category: 'HFC'
    },
    {
      id: '6',
      name: 'R-1234yf Hybrid',
      price: 185.99,
      image: '/placeholder.svg',
      sku: 'R1234YF-HY-10LB',
      epaApproved: true,
      category: 'HFO'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'HFC', label: 'HFC Refrigerants' },
    { value: 'HFO', label: 'HFO Refrigerants' },
    { value: 'Natural', label: 'Natural Refrigerants' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quantum Refrigerants
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced molecular refrigerant solutions for the future of cooling technology. 
              EPA certified and quantum-grade purity.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-cyan-400" />
                <Input
                  type="text"
                  placeholder="Search quantum refrigerants by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-slate-800/50 border-2 border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-300 font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-gray-400">
            {sortedProducts.length} products found
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No products found matching your criteria.
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
