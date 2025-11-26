import React from 'react';
import { TestimonialsBlockContent } from '@/types/page-blocks';
import TestimonialSection from '@/components/ui/TestimonialSection';

interface TestimonialsBlockProps {
  content: TestimonialsBlockContent;
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ content }) => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {content.title}
        </h2>
        <TestimonialSection />
      </div>
    </section>
  );
};

export default TestimonialsBlock;
