
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List, Shield, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '../../contexts/ProductsContext';
import SEOComponent from '../seo/SEOComponent';
import { createProductSlug } from '@/lib/slugs';

const ProductCatalog = () => {
  const { t } = useTranslation();
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: urlCategory } = useParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category') || urlCategory;
    
    if (search) {
      setSearchQuery(search);
    }
    
    if (category) {
      setSelectedCategory(category.toLowerCase());
    }
  }, [searchParams, urlCategory]);

  const categories = [
    { value: 'all', label: t('products.categories.all') },
    { value: 'hfc', label: t('products.categories.hfc') },
    { value: 'hfo', label: t('products.categories.hfo') },
    { value: 'hcfc', label: t('products.categories.hcfc') },
    { value: 'cfc', label: t('products.categories.cfc') },
    { value: 'natural', label: t('products.categories.natural') },
    { value: 'automotive', label: t('products.categories.automotive') },
    { value: 'commercial', label: t('products.categories.commercial') },
    { value: 'industrial', label: t('products.categories.industrial') }
  ];

  // Enhanced filtering logic with improved search capabilities
  const filteredProducts = products.filter(product => {
    // Normalize search query and product text for better matching
    const normalizedQuery = searchQuery.toLowerCase().trim().replace(/[-\s]/g, '');
    
    // Check multiple fields with flexible matching
    const searchableFields = [
      product.name,
      product.description || '',
      product.sku || '',
      product.chemicalFormula || '',
      product.casNumber || '',
      ...(product.applications || [])
    ];
    
    const matchesSearch = searchableFields.some(field => {
      if (!field) return false;
      const normalizedField = field.toString().toLowerCase().replace(/[-\s]/g, '');
      
      // Check for partial matches (contains) and also exact chemical formula matches
      return normalizedField.includes(normalizedQuery) || 
             field.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
             // Handle common refrigerant naming variations (e.g., R410A vs R-410A)
             (normalizedQuery.startsWith('r') && normalizedField.includes(normalizedQuery.substring(1)));
    });

    if (selectedCategory === 'all') {
      return matchesSearch;
    }

    // Direct category match
    if (product.category && product.category.toLowerCase() === selectedCategory) {
      return matchesSearch;
    }

    // Application-based category matching
    if (product.applications && Array.isArray(product.applications)) {
      const applicationMatch = product.applications.some(app => {
        const appLower = app.toLowerCase();
        switch (selectedCategory) {
          case 'automotive':
            return appLower.includes('automotive') || appLower.includes('mobile ac') || appLower.includes('vehicle');
          case 'commercial':
            return appLower.includes('commercial') || appLower.includes('hvac') || appLower.includes('ac');
          case 'industrial':
            return appLower.includes('industrial') || appLower.includes('process') || appLower.includes('chiller');
          default:
            return false;
        }
      });
      if (applicationMatch) {
        return matchesSearch;
      }
    }

    return false;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-0 shadow-lg overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Larger Image Display */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
          {product.image && product.image !== '/placeholder.svg' ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {product.name.split(' ')[1] || product.name.charAt(0)}
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.epaApproved && (
              <Badge className="bg-green-600 text-white text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {t('products.epaApproved')}
              </Badge>
            )}
            <Badge className={`text-xs ${product.availability === 'in_stock' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
              {product.availability === 'in_stock' ? t('products.inStock') : t('products.outOfStock')}
            </Badge>
          </div>

          {/* Fast Shipping Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600 text-white text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Fast Ship
            </Badge>
          </div>
        </div>
        
        {/* Condensed Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <Link to={`/products/${createProductSlug(product.name)}`} className="block">
              <h3 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors hover:underline cursor-pointer">{product.name}</h3>
            </Link>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
          
          {/* Reduced text content */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {product.category} Refrigerant
            </Badge>
          </div>
          
          {/* Push price and button to bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">{t('products.perCylinder')}</span>
            </div>
            
            <Link to={`/products/${createProductSlug(product.name)}`}>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={product.availability !== 'in_stock'}
              >
                {product.availability === 'in_stock' ? t('products.viewDetails') : t('products.outOfStock')}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Get category display name
  const getCategoryDisplayName = () => {
    if (selectedCategory === 'all') return 'All Categories';
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.label : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title={`${getCategoryDisplayName()} - Professional Refrigerant Catalog`}
        description={`Browse our comprehensive selection of ${getCategoryDisplayName().toLowerCase()} including R-410A, R-134a, R-404A, R-1234yf, and more. EPA approved, bulk quantities, fast shipping.`}
        keywords="refrigerant, HFC, HFO, natural refrigerants, R-410A, R-134a, R-404A, R-407C, R-507A, R-32, R-1234yf, R-290, R-600a, HVAC, automotive, commercial"
        canonicalUrl="/products"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('products.title')}
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              {t('products.description')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
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
              <span className="text-gray-700 font-medium">{t('products.filters')}:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={t('products.selectCategory')} />
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
                  <SelectValue placeholder={t('products.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('products.sortOptions.name')}</SelectItem>
                  <SelectItem value="price">{t('products.sortOptions.price')}</SelectItem>
                  <SelectItem value="category">{t('products.sortOptions.category')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-gray-600 text-sm">
              {t('products.productsFound', { count: sortedProducts.length })}
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
              {t('products.noProducts')}
            </div>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('products.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
