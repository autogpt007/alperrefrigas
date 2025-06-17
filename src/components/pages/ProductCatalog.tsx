
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const products = [
    {
      id: 'r410a',
      name: 'Refrigerant R-410A',
      description: 'High-efficiency, non-ozone-depleting HFC refrigerant for modern air-conditioning systems.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Residential AC', 'Commercial HVAC', 'Heat Pumps'],
      price: 'Quote Required',
      inStock: true
    },
    {
      id: 'r134a',
      name: 'Refrigerant R-134a',
      description: 'Widely used HFC for automotive air-conditioning and medium-temperature refrigeration.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Automotive AC', 'Medium Temp Refrigeration', 'Commercial Cooling'],
      price: 'Quote Required',
      inStock: true
    },
    {
      id: 'r404a',
      name: 'Refrigerant R-404A',
      description: 'HFC blend for low and medium-temperature commercial refrigeration applications.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Low Temp Refrigeration', 'Supermarket Systems', 'Cold Storage'],
      price: 'Quote Required',
      inStock: true
    },
    {
      id: 'r32',
      name: 'Refrigerant R-32',
      description: 'Next-generation HFC refrigerant with lower global warming potential.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Residential AC', 'Commercial HVAC', 'VRF Systems'],
      price: 'Quote Required',
      inStock: true
    },
    {
      id: 'r290',
      name: 'Refrigerant R-290 (Propane)',
      description: 'Natural hydrocarbon refrigerant with excellent environmental properties.',
      imageUrl: '/placeholder.svg',
      category: 'Natural',
      applications: ['Commercial Refrigeration', 'Heat Pumps', 'Industrial Cooling'],
      price: 'Quote Required',
      inStock: false
    },
    {
      id: 'r1234yf',
      name: 'Refrigerant R-1234yf',
      description: 'Low GWP HFO refrigerant for automotive air conditioning applications.',
      imageUrl: '/placeholder.svg',
      category: 'HFO',
      applications: ['Automotive AC', 'Mobile AC', 'Transport Refrigeration'],
      price: 'Quote Required',
      inStock: true
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
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.applications.some(app => app.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
          <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
            {product.name.split(' ')[1]}
          </div>
          {!product.inStock && (
            <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
          )}
          {product.inStock && (
            <Badge className="absolute top-2 right-2 bg-green-500">In Stock</Badge>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Applications:</h4>
            <div className="flex flex-wrap gap-1">
              {product.applications.slice(0, 2).map((app: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {app}
                </span>
              ))}
              {product.applications.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  +{product.applications.length - 2} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-blue-600">{product.price}</span>
          </div>
          
          <Link to={`/products/${product.id}`}>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!product.inStock}
            >
              {product.inStock ? 'View Details & Request Quote' : 'Out of Stock'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Professional Refrigerant Catalog
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Browse our comprehensive selection of refrigerants available for bulk distribution. 
              All products available by pallet or container.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search refrigerants by name or application..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
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
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-gray-600 text-sm">
              {sortedProducts.length} products found
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-600 text-lg mb-4">
              No products found matching your criteria.
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700"
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
