
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Shield, CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  order_index: number;
}

const AboutUs = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/team_members?order=order_index.asc`, {
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Alper Refrigerants</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your trusted partner in refrigerant distribution since 2010
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-blue-500 text-white px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                EPA Certified
              </Badge>
              <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2" />
                AHRI Member
              </Badge>
              <Badge className="bg-purple-500 text-white px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                ISO Certified
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded in 2010, Alper Refrigerants began as a small family business with a simple mission: 
                to provide HVAC professionals with reliable, high-quality refrigerants and exceptional service. 
                What started in a single warehouse has grown into North America's most trusted refrigerant distributor.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Today, we serve thousands of customers across the United States and Canada, maintaining the same 
                commitment to quality and personal service that our founder established over a decade ago. 
                Every cylinder that leaves our facility meets the highest industry standards.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">13+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5000+</div>
                  <div className="text-sm text-gray-600">Customers Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.8%</div>
                  <div className="text-sm text-gray-600">Purity Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-lg">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Alper Refrigerants Facility" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide HVAC professionals with the highest quality refrigerants, exceptional service, 
                  and expert support they need to succeed in their business.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be North America's most trusted refrigerant distributor, known for our reliability, 
                  expertise, and commitment to environmental responsibility.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quality, integrity, and customer service are at the heart of everything we do. 
                  We build lasting relationships based on trust and mutual success.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">The experts behind your refrigerant solutions</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Alper Refrigerants?</h2>
            <p className="text-gray-600 text-lg">What sets us apart in the refrigerant industry</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">EPA Certified</h3>
              <p className="text-gray-600 text-sm">
                Fully licensed and certified for refrigerant handling and distribution across North America.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 text-sm">
                Every product meets or exceeds industry standards with guaranteed purity and performance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Technical specialists available to help you choose the right refrigerant for your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Service</h3>
              <p className="text-gray-600 text-sm">
                Dedicated account managers who understand your business and provide personalized solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
