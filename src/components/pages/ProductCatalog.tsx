
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List, Shield, Truck, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '../../contexts/ProductsContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import SEOComponent from '../seo/SEOComponent';
import { createProductSlug } from '@/lib/slugs';
import { trackViewItemList, productToGA4Item } from '@/utils/ga4Ecommerce';

const ProductCatalog = () => {
  const { t } = useTranslation();
  const { products } = useProducts();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: urlCategory } = useParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isHeatPumpPath = location.pathname.includes('/heating-heat-pumps');
  const isToolsPath = location.pathname.includes('/hvac-tools');

  // Determine product type from URL
  const getProductTypeFromUrl = () => {
    if (location.pathname.includes('/refrigerants')) return 'refrigerant';
    if (location.pathname.includes('/accessories') || isToolsPath) return 'accessory';
    if (location.pathname.includes('/air-conditioners') || isHeatPumpPath) return 'air_conditioner';
    return 'all';
  };

  // Get AC subcategory from URL if applicable
  const getACSubcategory = () => {
    if (isHeatPumpPath) {
      const hpMatch = location.pathname.match(/\/heating-heat-pumps\/([^/]+)/);
      if (!hpMatch) return null;
      return hpMatch[1].startsWith('heat-pump-') ? hpMatch[1] : `heat-pump-${hpMatch[1]}`;
    }
    const match = location.pathname.match(/\/air-conditioners\/([^/]+)/);
    return match ? match[1] : null;
  };

  const productType = getProductTypeFromUrl();
  const acSubcategory = getACSubcategory();

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

  // Dynamic categories based on product type
  const getCategories = () => {
    if (productType === 'refrigerant') {
      return [
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
    } else if (productType === 'accessory') {
      return [
        { value: 'all', label: 'All Accessories' },
        { value: 'gauges', label: 'Gauges & Manifolds' },
        { value: 'recovery', label: 'Recovery Equipment' },
        { value: 'tools', label: 'Tools & Equipment' },
        { value: 'fittings', label: 'Fittings & Adapters' },
        { value: 'safety', label: 'Safety Equipment' },
        { value: 'valves', label: 'Valves & Controls' }
      ];
    } else if (isHeatPumpPath) {
      return [
        { value: 'all', label: 'All Heat Pumps' },
        { value: 'heat-pump-single-zone', label: 'Single-Zone Heat Pumps' },
        { value: 'heat-pump-multi-zone', label: 'Multi-Zone Heat Pumps' },
        { value: 'heat-pump-ptac', label: 'PTAC Heat Pumps' }
      ];
    } else if (productType === 'air_conditioner') {
      return [
        { value: 'all', label: 'All Air Conditioners' },
        { value: 'mini-splits', label: 'Ductless Mini-Splits' },
        { value: 'window-ac', label: 'Window AC Units' },
        { value: 'portable-ac', label: 'Portable AC Units' },
        { value: 'multi-zone', label: 'Multi-Zone Systems' },
        { value: 'ptac-commercial', label: 'PTAC & Commercial' }
      ];
    } else {
      return [
        { value: 'all', label: t('products.categories.all') },
        { value: 'refrigerant', label: 'Refrigerants' },
        { value: 'accessory', label: 'Accessories' },
        { value: 'air_conditioner', label: 'Air Conditioners' }
      ];
    }
  };

  const categories = getCategories();

  // Set category from AC subcategory URL param if applicable
  useEffect(() => {
    if (acSubcategory) {
      setSelectedCategory(acSubcategory);
    }
  }, [acSubcategory]);

  // Enhanced filtering logic with product type and category filtering
  const filteredProducts = products.filter(product => {
    // Filter by product type first
    if (productType !== 'all' && product.product_type !== productType) {
      return false;
    }

    // Heat pumps live inside the air_conditioner product type but have their own section
    const isHeatPumpProduct = (product.category || '').toLowerCase().startsWith('heat-pump');
    if (productType === 'air_conditioner') {
      if (isHeatPumpPath && !isHeatPumpProduct) return false;
      if (!isHeatPumpPath && isHeatPumpProduct) return false;
    }

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

    // AC subcategory matching - check BEFORE 'all' category check
    // When on an AC subcategory page (e.g., /air-conditioners/mini-splits), filter by that subcategory
    if (productType === 'air_conditioner' && acSubcategory) {
      const categoryMatch = product.category?.toLowerCase().replace(/\s+/g, '-') === acSubcategory ||
                           product.category?.toLowerCase() === acSubcategory.replace(/-/g, ' ');
      return categoryMatch && matchesSearch;
    }

    if (selectedCategory === 'all') {
      return matchesSearch;
    }

    // For product type filtering in mixed view
    if (selectedCategory === 'refrigerant' || selectedCategory === 'accessory' || selectedCategory === 'air_conditioner') {
      return product.product_type === selectedCategory && matchesSearch;
    }

    // AC subcategory matching via dropdown selection
    if (productType === 'air_conditioner') {
      const categoryMatch = product.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                           product.category?.toLowerCase() === selectedCategory.replace(/-/g, ' ');
      return categoryMatch && matchesSearch;
    }

    // Direct category match
    if (product.category && product.category.toLowerCase() === selectedCategory) {
      return matchesSearch;
    }

    // Application-based category matching for refrigerants
    if (productType === 'refrigerant' && product.applications && Array.isArray(product.applications)) {
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

    // Category matching for accessories
    if (productType === 'accessory') {
      const categoryMatch = product.category?.toLowerCase().includes(selectedCategory) || 
                           product.name.toLowerCase().includes(selectedCategory) ||
                           // Direct category mapping for accessories
                           (selectedCategory === 'gauges' && product.category === 'gauges') ||
                           (selectedCategory === 'recovery' && product.category === 'recovery') ||
                           (selectedCategory === 'tools' && product.category === 'tools') ||
                           (selectedCategory === 'fittings' && product.category === 'fittings') ||
                           (selectedCategory === 'safety' && product.category === 'safety') ||
                           (selectedCategory === 'valves' && product.category === 'valves');
      return categoryMatch && matchesSearch;
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

  // Track view_item_list when products are displayed
  useEffect(() => {
    if (sortedProducts.length > 0) {
      const ga4Items = sortedProducts.map((product, index) => ({
        ...productToGA4Item(product),
        index: index,
        item_list_name: productType === 'refrigerant' ? 'Refrigerants' : 
                        productType === 'accessory' ? 'Accessories' : 'All Products'
      }));
      const listName = productType === 'refrigerant' ? 'Refrigerants' : 
                       productType === 'accessory' ? 'Accessories' : 'All Products';
      trackViewItemList(ga4Items, listName);
    }
  }, [sortedProducts.length, productType]); // Track when products change

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
              {product.product_type === 'refrigerant' ? `${product.category} Refrigerant` : product.category}
            </Badge>
          </div>
          
          {/* Push price and button to bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500">
                {product.product_type === 'refrigerant' ? t('products.perCylinder') : 'per unit'}
              </span>
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

  // Get page title and description based on product type - UNIQUE titles for SEO
  const getPageTitle = () => {
    if (productType === 'refrigerant') return 'Refrigerant Gas Products';
    if (productType === 'accessory') return 'HVAC Accessories & Professional Tools';
    if (productType === 'air_conditioner') return 'Wholesale Air Conditioning Units';
    return 'Complete Product Catalog';
  };

  const getSearchPlaceholder = () => {
    if (productType === 'refrigerant') return 'Search refrigerants (R-410A, R-134a, R-32...)';
    if (productType === 'accessory') return 'Search accessories (gauges, tools, fittings...)';
    return 'Search products...';
  };

  const getCategoryDisplayName = () => {
    if (selectedCategory === 'all') return productType === 'accessory' ? 'All Accessories' : productType === 'refrigerant' ? 'All Refrigerants' : 'All Categories';
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.label : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  // Generate FAQ data based on product type
  const generateCatalogFAQ = () => {
    if (productType === 'refrigerant') {
      return [
        {
          question: "What is the minimum order for refrigerants?",
          answer: "Our minimum order quantity (MOQ) is 40 cylinders per pallet for all refrigerant types. We offer bulk discounts for 20ft containers (1,140 cylinders) and 40ft containers (2,280 cylinders)."
        },
        {
          question: "Are all refrigerants EPA approved?",
          answer: "Yes, all our refrigerants are EPA Section 608 compliant and approved for professional HVAC use. We provide certificates of compliance and Safety Data Sheets with every order."
        },
        {
          question: "What refrigerant types are available?",
          answer: "We carry HFC refrigerants (R-134a, R-410A, R-404A, R-22), HFO refrigerants for environmental compliance, natural refrigerants, and specialty automotive refrigerants. All with 99.9% purity guarantee."
        },
        {
          question: "How fast is refrigerant shipping?",
          answer: "We offer same-day shipping for in-stock refrigerants from our distribution centers in Texas, Florida, and California. Most orders arrive within 1-3 business days."
        }
      ];
    } else if (productType === 'accessory') {
      return [
        {
          question: "What HVAC accessories do you carry?",
          answer: "We stock professional HVAC tools including manifold gauges, recovery equipment, leak detectors, fittings, hoses, and specialized refrigeration accessories for contractors and technicians."
        },
        {
          question: "Do you offer bulk pricing on accessories?",
          answer: "Yes, we provide volume discounts on HVAC accessories for contractors, distributors, and service companies. Contact our sales team for custom pricing on large orders."
        }
      ];
    }
    return [];
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" }
    ];

    if (productType === 'refrigerant') {
      breadcrumbs.push({ name: "Refrigerants", url: "/products/refrigerants" });
    } else if (productType === 'accessory') {
      breadcrumbs.push({ name: "Accessories", url: "/products/accessories" });
    }

    if (selectedCategory !== 'all') {
      const category = categories.find(cat => cat.value === selectedCategory);
      if (category) {
        breadcrumbs.push({ 
          name: category.label, 
          url: `${location.pathname}?category=${selectedCategory}` 
        });
      }
    }

    return breadcrumbs;
  };

  // Generate unique SEO title based on product type and category for no duplicates
  const getSEOTitle = () => {
    if (productType === 'refrigerant') {
      return `${getCategoryDisplayName()} Refrigerants | Alper`;
    }
    if (productType === 'accessory') {
      return `HVAC Accessories & Tools | Alper`;
    }
    if (productType === 'air_conditioner') {
      return `Wholesale Air Conditioners | Alper`;
    }
    return `Wholesale Products | Alper`;
  };

  // Generate unique SEO description based on product type for no duplicates
  const getSEODescription = () => {
    if (productType === 'refrigerant') {
      return `⭐ Shop ${getCategoryDisplayName().toLowerCase()} refrigerant gases. R-410A, R-134a, R-404A, R-22 wholesale with 99.9% purity. MOQ 40 cylinders. EPA certified, same-day shipping from TX, FL, CA distribution centers.`;
    }
    if (productType === 'accessory') {
      return `🔧 Shop professional HVAC accessories & tools including ${getCategoryDisplayName().toLowerCase()}. Gauges, manifolds, recovery equipment, fittings. Quality brands with fast shipping for contractors.`;
    }
    if (productType === 'air_conditioner') {
      return `❄️ Wholesale ${getCategoryDisplayName().toLowerCase()} with container-load pricing. Mini-splits, window units, portable AC. MOQ 5 units with tiered bulk discounts for distributors.`;
    }
    return `Browse our complete product catalog featuring refrigerants, HVAC accessories, and air conditioning units. Bulk wholesale pricing with same-day shipping. EPA certified distributor.`;
  };

  // Generate unique keywords based on product type
  const getSEOKeywords = () => {
    if (productType === 'refrigerant') {
      return `refrigerant catalog, bulk refrigerant prices, HFC wholesale, HFO refrigerants, natural refrigerants, R-410A price, R-134a wholesale, R-404A bulk, MOQ 40 cylinders, EPA certified, fast shipping, ${getCategoryDisplayName().toLowerCase()}`;
    }
    if (productType === 'accessory') {
      return "HVAC accessories, refrigeration tools, manifold gauges, recovery equipment, leak detectors, professional HVAC tools, contractor supplies, bulk pricing";
    }
    return "HVAC products, refrigerants accessories, wholesale HVAC, professional refrigeration, contractor supplies, EPA certified, bulk pricing";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title={getSEOTitle()}
        description={getSEODescription()}
        keywords={getSEOKeywords()}
        canonicalUrl={location.pathname}
        breadcrumbs={generateBreadcrumbs()}
        faq={generateCatalogFAQ()}
        ogType="product.group"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              {productType === 'refrigerant' 
                ? 'Professional-grade refrigerants for HVAC, automotive, and industrial applications. EPA certified with guaranteed purity.'
                : productType === 'accessory'
                ? 'Complete range of HVAC tools and accessories for professional contractors and technicians.'
                : productType === 'air_conditioner'
                ? 'Mini-splits, multi-zone systems, window, portable and PTAC units at container-load pricing. MOQ 5 units with tiered bulk discounts.'
                : t('products.description')
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EPA Compliance Banner - Only for refrigerants */}
      {productType === 'refrigerant' && (
        <div className="bg-yellow-50 border-y-2 border-yellow-400">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>⚠️ PROFESSIONAL USE ONLY</strong> — All refrigerants require EPA Section 608 certification for purchase. 
                Sales restricted to licensed HVAC professionals and certified technicians only. 
                <a href="/compliance" className="underline ml-1 hover:text-yellow-900">Learn more about EPA compliance →</a>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {sortedProducts.length} {t('products.productsFound', { count: sortedProducts.length })}
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
