import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Eye } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HeroImage {
  id: string;
  page_name: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PAGE_OPTIONS = [
  { value: 'about', label: 'About Us Page' },
  { value: 'home', label: 'Home Page' },
  { value: 'contact', label: 'Contact Page' },
  { value: 'products', label: 'Products Page' }
];

const HeroImageManagement = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
      setShowForm(false);
      setFormData({
        page_name: '',
        image_url: '',
        alt_text: '',
        is_active: true
      });
      fetchHeroImages();
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast.error('Failed to save hero image');
    }
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add/Edit Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="page_name">Page</Label>
                  <Select value={formData.page_name} onValueChange={(value) => setFormData(prev => ({ ...prev, page_name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hero Image</Label>
                  <ImageUpload
                    onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    currentImage={formData.image_url}
                    bucket="images"
                  />
                </div>

                <div>
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="Descriptive text for accessibility"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <Button type="submit">Save Hero Image</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hero Images List */}
        <div className="space-y-4">
          {heroImages.map((heroImage) => (
            <Card key={heroImage.id} className="border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={heroImage.image_url}
                      alt={heroImage.alt_text || 'Hero image'}
                      className="w-32 h-18 object-cover rounded-lg border"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">
                        {heroImage.page_name} Page
                      </h3>
                      <Badge variant={heroImage.is_active ? 'default' : 'secondary'}>
                        {heroImage.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {heroImage.alt_text && (
                      <p className="text-gray-600 mb-2">{heroImage.alt_text}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(heroImage.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(heroImage.image_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(heroImage.id, !heroImage.is_active)}
                    >
                      {heroImage.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(heroImage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {heroImages.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hero images found</h3>
              <p className="text-gray-600">Add a hero image to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroImageManagement;