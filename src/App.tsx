
import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFavicon } from "./hooks/useFavicon";
import ResourceOptimizer from '@/components/seo/ResourceOptimizer';
import CriticalCSS from '@/components/seo/CriticalCSS';
import MetaRedirects from '@/components/seo/MetaRedirects';

import SecurityHeaders from '@/components/security/SecurityHeaders';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";
import { RFQProvider } from "./contexts/RFQContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { QuotesProvider } from "./contexts/QuotesContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ChatToggle } from "./components/ui/ChatToggle";
import { TawkToChat } from "./components/ui/TawkToChat";
import "./App.css";

// Critical path - eagerly loaded
import HomePage from "./components/pages/HomePage";
import ProductCatalog from "./components/pages/ProductCatalog";
import ProductDetails from "./components/pages/ProductDetails";

// Lazy-loaded routes
const R454BLandingPage = lazy(() => import("./components/pages/R454BLandingPage"));
const HFOLandingPage = lazy(() => import("./components/pages/HFOLandingPage"));
const ProductCategory = lazy(() => import("./components/pages/ProductCategory"));
const CartPage = lazy(() => import("./components/pages/CartPage"));
const RFQPage = lazy(() => import("./components/pages/RFQPage"));
const CheckoutPage = lazy(() => import("./components/pages/CheckoutPage"));
const BulkPricing = lazy(() => import("./pages/BulkPricing"));
const Health = lazy(() => import("./pages/Health"));
const OrderConfirmation = lazy(() => import("./components/pages/OrderConfirmation"));
const AboutUs = lazy(() => import("./components/pages/AboutUs"));
const ContactUs = lazy(() => import("./components/pages/ContactUs"));
const FAQ = lazy(() => import("./components/pages/FAQ"));
const ShippingCalculator = lazy(() => import("./components/pages/ShippingCalculator"));
const EPACompliance = lazy(() => import("./components/pages/EPACompliance"));
const Certifications = lazy(() => import("./components/pages/Certifications"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./components/pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./components/pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./components/pages/ShippingPolicy"));
const PaymentInformation = lazy(() => import("./components/pages/PaymentInformation"));
const Sitemap = lazy(() => import("./components/pages/Sitemap"));
const CustomerSupport = lazy(() => import("./components/pages/CustomerSupport"));
const CryptoPaymentPage = lazy(() => import("./components/pages/CryptoPaymentPage"));
const MyAccount = lazy(() => import("./components/pages/MyAccount"));
const AuthPage = lazy(() => import("./components/auth/AuthPage"));
const UserAuthPage = lazy(() => import("./components/auth/UserAuthPage"));
const TestimonialsPage = lazy(() => import("./components/pages/TestimonialsPage"));
const BlogPage = lazy(() => import("./components/pages/BlogPage"));
const BlogPostDetail = lazy(() => import("./components/pages/BlogPostDetail"));
const BlogPostRedirect = lazy(() => import("./components/pages/BlogPostRedirect"));
const KYCVerificationPage = lazy(() => import("./components/pages/KYCVerificationPage"));
const UnsubscribePage = lazy(() => import("./components/pages/UnsubscribePage"));

// Admin lazy-loaded
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const EnhancedProductManagement = lazy(() => import("./components/admin/EnhancedProductManagement"));
const ACProductManagement = lazy(() => import("./components/admin/ACProductManagement"));
const PricingTiersManagement = lazy(() => import("./components/admin/PricingTiersManagement"));
const AccessoryManagement = lazy(() => import("./components/admin/AccessoryManagement"));
const OrderManagement = lazy(() => import("./components/admin/OrderManagement"));
const BlogPostManagement = lazy(() => import("./components/admin/BlogPostManagement"));
const LogoManagement = lazy(() => import("./components/admin/LogoManagement"));
const ContactManagement = lazy(() => import("./components/admin/ContactManagement"));
const ContactInfoManagement = lazy(() => import("./components/admin/ContactInfoManagement"));
const AdminSettings = lazy(() => import("./components/admin/AdminSettings"));
const PaymentManagement = lazy(() => import("./components/admin/PaymentManagement"));
const TeamManagement = lazy(() => import("./components/admin/TeamManagement"));
const CertificationManagement = lazy(() => import("./components/admin/CertificationManagement"));
const ContentManagement = lazy(() => import("./components/admin/ContentManagement"));
const FeaturedProductManagement = lazy(() => import("./components/admin/FeaturedProductManagement"));
const TestimonialManagement = lazy(() => import("./components/admin/TestimonialManagement"));
const HeroImageManagement = lazy(() => import("./components/admin/HeroImageManagement"));
const AdvertManagement = lazy(() => import("./components/admin/AdvertManagement"));
const CouponManagement = lazy(() => import("./components/admin/CouponManagement"));
const NewsletterManagement = lazy(() => import("./components/admin/NewsletterManagement"));
const SitemapGenerator = lazy(() => import("./components/admin/SitemapGenerator"));
const PageContentManagement = lazy(() => import("./components/admin/PageContentManagement"));
const TaxRatesManagement = lazy(() => import("./components/admin/TaxRatesManagement"));
const InternationalTaxManagement = lazy(() => import("./components/admin/InternationalTaxManagement"));
const ExchangeRateManagement = lazy(() => import("./components/admin/ExchangeRateManagement"));
const ShippingManagement = lazy(() => import("./components/admin/ShippingManagement"));
const GoogleAdsEngine = lazy(() => import("./components/admin/GoogleAdsEngine"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  useFavicon();
  
  return (
    <>
      <SecurityHeaders />
      <SecurityMonitor />
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <TooltipProvider>
          <AuthProvider>
            <ProductsProvider>
              <CartProvider>
                <RFQProvider>
                  <QuotesProvider>
                     <OrdersProvider>
                        <ResourceOptimizer>
                          <CriticalCSS />
                          <Toaster />
                         <BrowserRouter>
                          <MetaRedirects />
                    <Suspense fallback={<PageFallback />}>
                    <Routes>
                      {/* Admin Routes */}
                       <Route path="/admin" element={<AdminLayout />}>
                         <Route index element={<Dashboard />} />
                         <Route path="products" element={<EnhancedProductManagement />} />
                         <Route path="ac-products" element={<ACProductManagement />} />
                         <Route path="pricing" element={<PricingTiersManagement />} />
                         <Route path="accessories" element={<AccessoryManagement />} />
                         <Route path="featured-products" element={<FeaturedProductManagement />} />
                         <Route path="orders" element={<OrderManagement />} />
                         <Route path="shipping" element={<ShippingManagement />} />
                         <Route path="blog" element={<BlogPostManagement />} />
                         <Route path="adverts" element={<AdvertManagement />} />
                         <Route path="google-ads-engine" element={<GoogleAdsEngine />} />
                          <Route path="coupons" element={<CouponManagement />} />
                          <Route path="payment-methods" element={<PaymentManagement />} />
                          <Route path="tax-rates" element={<TaxRatesManagement />} />
                          <Route path="international-taxes" element={<InternationalTaxManagement />} />
                          <Route path="exchange-rates" element={<ExchangeRateManagement />} />
                          <Route path="newsletter" element={<NewsletterManagement />} />
                         <Route path="logo" element={<LogoManagement />} />
                         <Route path="contacts" element={<ContactManagement />} />
                         <Route path="contact-info" element={<ContactInfoManagement />} />
                         <Route path="team" element={<TeamManagement />} />
                         <Route path="certificates" element={<CertificationManagement />} />
                         <Route path="content" element={<ContentManagement />} />
                          <Route path="testimonials" element={<TestimonialManagement />} />
                          <Route path="hero-images" element={<HeroImageManagement />} />
                          <Route path="page-content" element={<PageContentManagement />} />
                          <Route path="sitemap" element={<SitemapGenerator />} />
                          <Route path="settings" element={<AdminSettings />} />
                       </Route>
                      
                      {/* Public Routes */}
                      <Route path="/*" element={
                        <div className="min-h-screen flex flex-col">
                          <Header />
                          <main className="flex-1">
                            <Routes>
                           <Route path="/" element={<HomePage />} />
                           <Route path="/freon-wholesale" element={<Navigate to="/products" replace />} />
                                <Route path="/products" element={<ProductCatalog />} />
                                <Route path="/products/refrigerants" element={<ProductCatalog />} />
                                <Route path="/products/accessories" element={<ProductCatalog />} />
                                <Route path="/products/air-conditioners" element={<Navigate to="/products/accessories" replace />} />
                                <Route path="/products/air-conditioners/:subcategory" element={<ProductCatalog />} />
                                 <Route path="/products/r-454b" element={<R454BLandingPage />} />
                                 <Route path="/products/hfo-refrigerants" element={<HFOLandingPage />} />
                                 <Route path="/products/category/:category" element={<ProductCategory />} />
                                 <Route path="/products/accessories/:category" element={<ProductCategory />} />
                                 <Route path="/products/:productSlug" element={<ProductDetails />} />
                                <Route path="/products/:id" element={<ProductDetails />} />
                               <Route path="/cart" element={<CartPage />} />
                               <Route path="/bulk-pricing" element={<BulkPricing />} />
                              <Route path="/rfq" element={<RFQPage />} />
                               <Route path="/checkout" element={<CheckoutPage />} />
                               <Route path="/crypto-payment/:orderNumber" element={<CryptoPaymentPage />} />
                               <Route path="/order-confirmation" element={<OrderConfirmation />} />
                              <Route path="/quote-confirmation" element={<OrderConfirmation />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/about" element={<AboutUs />} />
                              <Route path="/contact" element={<ContactUs />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
                              <Route path="/compliance" element={<EPACompliance />} />
                              <Route path="/certifications" element={<Certifications />} />
                              <Route path="/privacy" element={<PrivacyPolicy />} />
                              <Route path="/terms" element={<TermsOfService />} />
                              <Route path="/refund-policy" element={<RefundPolicy />} />
                              <Route path="/shipping-policy" element={<ShippingPolicy />} />
                              <Route path="/payment-info" element={<PaymentInformation />} />
                              <Route path="/cookies" element={<CookiePolicy />} />
                              <Route path="/sitemap" element={<Sitemap />} />
                               <Route path="/support" element={<CustomerSupport />} />
                               <Route path="/health" element={<Health />} />
                               <Route path="/account" element={<MyAccount />} />
                               <Route path="/auth" element={<UserAuthPage />} />
                               <Route path="/admin-auth" element={<AuthPage />} />
                               <Route path="/blog" element={<BlogPage />} />
                               <Route path="/blog/:slug" element={<BlogPostDetail />} />
                               <Route path="/news/:slug" element={<BlogPostRedirect />} />
                               <Route path="/kyc/:token" element={<KYCVerificationPage />} />
                               <Route path="/unsubscribe" element={<UnsubscribePage />} />
                             </Routes>
                          </main>
                           <Footer />
                           <ChatToggle />
                           <TawkToChat />
                        </div>
                      } />
                    </Routes>
                    </Suspense>
                        </BrowserRouter>
                      </ResourceOptimizer>
                    </OrdersProvider>
                  </QuotesProvider>
                </RFQProvider>
              </CartProvider>
            </ProductsProvider>
          </AuthProvider>
        </TooltipProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
