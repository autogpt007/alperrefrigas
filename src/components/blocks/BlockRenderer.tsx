import React from 'react';
import { PageBlock } from '@/types/page-blocks';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import CtaBlock from './CtaBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import TestimonialsBlock from './TestimonialsBlock';
import ProductsBlock from './ProductsBlock';

interface BlockRendererProps {
  block: PageBlock;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.block_type) {
    case 'hero':
      return <HeroBlock content={block.content as any} />;
    case 'features':
      return <FeaturesBlock content={block.content as any} />;
    case 'cta':
      return <CtaBlock content={block.content as any} />;
    case 'text':
      return <TextBlock content={block.content as any} />;
    case 'image':
      return <ImageBlock content={block.content as any} />;
    case 'video':
      return <VideoBlock content={block.content as any} />;
    case 'testimonials':
      return <TestimonialsBlock content={block.content as any} />;
    case 'products':
      return <ProductsBlock content={block.content as any} />;
    default:
      return null;
  }
};

export default BlockRenderer;
