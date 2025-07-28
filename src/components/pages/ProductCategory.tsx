
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

  // Category-specific SEO data
  const getCategoryData = (cat: string) => {
    const categoryData: Record<string, { title: string; description: string; keywords: string }> = {
      'hfc': {
        title: 'HFC Refrigerants - Professional Distribution',
        description: 'High-quality HFC refrigerants including R-410A, R-134a, R-404A, and more. EPA-certified professional distribution with competitive wholesale pricing.',
        keywords: 'HFC refrigerants, R-410A, R-134a, R-404A, R-407C, hydrofluorocarbon, HVAC refrigerants, commercial refrigeration'
      },
      'hfo': {
        title: 'HFO Refrigerants - Low GWP Alternative Solutions',
        description: 'Environmentally-friendly HFO refrigerants with low global warming potential. Professional distribution of R-1234yf, R-1234ze, and other HFO solutions.',
        keywords: 'HFO refrigerants, R-1234yf, R-1234ze, hydrofluoroolefin, low GWP, environmental refrigerants, next-generation refrigerants'
      },
      'natural': {
        title: 'Natural Refrigerants - Eco-Friendly HVAC Solutions',
        description: 'Natural refrigerants including R-290 (propane), R-600a (isobutane), and R-744 (CO2). Zero ozone depletion, low GWP alternatives.',
        keywords: 'natural refrigerants, R-290, R-600a, R-744, propane refrigerant, isobutane, CO2 refrigerant, hydrocarbon refrigerants'
      },
      'automotive': {
        title: 'Automotive Refrigerants - Professional AC Service',
        description: 'Automotive A/C refrigerants for professional service technicians. R-134a, R-1234yf, and specialty automotive refrigerants with EPA certification.',
        keywords: 'automotive refrigerants, R-134a, R-1234yf, car AC refrigerant, automotive air conditioning, mobile AC service'
      },
      'commercial': {
        title: 'Commercial Refrigerants - Industrial HVAC Solutions',
        description: 'Commercial-grade refrigerants for large HVAC systems, supermarket refrigeration, and industrial applications. Bulk quantities available.',
        keywords: 'commercial refrigerants, industrial HVAC, supermarket refrigeration, bulk refrigerants, commercial air conditioning'
      },
      'industrial': {
        title: 'Industrial Refrigerants - Heavy-Duty Applications',
        description: 'Industrial refrigerants for process cooling, manufacturing, and large-scale refrigeration systems. Professional-grade solutions with technical support.',
        keywords: 'industrial refrigerants, process cooling, manufacturing refrigeration, heavy-duty HVAC, industrial cooling systems'
      }
    };
    
    return categoryData[cat] || {
      title: 'Professional Refrigerant Products',
      description: 'High-quality refrigerants for all applications. EPA-certified distribution with competitive pricing and expert technical support.',
      keywords: 'refrigerants, HVAC, professional distribution, EPA certified'
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
