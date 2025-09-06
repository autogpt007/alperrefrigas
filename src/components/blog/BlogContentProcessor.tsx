import React from 'react';
import { marked } from 'marked';
import { useProducts } from '@/contexts/ProductsContext';
import { createProductSlug } from '@/lib/slugs';

interface BlogContentProcessorProps {
  content: string;
  title: string;
}

const BlogContentProcessor: React.FC<BlogContentProcessorProps> = ({ content, title }) => {
  const { products } = useProducts();

  // Function to find product by refrigerant type and generate correct slug
  const findRefrigerantProduct = (refrigerantType: string) => {
    const normalizedType = refrigerantType.toLowerCase().replace(/[-\s]/g, '');
    
    // Find product that matches the refrigerant type - prioritize main refrigerant products
    const product = products.find(p => {
      const productName = p.name.toLowerCase();
      // Look for exact refrigerant type match in name, prioritizing main refrigerant products
      return (productName.includes(refrigerantType.toLowerCase()) && 
              (productName.includes('refrigerant') || productName.includes('gas'))) ||
             (p.chemicalFormula && p.chemicalFormula.toLowerCase().replace(/[-\s]/g, '') === normalizedType) ||
             (p.sku && p.sku.toLowerCase().replace(/[-\s]/g, '') === normalizedType);
    });
    
    if (product) {
      const slug = createProductSlug(product.name);
      return {
        slug: `/products/${slug}`,
        title: `${product.name} - North American Refrigerants`,
        name: product.name
      };
    }
    
    return null;
  };
  const processContent = (html: string, postTitle: string): string => {
    let processedContent = html;
    
    // Clean up malformed markdown/HTML combinations
    processedContent = processedContent
      .replace(/#+\s*<h[1-6][^>]*>/gi, '') // Remove markdown headers before HTML headers
      .replace(/#+\s*([^<\n]+)/g, (match, text) => `<h2>${text.trim()}</h2>`) // Convert remaining markdown headers
      .replace(/<\/h[1-6]>\s*#+/gi, '') // Remove markdown syntax after HTML headers
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold markdown
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Convert italic markdown
    
    // If content looks like pure markdown, convert it
    if (!processedContent.includes('<') && (processedContent.includes('#') || processedContent.includes('*'))) {
      processedContent = marked(processedContent) as string;
    }
    
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedContent;

    // Fix heading hierarchy - ensure only one H1 (which should be the title)
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let h2Counter = 0;

    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName[1]);
      
      // Convert all H1s in content to H2s (main title is handled separately)
      if (currentLevel === 1) {
        const newH2 = document.createElement('h2');
        newH2.innerHTML = heading.innerHTML;
        newH2.className = 'text-2xl font-bold text-white mb-4 mt-8 drop-shadow-sm';
        heading.parentNode?.replaceChild(newH2, heading);
        h2Counter++;
      } else if (currentLevel === 2) {
        heading.className = 'text-2xl font-bold text-white mb-4 mt-8 drop-shadow-sm';
        h2Counter++;
      } else if (currentLevel === 3) {
        heading.className = 'text-xl font-semibold text-white mb-3 mt-6 drop-shadow-sm';
      } else if (currentLevel === 4) {
        heading.className = 'text-lg font-semibold text-gray-100 mb-3 mt-4 drop-shadow-sm';
      } else if (currentLevel === 5) {
        heading.className = 'text-base font-semibold text-gray-100 mb-2 mt-4 drop-shadow-sm';
      } else if (currentLevel === 6) {
        heading.className = 'text-sm font-semibold text-gray-100 mb-2 mt-3 drop-shadow-sm';
      }
    });

    // Style paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.className = 'text-gray-100 mb-4 leading-relaxed drop-shadow-sm';
    });

    // Style lists
    const lists = tempDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.className = 'text-gray-100 mb-4 ml-6 drop-shadow-sm';
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        item.className = 'mb-2';
      });
    });

    // Style blockquotes
    const blockquotes = tempDiv.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      quote.className = 'border-l-4 border-cyan-500 pl-4 py-2 my-6 bg-slate-800/50 rounded-r text-gray-100 italic drop-shadow-sm';
    });

    // Style links and convert refrigerant mentions to actual product links
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent?.toLowerCase() || '';
      
      // Add styling
      link.className = 'text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300';
      
      // Convert refrigerant mentions to actual product links
      if (!href) {
        let productInfo = null;
        
        // Check for various refrigerant patterns
        if (text.includes('r-410a') || text.includes('r410a')) {
          productInfo = findRefrigerantProduct('R-410A');
        } else if (text.includes('r-134a') || text.includes('r134a')) {
          productInfo = findRefrigerantProduct('R-134A');
        } else if (text.includes('r-22') || text.includes('r22')) {
          productInfo = findRefrigerantProduct('R-22');
        } else if (text.includes('r-32') || text.includes('r32')) {
          productInfo = findRefrigerantProduct('R-32');
        } else if (text.includes('r-404a') || text.includes('r404a')) {
          productInfo = findRefrigerantProduct('R-404A');
        } else if (text.includes('r-407c') || text.includes('r407c')) {
          productInfo = findRefrigerantProduct('R-407C');
        }
        
        if (productInfo) {
          link.setAttribute('href', productInfo.slug);
          link.setAttribute('title', productInfo.title);
        }
      }
    });

    // Add relevant external links for SEO and user value
    const addExternalLinks = () => {
      const textNodes = tempDiv.querySelectorAll('p, li');
      textNodes.forEach(node => {
        let html = node.innerHTML;
        
        // Add EPA links
        if (html.includes('EPA') && !html.includes('href')) {
          html = html.replace(/\bEPA\b/g, '<a href="https://www.epa.gov/section608" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300">EPA</a>');
        }
        
        // Add HVAC industry links
        if ((html.includes('HVAC') || html.includes('air conditioning')) && !html.includes('href')) {
          html = html.replace(/\bHVAC\b/g, '<a href="https://www.acca.org/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300">HVAC</a>');
        }
        
        // Add refrigerant industry authority links
        if (html.includes('refrigerant safety') || html.includes('ASHRAE')) {
          html = html.replace(/\bASHRAE\b/g, '<a href="https://www.ashrae.org/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300">ASHRAE</a>');
        }
        
        node.innerHTML = html;
      });
    };
    
    addExternalLinks();

    // Add structured content sections for better SEO
    const finalContent = tempDiv.innerHTML;
    
    // Add call-to-action sections if not present
    if (!finalContent.includes('contact') && !finalContent.includes('quote')) {
      const ctaSection = `
        <div class="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg p-6 my-8">
          <h3 class="text-xl font-semibold text-white mb-3 drop-shadow-sm">Need Professional Refrigerant Solutions?</h3>
          <p class="text-gray-100 mb-4 drop-shadow-sm">Contact our expert team for customized refrigerant solutions, bulk pricing, and technical support.</p>
          <a href="/contact" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-all duration-300">Get Expert Consultation</a>
        </div>
      `;
      return finalContent + ctaSection;
    }

    return finalContent;
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