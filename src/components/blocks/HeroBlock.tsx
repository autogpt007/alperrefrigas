import React from 'react';
import { HeroBlockContent } from '@/types/page-blocks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroBlockProps {
  content: HeroBlockContent;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ content }) => {
  return (
    <section 
      className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"
      style={content.backgroundImage ? { backgroundImage: `url(${content.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="container mx-auto px-4 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
          {content.subtitle}
        </p>
        {content.buttonText && content.buttonLink && (
          <Button asChild size="lg">
            <Link to={content.buttonLink}>{content.buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroBlock;
