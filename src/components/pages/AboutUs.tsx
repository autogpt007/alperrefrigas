import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Shield, CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TestimonialSection from '@/components/ui/TestimonialSection';
import TestimonialForm from '@/components/ui/TestimonialForm';
import SEOComponent from '@/components/seo/SEOComponent';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  order_index: number;
}

interface HeroImage {
  id: string;
  page_name: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
  approved: boolean;
  order_index: number | null;
}

const AboutUs = () => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [facilityImage, setFacilityImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true });

        if (teamError) throw teamError;
        setTeamMembers(teamData || []);

        // Fetch testimonials
        const { data: testimonialData, error: testimonialError } = await supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('order_index', { ascending: true });

        if (testimonialError) throw testimonialError;
        setTestimonials(testimonialData || []);

        // Fetch hero image for About Us page
        const { data: heroData, error: heroError } = await supabase
          .from('hero_images')
          .select('image_url')
          .eq('page_name', 'about-hero')
          .eq('is_active', true)
          .maybeSingle();

        if (!heroError && heroData) {
          setHeroImage(heroData.image_url);
        }

        // Fetch facility image for About Us page
        const { data: facilityData, error: facilityError } = await supabase
          .from('hero_images')
          .select('image_url')
          .eq('page_name', 'about-facility')
          .eq('is_active', true)
          .maybeSingle();

        if (!facilityError && facilityData) {
          setFacilityImage(facilityData.image_url);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Structured data for About page
  const aboutPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization", 
      "name": "Alper Refrigerants",
      "alternateName": "Alper Refrigerants",
      "description": "Professional wholesale refrigerant distributor serving HVAC contractors, automotive technicians, and industrial facilities across North America with EPA-certified refrigerants.",
      "foundingDate": "2010",
      "numberOfEmployees": "25-50",
      "naics": "423730",
      "isicV4": "4661",
      "specialty": [
        "HFC Refrigerant Distribution",
        "HFO Refrigerant Sales", 
        "Natural Refrigerant Supply",
        "EPA Section 608 Compliance",
        "HVAC Technical Support",
        "Bulk Refrigerant Sales"
      ]
    }
  };

  return (
    <>
      <SEOComponent
        title="About Alper Refrigerants - 13+ Years Leading Turkey's Refrigerant Market | EPA Certified"
        description="⭐ Established 2011. Turkey's most trusted refrigerant distributor with 13+ years experience. 500+ satisfied customers, 99.9% purity guarantee, ISO certified facility. Expert team serving HVAC professionals, contractors & industrial clients nationwide."
        keywords="about alper refrigerants, refrigerant distributor turkey history, EPA certified company, professional HVAC supplier, wholesale refrigerant company turkey, HVAC contractor supplier, refrigerant distribution services, refrigerant company since 2011"
        canonicalUrl="/about"
        structuredData={aboutPageStructuredData}
        ogType="article"
      />
      
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 bg-cover bg-center"
        style={{
          backgroundImage: heroImage 
            ? `linear-gradient(rgba(37, 99, 235, 0.8), rgba(29, 78, 216, 0.8)), url(${heroImage})`
            : undefined
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.heroTitle')}</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('about.heroSubtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                {t('about.epaCertified')}
              </Badge>
              <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2" />
                {t('about.ahriMember')}
              </Badge>
              <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('about.isoCertified')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.ourMission')}</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {t('about.missionDescription1')}
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {t('about.missionDescription2')}
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">13+</div>
                  <div className="text-sm text-gray-600">{t('about.yearsExperience')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5000+</div>
                  <div className="text-sm text-gray-600">{t('about.customersServed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.8%</div>
                  <div className="text-sm text-gray-600">{t('about.purityRating')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-lg">
                {facilityImage ? (
                  <img 
                    src={facilityImage} 
                    alt="Alper Refrigerants Professional Facility" 
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                ) : (
                  <div className="rounded-xl shadow-lg w-full h-80 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                    <div className="text-center text-blue-800">
                      <div className="text-2xl font-bold mb-2">Alper Refrigerants</div>
                      <div className="text-lg">Professional Facility</div>
                      <div className="text-sm mt-2 opacity-75">Upload your facility image in Admin → Website Images</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.commitmentToQuality')}</h2>
            <p className="text-gray-600 text-lg">{t('about.qualityDescription')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{t('about.epaCertification')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('about.epaCertificationDescription')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{t('about.qualityAssurance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('about.qualityAssuranceDescription')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{t('about.technicalExpertise')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('about.technicalExpertiseDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.meetOurTeam')}</h2>
            <p className="text-gray-600 text-lg">{t('about.teamDescription')}</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
            <p className="text-gray-600">Loading team members...</p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                          <Users className="h-12 w-12 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Fallback static team if no team members in database
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">John Alper</h3>
                  <p className="text-blue-600 font-medium mb-3">Founder & CEO</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    With over 20 years in the HVAC industry, John founded Alper Refrigerants with a vision 
                    to provide unmatched quality and service to HVAC professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Martinez</h3>
                  <p className="text-blue-600 font-medium mb-3">Operations Director</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Sarah oversees our distribution network and ensures every order meets our 
                    rigorous quality standards before reaching our customers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Chen</h3>
                  <p className="text-blue-600 font-medium mb-3">Technical Specialist</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    EPA certified with 15+ years of experience, Mike provides technical support and 
                    helps customers choose the right refrigerant for their specific applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.whyChooseUs')}</h2>
            <p className="text-gray-600 text-lg">{t('about.whyChooseUsDescription')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">EPA Section 608 Certified</h3>
              <p className="text-gray-600 text-sm">
                Fully licensed refrigerant distributor with EPA certification and DOT hazmat permits for safe transport across North America.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">99.8% Purity Guarantee</h3>
              <p className="text-gray-600 text-sm">
                Laboratory-tested refrigerants meeting AHRI standards with complete certification documentation for regulatory compliance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support Team</h3>
              <p className="text-gray-600 text-sm">
                EPA-certified specialists provide expert guidance on refrigerant selection and regulatory compliance for your applications.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Bulk Pricing</h3>
              <p className="text-gray-600 text-sm">
                Wholesale pricing for contractors with volume discounts and dedicated account management for large orders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Testimonial Form */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
            <p className="text-gray-600 text-lg">
              Help other HVAC professionals by sharing your experience with Alper Refrigerants
            </p>
          </div>
          <TestimonialForm />
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
