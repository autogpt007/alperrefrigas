import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HeroImage } from '@/types/hero-image';
import { Badge } from '@/components/ui/badge';
import { Eye, Image as ImageIcon, MapPin } from 'lucide-react';

// Define specific image locations with clear descriptions
const IMAGE_LOCATIONS = [
  {
    value: 'homepage-hero',
    label: 'Homepage - Hero Background',
    description: 'Main background image for the homepage hero section (1920x1080px recommended)',
    usage: 'Displayed as the primary background on your homepage with overlay text'
  },
  {
    value: 'about-hero',
    label: 'About Us - Hero Background', 
    description: 'Background image for the About Us page hero section (1920x1080px recommended)',
    usage: 'Displayed as the background behind "About Alper Refrigerants" title'
  },
  {
    value: 'about-facility',
    label: 'About Us - Professional Facility',
    description: 'Image showing your professional facility under the mission section (800x400px recommended)',
    usage: 'Displayed under "Alper Refrigerants Professional Facility" in the mission section'
  },
  {
    value: 'products-hero',
    label: 'Products - Hero Background',
    description: 'Background image for the Products page hero section (1920x1080px recommended)',
    usage: 'Displayed as the background for the products page header'
  },
  {
    value: 'contact-hero',
    label: 'Contact Us - Hero Background',
    description: 'Background image for the Contact Us page hero section (1920x1080px recommended)',
    usage: 'Displayed as the background for the contact page header'
  },
  {
    value: 'blog-hero',
    label: 'Blog - Hero Background',
    description: 'Background image for the Blog page hero section (1920x1080px recommended)',
    usage: 'Displayed as the background for the blog page header'
  },
  {
    value: 'certifications-hero',
    label: 'Certifications - Hero Background',
    description: 'Background image for the Certifications page hero section (1920x1080px recommended)',
    usage: 'Displayed as the background for the certifications page header'
  }
];

const HeroImageManagement = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isActive, setIsActive] = useState(true);

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
    
    if (!selectedLocation || !imageUrl) {
      toast.error('Please select a location and upload an image');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hero_images')
        .upsert([{
          page_name: selectedLocation,
          image_url: imageUrl,
          alt_text: altText || null,
          is_active: isActive
        }], {
          onConflict: 'page_name'
        })
        .select();

      if (error) throw error;

      toast.success('Image saved successfully');
      handleCancelForm();
      fetchHeroImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedLocation('');
    setImageUrl('');
    setAltText('');
    setIsActive(true);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev =>
        prev.map(img =>
          img.id === id ? { ...img, is_active: !currentActive } : img
        )
      );

      toast.success(`Image ${!currentActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHeroImages(prev => prev.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const getLocationInfo = (pageName: string) => {
    return IMAGE_LOCATIONS.find(loc => loc.value === pageName);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-lg">Loading images...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Image Management</CardTitle>
        <CardDescription>
          Upload images for specific locations on your website. Each location shows exactly where your image will appear.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New Image'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Add Website Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="location">Image Location *</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select where this image will appear" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLocation && (
                    <div className="mt-2 p-3 bg-white border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            {getLocationInfo(selectedLocation)?.description}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Usage: {getLocationInfo(selectedLocation)?.usage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Upload Image *</Label>
                  <ImageUpload
                    onImageUploaded={setImageUrl}
                    currentImage={imageUrl}
                    bucket="images"
                  />
                </div>

                <div>
                  <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
                  <Input
                    id="alt-text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image for screen readers"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is-active">Make this image active</Label>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">Save Image</Button>
                  <Button type="button" variant="outline" onClick={handleCancelForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Website Images</h3>
          {heroImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4" />
              <p>No images uploaded yet. Add your first image above.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {heroImages.map((image) => {
                const locationInfo = getLocationInfo(image.page_name);
                return (
                  <Card key={image.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={image.image_url}
                            alt={image.alt_text || 'Website image'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {locationInfo?.label || image.page_name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {locationInfo?.usage || 'Custom location'}
                              </p>
                              {image.alt_text && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Alt text: {image.alt_text}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={image.is_active ? "default" : "secondary"}>
                                {image.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(image.id, image.is_active)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(image.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Usage Guidelines */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Image Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Hero backgrounds:</strong> Use 1920x1080px for best quality (16:9 aspect ratio)</li>
            <li>• <strong>Facility images:</strong> Use 800x400px for optimal display (2:1 aspect ratio)</li>
            <li>• <strong>File formats:</strong> JPG, PNG, and WebP are supported</li>
            <li>• <strong>File size:</strong> Keep images under 2MB for fast loading</li>
            <li>• <strong>Alt text:</strong> Add descriptive text for accessibility and SEO</li>
            <li>• <strong>Active status:</strong> Only active images are displayed on the website</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroImageManagement;