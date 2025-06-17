
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    {
      id: 'r410a',
      name: 'Refrigerant R-410A',
      description: 'High-efficiency, non-ozone-depleting HFC refrigerant for modern air-conditioning systems.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Residential AC', 'Commercial HVAC', 'Heat Pumps']
    },
    {
      id: 'r134a',
      name: 'Refrigerant R-134a',
      description: 'Widely used HFC for automotive air-conditioning and medium-temperature refrigeration.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Automotive AC', 'Medium Temp Refrigeration', 'Commercial Cooling']
    },
    {
      id: 'r404a',
      name: 'Refrigerant R-404A',
      description: 'HFC blend for low and medium-temperature commercial refrigeration applications.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Low Temp Refrigeration', 'Supermarket Systems', 'Cold Storage']
    },
    {
      id: 'r32',
      name: 'Refrigerant R-32',
      description: 'Next-generation HFC refrigerant with lower global warming potential.',
      imageUrl: '/placeholder.svg',
      category: 'HFC',
      applications: ['Residential AC', 'Commercial HVAC', 'VRF Systems']
    },
    {
      id: 'r290',
      name: 'Refrigerant R-290 (Propane)',
      description: 'Natural hydrocarbon refrigerant with excellent environmental properties.',
      imageUrl: '/placeholder.svg',
      category: 'Natural',
      applications: ['Commercial Refrigeration', 'Heat Pumps', 'Industrial Cooling']
    },
    {
      id: 'r1234yf',
      name: 'Refrigerant R-1234yf',
      description: 'Low GWP HFO refrigerant for automotive air conditioning applications.',
      imageUrl: '/placeholder.svg',
      category: 'HFO',
      applications: ['Automotive AC', 'Mobile AC', 'Transport Refrigeration']
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
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Refrigerant Catalog
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
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
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-gray-600">
            {sortedProducts.length} products found
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {product.name.split(' ')[1]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.applications.map((app, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={`/products/${product.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details & Request Quote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">
              No products found matching your criteria.
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
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
