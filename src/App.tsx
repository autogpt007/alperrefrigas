
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { RFQProvider } from './contexts/RFQContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { CartProvider } from './contexts/CartContext';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import BlogPostManagement from './components/admin/BlogPostManagement';
import OrderManagement from './components/admin/OrderManagement';
import AdminSettings from './components/admin/AdminSettings';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ProductCatalog from './components/pages/ProductCatalog';
import ProductDetails from './components/pages/ProductDetails';
import RFQPage from './components/pages/RFQPage';
import CustomerPortal from './components/pages/CustomerPortal';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderConfirmation from './components/pages/OrderConfirmation';
import ShippingCalculator from './components/pages/ShippingCalculator';
import CustomerSupport from './components/pages/CustomerSupport';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import CookiePolicy from './components/pages/CookiePolicy';
import EPACompliance from './components/pages/EPACompliance';
import Certifications from './components/pages/Certifications';
import Sitemap from './components/pages/Sitemap';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ProductsProvider>
                <OrdersProvider>
                  <CartProvider>
                    <RFQProvider>
                      <Routes>
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<Dashboard />} />
                          <Route path="products" element={<ProductManagement />} />
                          <Route path="posts" element={<BlogPostManagement />} />
                          <Route path="orders" element={<OrderManagement />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>

                        {/* Public Routes */}
                        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                        <Route path="/products" element={<PublicLayout><ProductCatalog /></PublicLayout>} />
                        <Route path="/products/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
                        <Route path="/rfq" element={<PublicLayout><RFQPage /></PublicLayout>} />
                        <Route path="/portal" element={<PublicLayout><CustomerPortal /></PublicLayout>} />
                        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
                        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
                        <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
                        <Route path="/shipping" element={<PublicLayout><ShippingCalculator /></PublicLayout>} />
                        <Route path="/support" element={<PublicLayout><CustomerSupport /></PublicLayout>} />
                        <Route path="/account" element={<PublicLayout><CustomerPortal /></PublicLayout>} />
                        <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
                        <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
                        <Route path="/cookies" element={<PublicLayout><CookiePolicy /></PublicLayout>} />
                        <Route path="/compliance" element={<PublicLayout><EPACompliance /></PublicLayout>} />
                        <Route path="/certifications" element={<PublicLayout><Certifications /></PublicLayout>} />
                        <Route path="/sitemap" element={<PublicLayout><Sitemap /></PublicLayout>} />
                        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
                      </Routes>
                    </RFQProvider>
                  </CartProvider>
                </OrdersProvider>
              </ProductsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
