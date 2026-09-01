import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MetaRedirects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const currentParams = new URLSearchParams(location.search);
    
    // Handle URL parameters - redirect to clean URLs
    if (currentParams.has('id') || currentParams.has('page') || currentParams.has('product')) {
      // Remove parameters and use clean URLs
      const productId = currentParams.get('id') || currentParams.get('product');
      if (productId && currentPath === '/products') {
        navigate(`/products/${productId}`, { replace: true });
        return;
      }
    }

    // Handle trailing slashes
    if (currentPath.endsWith('/') && currentPath !== '/') {
      navigate(currentPath.slice(0, -1), { replace: true });
      return;
    }

    // Apex SEO redirects
    const seoRedirects: Record<string, string> = {
      
      '/freon-wholesale': '/products',
      '/shipping': '/shipping-policy',
    };

    if (seoRedirects[currentPath]) {
      navigate(seoRedirects[currentPath], { replace: true });
      return;
    }

    // Handle legacy URLs with file extensions
    const legacyRedirects: Record<string, string> = {
      '/index.html': '/',
      '/home.html': '/',
      '/products.html': '/products',
      '/about.html': '/about',
      '/contact.html': '/contact',
      '/faq.html': '/faq',
    };

    if (legacyRedirects[currentPath]) {
      navigate(legacyRedirects[currentPath], { replace: true });
      return;
    }

    // Handle underscores in URLs - replace with hyphens
    if (currentPath.includes('_')) {
      const cleanPath = currentPath.replace(/_/g, '-');
      navigate(cleanPath, { replace: true });
      return;
    }

    // Handle duplicate slashes
    if (currentPath.includes('//')) {
      const cleanPath = currentPath.replace(/\/+/g, '/');
      navigate(cleanPath, { replace: true });
      return;
    }

  }, [location, navigate]);

  return null;
};

export default MetaRedirects;