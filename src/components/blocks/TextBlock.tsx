import React from 'react';
import DOMPurify from 'dompurify';
import { TextBlockContent } from '@/types/page-blocks';

interface TextBlockProps {
  content: TextBlockContent;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content.content, {
    ADD_ATTR: ['target', 'rel', 'class', 'style'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto ${alignmentClasses[content.alignment || 'left']}`}>
          {content.title && (
            <h2 className="text-3xl font-bold mb-6 text-foreground">{content.title}</h2>
          )}
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </section>
  );
};

export default TextBlock;