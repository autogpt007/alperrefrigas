
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { RFQProvider } from './contexts/RFQContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ProductCatalog from './components/pages/ProductCatalog';
import ProductDetails from './components/pages/ProductDetails';
import RFQPage from './components/pages/RFQPage';
import CustomerPortal from './components/pages/CustomerPortal';
import AdminDashboard from './components/pages/AdminDashboard';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RFQProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductCatalog />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/rfq" element={<RFQPage />} />
                  <Route path="/portal" element={<CustomerPortal />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </RFQProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
