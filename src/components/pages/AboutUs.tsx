
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, Users, Globe, CheckCircle, Star, Truck, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  const achievements = [
    { icon: Award, title: "EPA Certified", description: "Fully certified for refrigerant handling and distribution" },
    { icon: Shield, title: "25+ Years Experience", description: "Industry leaders with decades of expertise" },
    { icon: Users, title: "10,000+ Customers", description: "Trusted by businesses across North America" },
    { icon: Globe, title: "Nationwide Coverage", description: "Serving customers from coast to coast" }
  ];

  const values = [
    {
      title: "Quality Assurance",
      description: "Every product meets the highest industry standards and EPA regulations",
      icon: CheckCircle
    },
    {
      title: "Customer Excellence",
      description: "Dedicated support team providing expert guidance and rapid response",
      icon: Star
    },
    {
      title: "Reliable Delivery",
      description: "Fast, secure shipping with real-time tracking and temperature control",
      icon: Truck
    },
    {
      title: "Technical Support",
      description: "Professional consultation for optimal refrigerant selection and usage",
      icon: Phone
    }
  ];

  const teamMembers = [
    {
      name: "Michael Rodriguez",
      position: "CEO & Founder",
      experience: "30+ years in refrigeration industry",
      expertise: "EPA regulations, business strategy"
    },
    {
      name: "Sarah Chen",
      position: "VP of Operations",
      experience: "15+ years in supply chain",
      expertise: "Logistics, quality control"
    },
    {
      name: "David Thompson",
      position: "Technical Director",
      experience: "20+ years in HVAC systems",
      expertise: "Refrigerant chemistry, applications"
    },
    {
      name: "Lisa Martinez",
      position: "Customer Success Manager",
      experience: "12+ years in customer service",
      expertise: "Client relations, technical support"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - North American Refrigerants</title>
        <meta name="description" content="Learn about North American Refrigerants - your trusted partner for premium refrigerant solutions with 25+ years of industry experience." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">North American Refrigerants</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              For over 25 years, we've been North America's premier provider of high-quality refrigerants, 
              serving HVAC professionals, industrial clients, and automotive specialists with unmatched 
              expertise and reliability.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="bg-slate-800/30 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  To provide the highest quality refrigerants and exceptional service while maintaining 
                  strict environmental compliance and safety standards. We empower our customers with 
                  the products and knowledge they need to succeed in an ever-evolving industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our <span className="text-cyan-400">Achievements</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                      <p className="text-gray-300">{achievement.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Our <span className="text-cyan-400">Story</span>
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Founded in 1999, North American Refrigerants began as a small family business with a 
                    simple goal: to provide reliable, high-quality refrigerants to local HVAC contractors.
                  </p>
                  <p>
                    As environmental regulations evolved and the industry transformed, we adapted and grew, 
                    becoming early adopters of eco-friendly refrigerants and investing heavily in 
                    compliance and certification programs.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of customers across North America, from small 
                    independent contractors to large industrial facilities, always maintaining our 
                    commitment to quality, service, and environmental responsibility.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Industrial facility"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Our <span className="text-cyan-400">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                          <p className="text-gray-300">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Meet Our <span className="text-cyan-400">Team</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-3">
                      {member.position}
                    </Badge>
                    <p className="text-sm text-gray-400 mb-2">{member.experience}</p>
                    <p className="text-sm text-gray-300">{member.expertise}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Certifications & <span className="text-cyan-400">Compliance</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">EPA Section 608</h3>
                  <p className="text-gray-300">Certified for refrigerant recovery and recycling</p>
                </div>
                <div className="text-center">
                  <Award className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">ISO 9001:2015</h3>
                  <p className="text-gray-300">Quality management system certification</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">DOT Hazmat</h3>
                  <p className="text-gray-300">Licensed for hazardous material transportation</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
