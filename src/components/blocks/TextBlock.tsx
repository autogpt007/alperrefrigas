import React from 'react';
import { TextBlockContent } from '@/types/page-blocks';

// Simple HTML sanitizer
const sanitizeHTML = (html: string): string => {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
};

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
  const sanitizedContent = sanitizeHTML(content.content);

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