import React from 'react';
import { Link } from 'react-router-dom';

interface InternalLinkProps {
  text: string;
  href: string;
  keywords?: string[];
  context?: string;
  className?: string;
}

const InternalLink: React.FC<InternalLinkProps> = ({
  text,
  href,
  keywords = [],
  context,
  className = 'text-blue-600 hover:text-blue-800 underline'
}) => {
  return (
    <Link 
      to={href} 
      className={className}
      title={context || `Learn more about ${text.toLowerCase()}`}
    >
      {text}
    </Link>
  );
};

// Pre-defined internal link suggestions for refrigerant content
export const RefrigerantLinks = {
  // Product category links
  hfcRefrigerants: (
    <InternalLink
      text="HFC refrigerants"
      href="/products/category/hfc"
      keywords={['HFC', 'R-410A', 'R-134a', 'R-404A']}
      context="Browse our complete HFC refrigerant catalog with wholesale pricing"
    />
  ),
  
  hfoRefrigerants: (
    <InternalLink
      text="HFO refrigerants"
      href="/products/category/hfo"
      keywords={['HFO', 'R-1234yf', 'R-1234ze', 'low-GWP']}
      context="Explore low-GWP HFO refrigerants for environmental compliance"
    />
  ),
  
  automotiveRefrigerants: (
    <InternalLink
      text="automotive refrigerants"
      href="/products/category/automotive"
      keywords={['automotive', 'R-134a', 'R-1234yf', 'AC service']}
      context="Shop automotive refrigerants for vehicle AC systems"
    />
  ),

  // Service pages
  epaCompliance: (
    <InternalLink
      text="EPA Section 608 compliance"
      href="/compliance"
      keywords={['EPA', 'Section 608', 'compliance', 'certification']}
      context="Learn about EPA refrigerant handling requirements and certifications"
    />
  ),
  
  bulkPricing: (
    <InternalLink
      text="bulk refrigerant pricing"
      href="/rfq"
      keywords={['bulk pricing', 'wholesale', 'contractor rates', 'volume discounts']}
      context="Get competitive wholesale pricing for bulk refrigerant orders"
    />
  ),
  
  refrigerantCertifications: (
    <InternalLink
      text="refrigerant certifications"
      href="/certifications"
      keywords={['certifications', 'quality assurance', 'purity testing', 'standards']}
      context="View our quality certifications and purity testing standards"
    />
  ),

  // Content pages
  hvacSupport: (
    <InternalLink
      text="HVAC technical support"
      href="/support"
      keywords={['HVAC support', 'technical assistance', 'troubleshooting', 'expert help']}
      context="Access expert HVAC technical support and troubleshooting guides"
    />
  ),
  
  refrigerantFAQ: (
    <InternalLink
      text="refrigerant FAQ"
      href="/faq"
      keywords={['FAQ', 'frequently asked questions', 'refrigerant help', 'answers']}
      context="Find answers to common refrigerant questions and regulations"
    />
  ),

  // Company pages
  aboutRefrigerantDistributor: (
    <InternalLink
      text="about our refrigerant distribution company"
      href="/about"
      keywords={['refrigerant distributor', 'company history', 'expertise', 'experience']}
      context="Learn about our 13+ years of professional refrigerant distribution experience"
    />
  ),
  
  customerTestimonials: (
    <InternalLink
      text="customer testimonials"
      href="/testimonials"
      keywords={['testimonials', 'customer reviews', 'HVAC contractor feedback', 'success stories']}
      context="Read success stories from HVAC contractors and refrigeration professionals"
    />
  )
};

// Context-aware link suggestions
export const getContextualLinks = (pageType: string, content: string) => {
  const suggestions: JSX.Element[] = [];
  const lowerContent = content.toLowerCase();

  if (pageType === 'product' || lowerContent.includes('refrigerant')) {
    if (lowerContent.includes('r-410a') || lowerContent.includes('hfc')) {
      suggestions.push(RefrigerantLinks.hfcRefrigerants);
    }
    if (lowerContent.includes('automotive') || lowerContent.includes('r-134a')) {
      suggestions.push(RefrigerantLinks.automotiveRefrigerants);
    }
    if (lowerContent.includes('low-gwp') || lowerContent.includes('environmental')) {
      suggestions.push(RefrigerantLinks.hfoRefrigerants);
    }
  }

  if (lowerContent.includes('bulk') || lowerContent.includes('wholesale')) {
    suggestions.push(RefrigerantLinks.bulkPricing);
  }

  if (lowerContent.includes('epa') || lowerContent.includes('compliance')) {
    suggestions.push(RefrigerantLinks.epaCompliance);
  }

  if (lowerContent.includes('certification') || lowerContent.includes('quality')) {
    suggestions.push(RefrigerantLinks.refrigerantCertifications);
  }

  return suggestions;
};

export default InternalLink;