
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import { RFQProvider } from './contexts/RFQContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrdersProvider } from './contexts/OrdersContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/HomePage';
import Products from './components/pages/ProductCatalog';
import ProductDetail from './components/pages/ProductDetails';
import Cart from './components/pages/CartPage';
import Checkout from './components/pages/CheckoutPage';
import RFQForm from './components/pages/RFQPage';
import OrderConfirmation from './components/pages/OrderConfirmation';
import AuthPage from './components/auth/AuthPage';
import AuthModal from './components/AuthModal';
import { Toaster } from '@/components/ui/toaster';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import ContentManagement from './components/admin/ContentManagement';
import AdminSettings from './components/admin/AdminSettings';
import NotFound from './pages/NotFound';
import SimpleBlogManagement from './components/admin/SimpleBlogManagement';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const queryClient = new QueryClient();

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <RFQProvider>
              <OrdersProvider>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  <Router>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/rfq" element={<RFQForm />} />
                          <Route path="/order-confirmation" element={<OrderConfirmation />} />
                          <Route path="/auth" element={<AuthPage />} />
                          
                          {/* Admin Routes */}
                          <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="posts" element={<SimpleBlogManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="content" element={<ContentManagement />} />
                            <Route path="settings" element={<AdminSettings />} />
                          </Route>
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </Router>

                  {/* Modals */}
                  <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
                  <Toaster />
                </div>
              </OrdersProvider>
            </RFQProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
