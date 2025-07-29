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

  // Generate srcset for responsive images with WebP support
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
        // Prefer WebP format for better compression
        const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `${size.suffix}.webp`);
        const fallbackSrc = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `${size.suffix}.$1`);
        return `${webpSrc} ${size.width}w`;
      })
      .join(', ');
  };

  // Generate WebP source element
  const generateWebPSource = (baseSrc: string) => {
    const srcSet = generateSrcSet(baseSrc);
    if (!srcSet) return null;
    
    return (
      <source
        srcSet={srcSet}
        sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px"
        type="image/webp"
      />
    );
  };

  const optimizedAlt = getOptimizedAlt(alt);
  const srcSet = generateSrcSet(src);
  const webpSource = generateWebPSource(src);

  return (
    <picture>
      {webpSource}
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
    </picture>
  );
};

export default ImageOptimizer;