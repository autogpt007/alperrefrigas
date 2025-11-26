import React from 'react';
import { CtaBlockContent } from '@/types/page-blocks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CtaBlockProps {
  content: CtaBlockContent;
}

const CtaBlock: React.FC<CtaBlockProps> = ({ content }) => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">{content.title}</h2>
        <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
          {content.description}
        </p>
        <Button asChild size="lg" variant="default">
          <Link to={content.buttonLink}>{content.buttonText}</Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaBlock;
