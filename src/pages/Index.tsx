
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HomePage from '../components/pages/HomePage';
import ProductCatalog from '../components/pages/ProductCatalog';
import ShippingCalculator from '../components/pages/ShippingCalculator';
import AccountDashboard from '../components/pages/AccountDashboard';
import CustomerSupport from '../components/pages/CustomerSupport';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

const Index = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/shipping" element={<ShippingCalculator />} />
              <Route path="/account" element={<AccountDashboard />} />
              <Route path="/support" element={<CustomerSupport />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
