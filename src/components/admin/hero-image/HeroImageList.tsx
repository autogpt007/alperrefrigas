import React from 'react';
import { HeroImageCard } from './HeroImageCard';
import { HeroImage } from '@/types/hero-image';

interface HeroImageListProps {
  heroImages: HeroImage[];
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export const HeroImageList: React.FC<HeroImageListProps> = ({
  heroImages,
  onToggleActive,
  onDelete
}) => {
  if (heroImages.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hero images found</h3>
        <p className="text-gray-600">Add a hero image to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {heroImages.map((heroImage) => (
        <HeroImageCard
          key={heroImage.id}
          heroImage={heroImage}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};