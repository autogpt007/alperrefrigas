
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCatalog from './ProductCatalog';

const ProductCategory = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Set the category filter when the component mounts
  React.useEffect(() => {
    if (category) {
      setSearchParams({ category });
    }
  }, [category, setSearchParams]);

  return <ProductCatalog />;
};

export default ProductCategory;
