import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HeroImage, HeroImageFormData } from '@/types/hero-image';
import { HeroImageForm } from './hero-image/HeroImageForm';
import { HeroImageList } from './hero-image/HeroImageList';

const HeroImageManagement = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<HeroImageFormData>({
    page_name: '',
    image_url: '',
    alt_text: '',
    is_active: true
  });

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('page_name', { ascending: true });

      if (error) throw error;
      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast.error('Failed to fetch hero images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.page_name || !formData.image_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hero_images')
        .upsert([{
          page_name: formData.page_name,
          image_url: formData.image_url,
          alt_text: formData.alt_text || null,
          is_active: formData.is_active
        }], {
          onConflict: 'page_name'
        })
        .select();

      if (error) throw error;

      toast.success('Hero image saved successfully');
      handleCancelForm();
      fetchHeroImages();
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast.error('Failed to save hero image');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({
      page_name: '',
      image_url: '',
      alt_text: '',
      is_active: true
    });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev =>
        prev.map(img =>
          img.id === id ? { ...img, is_active: isActive } : img
        )
      );

      toast.success(`Hero image ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating hero image:', error);
      toast.error('Failed to update hero image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev => prev.filter(img => img.id !== id));
      toast.success('Hero image deleted successfully');
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast.error('Failed to delete hero image');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-lg">Loading hero images...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Image Management</CardTitle>
        <CardDescription>
          Manage background images for different pages. Recommended dimensions: 1920x1080px (16:9 aspect ratio)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Hero Image'}
          </Button>
        </div>

        {showForm && (
          <HeroImageForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        <HeroImageList
          heroImages={heroImages}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default HeroImageManagement;