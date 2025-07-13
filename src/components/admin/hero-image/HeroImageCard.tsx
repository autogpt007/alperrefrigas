import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, ExternalLink, Info } from 'lucide-react';
import { HeroImage } from '@/types/hero-image';
import { PAGE_OPTIONS } from '@/types/hero-image';

interface HeroImageCardProps {
  heroImage: HeroImage;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export const HeroImageCard: React.FC<HeroImageCardProps> = ({
  heroImage,
  onToggleActive,
  onDelete
}) => {
  const pageOption = PAGE_OPTIONS.find(option => option.value === heroImage.page_name);
  
  return (
    <Card className="border overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image Preview */}
          <div className="w-40 h-32 bg-gray-100 flex-shrink-0">
            <img
              src={heroImage.image_url}
              alt={heroImage.alt_text || 'Hero image'}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {pageOption?.label || `${heroImage.page_name} Page`}
                </h3>
                <Badge variant={heroImage.is_active ? 'default' : 'secondary'} className="mt-1">
                  {heroImage.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            {/* Usage Information */}
            {pageOption && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Usage: {pageOption.usage}</div>
                    <div className="text-blue-700">Recommended: {pageOption.recommendedSize}</div>
                  </div>
                </div>
              </div>
            )}
            
            {heroImage.alt_text && (
              <p className="text-sm text-gray-600 mb-3">
                <strong>Alt text:</strong> {heroImage.alt_text}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mb-4">
              Last updated: {new Date(heroImage.updated_at).toLocaleDateString()}
            </p>
            
            {/* Actions */}
            <div className="flex space-x-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(heroImage.image_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Full
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleActive(heroImage.id, !heroImage.is_active)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {heroImage.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(heroImage.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};