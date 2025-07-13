import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { HeroImageFormData, PAGE_OPTIONS, PageOption } from '@/types/hero-image';

interface HeroImageFormProps {
  formData: HeroImageFormData;
  onFormDataChange: (data: HeroImageFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const HeroImageForm: React.FC<HeroImageFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  const updateFormData = (updates: Partial<HeroImageFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const selectedPage = PAGE_OPTIONS.find(option => option.value === formData.page_name);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add/Edit Hero Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="page_name">Select Page *</Label>
            <Select 
              value={formData.page_name} 
              onValueChange={(value) => updateFormData({ page_name: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="py-2">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPage && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md border">
                <h4 className="font-medium text-blue-900 mb-2">Image Guidelines for {selectedPage.label}</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Usage:</strong> {selectedPage.usage}</li>
                  <li><strong>Recommended Size:</strong> {selectedPage.recommendedSize}</li>
                  <li><strong>Format:</strong> JPG or PNG, optimized for web</li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <Label>Hero Image</Label>
            <ImageUpload
              onImageUploaded={(url) => updateFormData({ image_url: url })}
              currentImage={formData.image_url}
              bucket="images"
            />
          </div>

          <div>
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => updateFormData({ alt_text: e.target.value })}
              placeholder="Descriptive text for accessibility"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => updateFormData({ is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit">Save Hero Image</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};