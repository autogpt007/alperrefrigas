import React from 'react';
import { ImageBlockContent } from '@/types/page-blocks';

interface ImageBlockProps {
  content: ImageBlockContent;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ content }) => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <figure className="max-w-4xl mx-auto">
          <img 
            src={content.url} 
            alt={content.alt} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {content.caption && (
            <figcaption className="text-center mt-4 text-sm text-muted-foreground">
              {content.caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
};

export default ImageBlock;
