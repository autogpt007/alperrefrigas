
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
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ProductCatalog from './components/pages/ProductCatalog';
import ProductDetails from './components/pages/ProductDetails';
import RFQPage from './components/pages/RFQPage';
import CustomerPortal from './components/pages/CustomerPortal';
import AdminDashboard from './components/pages/AdminDashboard';
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

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ProductsProvider>
              <OrdersProvider>
                <RFQProvider>
                  <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductCatalog />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/rfq" element={<RFQPage />} />
                        <Route path="/portal" element={<CustomerPortal />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/shipping" element={<ShippingCalculator />} />
                        <Route path="/support" element={<CustomerSupport />} />
                        <Route path="/account" element={<CustomerPortal />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/cookies" element={<CookiePolicy />} />
                        <Route path="/compliance" element={<EPACompliance />} />
                        <Route path="/certifications" element={<Certifications />} />
                        <Route path="/sitemap" element={<Sitemap />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </RFQProvider>
              </OrdersProvider>
            </ProductsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
