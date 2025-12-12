import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface DirectCheckoutResult {
  isLoading: boolean;
  productAdded: boolean;
  error: string | null;
}

/**
 * Hook to handle direct checkout URLs from Google Merchant Center
 * Supports: ?sku=XXX&quantity=N&packaging=XXX or ?product_id=UUID&quantity=N&packaging=XXX
 */
export const useDirectCheckout = (): DirectCheckoutResult => {
  const [searchParams] = useSearchParams();
  const { items, addItem } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productAdded, setProductAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sku = searchParams.get('sku');
    const productId = searchParams.get('product_id');
    const quantity = parseInt(searchParams.get('quantity') || '1', 10);
    const packaging = searchParams.get('packaging');

    // Only process if we have a SKU or product_id param
    if (!sku && !productId) {
      return;
    }

    // Check if product already in cart (avoid duplicates on re-render)
    const alreadyInCart = items.some(item => 
      (sku && item.sku === sku) || (productId && item.id === productId)
    );

    if (alreadyInCart) {
      setProductAdded(true);
      return;
    }

    const fetchAndAddProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query based on provided param
        let query = supabase.from('products').select('*');
        
        if (sku) {
          query = query.eq('sku', sku);
        } else if (productId) {
          query = query.eq('id', productId);
        }

        const { data: products, error: fetchError } = await query.single();

        if (fetchError || !products) {
          const errorMsg = sku 
            ? `Product with SKU "${sku}" not found` 
            : `Product not found`;
          setError(errorMsg);
          toast({
            title: "Product Not Found",
            description: errorMsg,
            variant: "destructive",
          });
          return;
        }

        // Determine the correct price based on packaging
        let price = products.price;
        let selectedPackaging = packaging || '1 Cylinder';

        if (packaging) {
          const packagingLower = packaging.toLowerCase();
          if (packagingLower.includes('pallet') && products.pallet_price) {
            price = products.pallet_price;
          } else if (packagingLower.includes('20') && products.container_20ft_price) {
            price = products.container_20ft_price;
          } else if (packagingLower.includes('40') && products.container_40ft_price) {
            price = products.container_40ft_price;
          }
        }

        // Create cart item
        const cartItem: Omit<CartItem, 'quantity'> = {
          id: products.id,
          name: products.name,
          price: price,
          image: products.images?.[0] || products.thumbnail_url || '/placeholder.svg',
          sku: products.sku || '',
          epaApproved: products.epa_approved || false,
          packaging: selectedPackaging,
          product_type: products.product_type || 'refrigerant'
        };

        // Add item to cart (quantity times)
        for (let i = 0; i < quantity; i++) {
          addItem(cartItem);
        }

        setProductAdded(true);
        toast({
          title: "Product Added",
          description: `${products.name} has been added to your cart`,
        });

      } catch (err) {
        console.error('Direct checkout error:', err);
        setError('Failed to load product');
        toast({
          title: "Error",
          description: "Failed to load product for checkout",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAddProduct();
  }, [searchParams]); // Only run when search params change

  return { isLoading, productAdded, error };
};
