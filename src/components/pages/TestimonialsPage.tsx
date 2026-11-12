import React, { useState, useEffect } from 'react';
import { Star, Quote, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TestimonialForm from '@/components/ui/TestimonialForm';
import SEOComponent from '@/components/seo/SEOComponent';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  created_at: string;
}

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Optionally refresh testimonials (though new ones won't show until approved)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOComponent
        title="Customer Reviews | Alper Refrigerants"
        description="Read what HVAC professionals say about Alper Refrigerants. See testimonials from contractors who trust us for their refrigerant supply needs."
        keywords="customer testimonials, HVAC reviews, refrigerant supplier reviews, Alper Refrigerants feedback, contractor testimonials"
        canonicalUrl="/testimonials"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Testimonials", url: "/testimonials" }]}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="bg-green-600 text-white mb-6 px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                Trusted by 5,000+ HVAC Professionals
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                What Our Customers Say
              </h1>
              <p className="text-xl text-blue-200 mb-8">
                Real experiences from HVAC contractors and technicians who trust Alper Refrigerants for their business
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">4.9/5</div>
                  <div className="text-blue-200">Average Rating</div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{testimonials.length}+</div>
                  <div className="text-blue-200">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">5,000+</div>
                  <div className="text-blue-200">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            {testimonials.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No testimonials yet</h3>
                <p className="text-gray-600 mb-8">Be the first to share your experience with Alper Refrigerants!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Rating and Quote */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Quote className="h-8 w-8 text-blue-500" />
                      </div>
                      
                      {/* Content */}
                      <p className="text-gray-700 mb-6 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      
                      {/* Author */}
                      <div className="flex items-center">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-semibold text-lg">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          {testimonial.position && testimonial.company && (
                            <div className="text-sm text-gray-600">
                              {testimonial.position} at {testimonial.company}
                            </div>
                          )}
                          {testimonial.position && !testimonial.company && (
                            <div className="text-sm text-gray-600">{testimonial.position}</div>
                          )}
                          {!testimonial.position && testimonial.company && (
                            <div className="text-sm text-gray-600">{testimonial.company}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonial Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Experience</h2>
              <p className="text-gray-600 text-lg">
                Help other HVAC professionals by sharing your experience with Alper Refrigerants
              </p>
            </div>

            {!showForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              <TestimonialForm onSuccess={handleFormSuccess} />
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience the Difference?
              </h2>
              <p className="text-xl text-blue-200 mb-8">
                Join thousands of satisfied HVAC professionals who trust Alper Refrigerants
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
                >
                  Shop Refrigerants
                </a>
                <a
                  href="/contact"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TestimonialsPage;