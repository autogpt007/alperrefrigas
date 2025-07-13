import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Eye, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  approved: boolean;
  created_at: string;
  order_index: number;
}

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === id ? { ...testimonial, approved } : testimonial
        )
      );

      toast.success(`Testimonial ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
      toast.success('Testimonial deleted successfully');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'pending') return !testimonial.approved;
    if (filter === 'approved') return testimonial.approved;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Testimonial Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-lg">Loading testimonials...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonial Management</CardTitle>
        <CardDescription>
          Review and manage customer testimonials
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({testimonials.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({testimonials.filter(t => !t.approved).length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved ({testimonials.filter(t => t.approved).length})
          </Button>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        {testimonial.position && testimonial.company && (
                          <p className="text-sm text-gray-600">
                            {testimonial.position} at {testimonial.company}
                          </p>
                        )}
                        {testimonial.position && !testimonial.company && (
                          <p className="text-sm text-gray-600">{testimonial.position}</p>
                        )}
                        {!testimonial.position && testimonial.company && (
                          <p className="text-sm text-gray-600">{testimonial.company}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={testimonial.approved ? 'default' : 'secondary'}>
                          {testimonial.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {!testimonial.approved && (
                      <Button
                        size="sm"
                        onClick={() => handleApproval(testimonial.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {testimonial.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(testimonial.id, false)}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-600">
                {filter === 'pending' && 'No testimonials are waiting for approval.'}
                {filter === 'approved' && 'No testimonials have been approved yet.'}
                {filter === 'all' && 'No testimonials have been submitted yet.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialManagement;