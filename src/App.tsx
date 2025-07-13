
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";
import { RFQProvider } from "./contexts/RFQContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { QuotesProvider } from "./contexts/QuotesContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import HomePage from "./components/pages/HomePage";
import ProductCatalog from "./components/pages/ProductCatalog";
import ProductDetails from "./components/pages/ProductDetails";
import CartPage from "./components/pages/CartPage";
import RFQPage from "./components/pages/RFQPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrderConfirmation from "./components/pages/OrderConfirmation";
import AboutUs from "./components/pages/AboutUs";
import ContactUs from "./components/pages/ContactUs";
import FAQ from "./components/pages/FAQ";
import ShippingCalculator from "./components/pages/ShippingCalculator";
import EPACompliance from "./components/pages/EPACompliance";
import Certifications from "./components/pages/Certifications";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsOfService from "./components/pages/TermsOfService";
import CookiePolicy from "./components/pages/CookiePolicy";
import RefundPolicy from "./components/pages/RefundPolicy";
import Sitemap from "./components/pages/Sitemap";
import CustomerSupport from "./components/pages/CustomerSupport";
import AdminDashboard from "./components/pages/AdminDashboard";
import MyAccount from "./components/pages/MyAccount";
import AuthPage from "./components/auth/AuthPage";
import UserAuthPage from "./components/auth/UserAuthPage";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import EnhancedProductManagement from "./components/admin/EnhancedProductManagement";
import OrderManagement from "./components/admin/OrderManagement";
import SimpleBlogManagement from "./components/admin/SimpleBlogManagement";
import ContactManagement from "./components/admin/ContactManagement";
import AdminSettings from "./components/admin/AdminSettings";
import TeamManagement from "./components/admin/TeamManagement";
import CertificationManagement from "./components/admin/CertificationManagement";
import ContentManagement from "./components/admin/ContentManagement";
import FeaturedProductManagement from "./components/admin/FeaturedProductManagement";
import TestimonialManagement from "./components/admin/TestimonialManagement";
import HeroImageManagement from "./components/admin/HeroImageManagement";
import BlogPage from "./components/pages/BlogPage";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <RFQProvider>
                <QuotesProvider>
                  <OrdersProvider>
                  <Toaster />
                  <BrowserRouter>
                    <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<EnhancedProductManagement />} />
                        <Route path="featured-products" element={<FeaturedProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="blog" element={<SimpleBlogManagement />} />
                        <Route path="contacts" element={<ContactManagement />} />
                        <Route path="team" element={<TeamManagement />} />
                        <Route path="certificates" element={<CertificationManagement />} />
                        <Route path="content" element={<ContentManagement />} />
                        <Route path="testimonials" element={<TestimonialManagement />} />
                        <Route path="hero-images" element={<HeroImageManagement />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>
                      
                      {/* Public Routes */}
                      <Route path="/*" element={
                        <div className="min-h-screen flex flex-col">
                          <Header />
                          <main className="flex-1">
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/products" element={<ProductCatalog />} />
                              <Route path="/products/:id" element={<ProductDetails />} />
                              <Route path="/cart" element={<CartPage />} />
                              <Route path="/rfq" element={<RFQPage />} />
                              <Route path="/checkout" element={<CheckoutPage />} />
                              <Route path="/order-confirmation" element={<OrderConfirmation />} />
                              <Route path="/quote-confirmation" element={<OrderConfirmation />} />
                              <Route path="/about" element={<AboutUs />} />
                              <Route path="/contact" element={<ContactUs />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/shipping" element={<ShippingCalculator />} />
                              <Route path="/compliance" element={<EPACompliance />} />
                              <Route path="/certifications" element={<Certifications />} />
                              <Route path="/privacy" element={<PrivacyPolicy />} />
                              <Route path="/terms" element={<TermsOfService />} />
                              <Route path="/refund-policy" element={<RefundPolicy />} />
                              <Route path="/cookies" element={<CookiePolicy />} />
                              <Route path="/sitemap" element={<Sitemap />} />
                              <Route path="/support" element={<CustomerSupport />} />
                              <Route path="/account" element={<MyAccount />} />
                              <Route path="/auth" element={<UserAuthPage />} />
                              <Route path="/admin-auth" element={<AuthPage />} />
                              <Route path="/blog" element={<BlogPage />} />
                            </Routes>
                          </main>
                          <Footer />
                          <WhatsAppButton phoneNumber="+18007347443" />
                        </div>
                      } />
                    </Routes>
                  </BrowserRouter>
                  </OrdersProvider>
                </QuotesProvider>
              </RFQProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
