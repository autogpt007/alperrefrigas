import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const ImageOptimizer: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false
}) => {
  // Generate optimized alt text with keywords for refrigerant images
  const getOptimizedAlt = (originalAlt: string) => {
    if (!originalAlt) return 'Professional refrigerant distribution equipment';
    
    // Add relevant keywords if not present
    const keywords = ['refrigerant', 'HVAC', 'cooling', 'EPA certified'];
    const lowercaseAlt = originalAlt.toLowerCase();
    
    let optimizedAlt = originalAlt;
    
    // Add context if generic terms are used
    if (lowercaseAlt.includes('product') && !lowercaseAlt.includes('refrigerant')) {
      optimizedAlt = originalAlt.replace(/product/i, 'refrigerant product');
    }
    
    if (lowercaseAlt.includes('equipment') && !lowercaseAlt.includes('hvac')) {
      optimizedAlt = originalAlt.replace(/equipment/i, 'HVAC equipment');
    }
    
    return optimizedAlt;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!width || !height) return undefined;
    
    const sizes = [
      { suffix: '_320w', width: 320 },
      { suffix: '_640w', width: 640 },
      { suffix: '_960w', width: 960 },
      { suffix: '_1280w', width: 1280 }
    ];
    
    return sizes
      .filter(size => size.width <= (width || 1280))
      .map(size => {
        const optimizedSrc = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `${size.suffix}.$1`);
        return `${optimizedSrc} ${size.width}w`;
      })
      .join(', ');
  };

  const optimizedAlt = getOptimizedAlt(alt);
  const srcSet = generateSrcSet(src);

  return (
    <img
      src={src}
      alt={optimizedAlt}
      title={title || optimizedAlt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      srcSet={srcSet}
      sizes={srcSet ? "(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px" : undefined}
      decoding="async"
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        objectFit: 'cover'
      }}
    />
  );
};

export default ImageOptimizer;