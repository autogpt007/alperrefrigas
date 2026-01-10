
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCatalog from './ProductCatalog';
import SEOComponent from '../seo/SEOComponent';

const ProductCategory = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set the category filter when the component mounts
  React.useEffect(() => {
    if (category) {
      setSearchParams({ category });
    }
  }, [category, setSearchParams]);

  // Category-specific SEO data - UNIQUE titles and descriptions for each category page
  const getCategoryData = (cat: string) => {
    const categoryData: Record<string, { title: string; description: string; keywords: string }> = {
      'hfc': {
        title: 'Buy HFC Refrigerants Wholesale - R-410A, R-134a, R-404A Bulk Supply | Alper Refrigerants',
        description: '⭐ Shop HFC refrigerants at wholesale prices. R-410A, R-134a, R-404A, R-407C bulk supply. EPA certified, 99.9% purity guarantee, MOQ 40 cylinders. Same-day shipping from TX, FL, CA.',
        keywords: 'HFC refrigerants wholesale, R-410A bulk, R-134a wholesale, R-404A distributor, R-407C bulk pricing, hydrofluorocarbon refrigerants, EPA certified HFC'
      },
      'hfo': {
        title: 'HFO Low-GWP Refrigerants - R-1234yf, R-1234ze Wholesale Distribution | Alper Refrigerants',
        description: '🌱 Next-generation HFO refrigerants with ultra-low global warming potential. R-1234yf, R-1234ze, R-513A wholesale. Environmental compliance solutions for contractors.',
        keywords: 'HFO refrigerants, R-1234yf wholesale, R-1234ze bulk, hydrofluoroolefin, low GWP refrigerants, environmental refrigerants, R-513A distributor'
      },
      'natural': {
        title: 'Natural Refrigerants - R-290 Propane, R-600a, R-744 CO2 Wholesale | Alper Refrigerants',
        description: '🌿 Eco-friendly natural refrigerants for sustainable HVAC. R-290 propane, R-600a isobutane, R-744 CO2 wholesale. Zero ODP, ultra-low GWP alternatives.',
        keywords: 'natural refrigerants, R-290 propane wholesale, R-600a isobutane, R-744 CO2 refrigerant, hydrocarbon refrigerants, eco-friendly HVAC, zero ODP'
      },
      'automotive': {
        title: 'Automotive AC Refrigerants - R-134a, R-1234yf Wholesale for Technicians | Alper Refrigerants',
        description: '🚗 Professional automotive A/C refrigerants for certified technicians. R-134a, R-1234yf wholesale pricing. EPA 609 compliant, bulk discounts for auto shops.',
        keywords: 'automotive refrigerants, R-134a automotive, R-1234yf car AC, mobile AC refrigerant, automotive air conditioning, EPA 609 certified, auto shop supplies'
      },
      'commercial': {
        title: 'Commercial HVAC Refrigerants - Supermarket & Large System Solutions | Alper Refrigerants',
        description: '🏢 Commercial-grade refrigerants for large HVAC systems. Supermarket refrigeration, chillers, rooftop units. Container-load pricing for facility managers.',
        keywords: 'commercial refrigerants, supermarket refrigeration, large HVAC systems, commercial chillers, rooftop AC refrigerant, facility management, bulk commercial'
      },
      'industrial': {
        title: 'Industrial Refrigerants - Process Cooling & Manufacturing Solutions | Alper Refrigerants',
        description: '🏭 Industrial refrigerants for manufacturing and process cooling. Heavy-duty applications with technical support. Container pricing and dedicated account management.',
        keywords: 'industrial refrigerants, process cooling, manufacturing refrigeration, heavy-duty HVAC, industrial cooling systems, cold storage, ammonia alternatives'
      }
    };
    
    return categoryData[cat] || {
      title: 'Professional Refrigerant Products Catalog | Alper Refrigerants',
      description: 'Browse our complete refrigerant catalog. HFC, HFO, natural refrigerants with EPA certification. Wholesale pricing, MOQ 40 cylinders, expert technical support.',
      keywords: 'refrigerant products, HVAC refrigerants, professional distribution, EPA certified, wholesale pricing'
    };
  };

  const categoryInfo = category ? getCategoryData(category) : getCategoryData('');

  return (
    <>
      <SEOComponent
        title={categoryInfo.title}
        description={categoryInfo.description}
        keywords={categoryInfo.keywords}
        canonicalUrl={`/products/category/${category}`}
      />
      <ProductCatalog />
    </>
  );
};

export default ProductCategory;
