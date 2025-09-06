import React from 'react';

interface BlogContentProcessorProps {
  content: string;
  title: string;
}

const BlogContentProcessor: React.FC<BlogContentProcessorProps> = ({ content, title }) => {
  const processContent = (html: string, postTitle: string): string => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Fix heading hierarchy - ensure only one H1 (which should be the title)
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let h2Counter = 0;

    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName[1]);
      
      // Convert all H1s in content to H2s (main title is handled separately)
      if (currentLevel === 1) {
        const newH2 = document.createElement('h2');
        newH2.innerHTML = heading.innerHTML;
        newH2.className = 'text-2xl font-bold text-white mb-4 mt-8';
        heading.parentNode?.replaceChild(newH2, heading);
        h2Counter++;
      } else if (currentLevel === 2) {
        heading.className = 'text-2xl font-bold text-white mb-4 mt-8';
        h2Counter++;
      } else if (currentLevel === 3) {
        heading.className = 'text-xl font-semibold text-white mb-3 mt-6';
      } else if (currentLevel === 4) {
        heading.className = 'text-lg font-semibold text-gray-200 mb-3 mt-4';
      } else if (currentLevel === 5) {
        heading.className = 'text-base font-semibold text-gray-300 mb-2 mt-4';
      } else if (currentLevel === 6) {
        heading.className = 'text-sm font-semibold text-gray-400 mb-2 mt-3';
      }
    });

    // Style paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.className = 'text-gray-300 mb-4 leading-relaxed';
    });

    // Style lists
    const lists = tempDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.className = 'text-gray-300 mb-4 ml-6';
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        item.className = 'mb-2';
      });
    });

    // Style blockquotes
    const blockquotes = tempDiv.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      quote.className = 'border-l-4 border-cyan-500 pl-4 py-2 my-6 bg-slate-800/30 rounded-r text-gray-300 italic';
    });

    // Style links to be internal refrigerant product links where applicable
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent?.toLowerCase() || '';
      
      // Add styling
      link.className = 'text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300';
      
      // Convert refrigerant mentions to product links
      if (!href && (text.includes('r-410a') || text.includes('r410a'))) {
        link.setAttribute('href', '/products/r-410a');
        link.setAttribute('title', 'R-410A Refrigerant - North American Refrigerants');
      } else if (!href && (text.includes('r-134a') || text.includes('r134a'))) {
        link.setAttribute('href', '/products/r-134a');
        link.setAttribute('title', 'R-134A Refrigerant - North American Refrigerants');
      } else if (!href && (text.includes('r-22') || text.includes('r22'))) {
        link.setAttribute('href', '/products/r-22');
        link.setAttribute('title', 'R-22 Refrigerant - North American Refrigerants');
      }
    });

    // Add structured content sections for better SEO
    const processedContent = tempDiv.innerHTML;
    
    // Add call-to-action sections if not present
    if (!processedContent.includes('contact') && !processedContent.includes('quote')) {
      const ctaSection = `
        <div class="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg p-6 my-8">
          <h3 class="text-xl font-semibold text-white mb-3">Need Professional Refrigerant Solutions?</h3>
          <p class="text-gray-300 mb-4">Contact our expert team for customized refrigerant solutions, bulk pricing, and technical support.</p>
          <a href="/contact" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-all duration-300">Get Expert Consultation</a>
        </div>
      `;
      return processedContent + ctaSection;
    }

    return processedContent;
  };

  const processedHTML = processContent(content, title);

  return (
    <div 
      className="prose prose-lg prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedHTML }}
    />
  );
};

export default BlogContentProcessor;