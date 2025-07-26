
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, MapPin, Clock, Award, Shield } from 'lucide-react';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import SocialMediaLinks from '@/components/ui/SocialMediaLinks';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Fetch company info
  const { data: companyInfo } = useQuery({
    queryKey: ['company-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_name', 'company_tagline']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};

      return {
        company_name: settingsMap.company_name || 'Alper Refrigerants',
        company_tagline: settingsMap.company_tagline || 'Professional Refrigerant Distribution'
      };
    },
  });

  return (
    <footer className="bg-gray-900 text-white">
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
            <ContactDisplay category="general" className="text-gray-300 space-y-4" />
            <div className="mt-6">
              <SocialMediaLinks className="justify-start" />
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">{t('footer.weAccept')}</h4>
            <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
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
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund & Return Policy</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">{t('footer.cookiePolicy')}</Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">{t('footer.sitemap')}</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">{t('footer.faq')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
