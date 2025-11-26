import React from 'react';
import { ProductsBlockContent } from '@/types/page-blocks';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';

interface ProductsBlockProps {
  content: ProductsBlockContent;
}

const ProductsBlock: React.FC<ProductsBlockProps> = ({ content }) => {
  const { products } = useProducts();
  
  const displayProducts = content.productIds && content.productIds.length > 0
    ? products.filter(p => content.productIds?.includes(p.id))
    : content.featured
    ? products.slice(0, 6)
    : products.slice(0, 8);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsBlock;
