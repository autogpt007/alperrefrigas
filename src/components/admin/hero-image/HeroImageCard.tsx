import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2 } from 'lucide-react';
import { HeroImage } from '@/types/hero-image';

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
  return (
    <Card className="border">
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
              onClick={() => onToggleActive(heroImage.id, !heroImage.is_active)}
            >
              {heroImage.is_active ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(heroImage.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};