
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, MapPin, Clock, Award, Shield } from 'lucide-react';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import SocialMediaLinks from '@/components/ui/SocialMediaLinks';
import NewsletterSubscription from '@/components/ui/NewsletterSubscription';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Fetch company info
  const { data: companyInfo, refetch } = useQuery({
    queryKey: ['company-info'],
    staleTime: 30000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_name', 'company_tagline', 'main_phone']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};

      return {
        company_name: settingsMap.company_name || 'Alper Refrigerants',
        company_tagline: settingsMap.company_tagline || 'Professional Refrigerant Distribution',
        main_phone: settingsMap.main_phone || '1-787-965-8975'
      };
    },
  });

  // Listen for settings update event
  React.useEffect(() => {
    const handleSettingsUpdate = () => refetch();
    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdate);
  }, [refetch]);

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400">Get the latest refrigerant news and special offers delivered to your inbox.</p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterSubscription compact className="[&>div]:bg-gray-700 [&>input]:bg-gray-600 [&>input]:border-gray-500 [&>button]:bg-blue-600 [&>button]:hover:bg-blue-700" />
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AR</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('footer.companyName')}</h3>
                <p className="text-sm text-gray-400">{t('footer.companyTagline')}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <Award className="h-4 w-4 mr-2 text-blue-400" />
                {t('footer.epaCertified')}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                {t('footer.ahriMember')}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">{t('footer.productCatalog')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">{t('footer.shippingCalculator')}</Link></li>
              <li><Link to="/account" className="text-gray-300 hover:text-white transition-colors">{t('footer.myAccount')}</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">{t('footer.customerSupport')}</Link></li>
              <li><Link to="/compliance" className="text-gray-300 hover:text-white transition-colors">{t('footer.epaCompliance')}</Link></li>
              <li><Link to="/certifications" className="text-gray-300 hover:text-white transition-colors">{t('footer.certifications')}</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.productCategories')}</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=hfc" className="text-gray-300 hover:text-white transition-colors">{t('footer.hfcRefrigerants')}</Link></li>
              <li><Link to="/products?category=hfo" className="text-gray-300 hover:text-white transition-colors">{t('footer.hfoRefrigerants')}</Link></li>
              <li><Link to="/products?category=natural" className="text-gray-300 hover:text-white transition-colors">{t('footer.naturalRefrigerants')}</Link></li>
              <li><Link to="/products?category=automotive" className="text-gray-300 hover:text-white transition-colors">{t('footer.automotive')}</Link></li>
              <li><Link to="/products?category=commercial" className="text-gray-300 hover:text-white transition-colors">{t('footer.commercialHvac')}</Link></li>
              <li><Link to="/products?category=industrial" className="text-gray-300 hover:text-white transition-colors">{t('footer.industrial')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.contactInformation')}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="font-medium">Sales & Support</div>
                  <div className="text-sm text-gray-300">{companyInfo?.main_phone || '1-787-965-8975'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-300">sales@alperrefrigas.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="text-sm text-gray-300">Monday - Friday: 7:00 AM - 6:00 PM EST</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <div>
                  <div className="font-medium">Alper Chemical Group</div>
                  <div className="text-sm text-gray-300">
                    382 NE 191st St<br />
                    Miami, FL 33179<br />
                    United States
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
              <p className="text-xs text-blue-200 font-medium">
                B2B Supplier – Sales to EPA-certified HVAC professionals only
              </p>
            </div>
            <div className="mt-6">
              <SocialMediaLinks className="justify-start" />
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">{t('footer.weAccept')}</h4>
            <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-4">
              {/* Credit Cards */}
              <div className="bg-white rounded-lg p-2 w-12 h-8 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">VISA</span>
              </div>
              <div className="bg-white rounded-lg p-2 w-12 h-8 flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">MC</span>
              </div>
              <div className="bg-white rounded-lg p-2 w-12 h-8 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">AMEX</span>
              </div>
              <div className="bg-white rounded-lg p-2 w-12 h-8 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xs">DISC</span>
              </div>
              {/* PayPal */}
              <div className="bg-blue-600 rounded-lg p-2 w-16 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-xs">PayPal</span>
              </div>
              {/* Bank Wire */}
              <div className="bg-gray-700 rounded-lg p-2 w-20 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-xs">Wire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              {t('footer.copyright', { year: currentYear })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm justify-center md:justify-end">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund & Return Policy</Link>
              <Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link>
              <Link to="/payment-info" className="text-gray-400 hover:text-white transition-colors">Payment Information</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">{t('footer.sitemap')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
